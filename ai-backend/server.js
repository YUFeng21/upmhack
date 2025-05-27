const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const JamAI = require('jamaibase');
const multer = require('multer'); // Import multer
const path = require('path');
const fs = require('fs');
const fileUpload = require("express-fileupload");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize JamAI client
const jamai = new JamAI({
    token: process.env.JAMAI_API_KEY,
    projectId: process.env.JAMAI_PROJECT_ID
});

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' })); // Increase limit for JSON payloads
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true })); // Increase limit for URL-encoded data
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 } // Set limit to 5 MB for file uploads
}));

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Directory to save uploaded files

// Single chat endpoint for text messages and images
app.post('/chat', upload.single('image'), async (req, res) => {
    try {
        const { message, userId } = req.body;
        const image = req.file; // Retrieve uploaded image using multer

        // Ensure message or image is provided
        if (!message && !image) {
            return res.status(400).json({ error: "Message or image is required" });
        }

        const jamaiData = { question: message || "No text provided" };

        if (image) {
            // Use the image file path directly
            jamaiData.image = {
                data: fs.readFileSync(image.path).toString('base64'), // Convert to base64 if needed
                mimeType: image.mimetype, // Use the MIME type from multer
            };
        }

        console.log("Data being sent to JamAI:", jamaiData);

        // Send data to JamAI
        const jamaiResponse = await jamai.table.addRow({
            table_type: "action",
            table_id: process.env.JAMAI_TABLE_ID,
            data: [jamaiData],
            reindex: null,
            concurrent: false,
        });

        console.log("✅ Data sent to JamAI:", jamaiResponse);
        res.status(200).json({ message: "Row added successfully", jamaiResponse });

    } catch (error) {
        console.error("❌ Error processing chat request:", error);
        res.status(500).json({ error: "Failed to process request", details: error.message });
    }
});

// Add GET endpoint for /chat
app.get('/chat', (req, res) => {
    res.status(200).json({ message: 'Chat endpoint is ready' });
});

// Add this endpoint to fetch farm data
app.get("/get-farm-data", async (_, res) => {
    try {
        // Fetch rows from the JamAI table with specific columns and table type
        const response = await jamai.table.listRows({
            table_id: process.env.JAMAI_TABLE_ID,
            table_type: "action", // Include the table type
            column: ["type_plant", "environment", "suitable_soil", "watering_amount"] // Specify the columns you want
        });

        // Check if response is valid
        if (!response || !Array.isArray(response.items)) {
            return res.status(500).json({ error: "Invalid response from JamAI" });
        }

        // Format the data
        const formattedData = response.items.map(item => ({
            type_plant: item["type_plant"]?.value || "N/A",
            environment: item["environment"]?.value || "N/A",
            suitable_soil: item["suitable_soil"]?.value || "N/A",
            watering_amount: item["watering_amount"]?.value || "N/A"
        }));

        // Send the formatted data as a response
        console.log('JamAI response:', response);
        res.status(200).json(formattedData);
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        res.status(500).json({ error: "Failed to retrieve data" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});