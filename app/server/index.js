const express = require('express');
const cors = require('cors');
const { sendMessageToGemini, analyzeImage } = require('../src/api/gemini');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for image data

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, imageUrl, userId } = req.body;

    if (!message && !imageUrl) {
      return res.status(400).json({ 
        error: 'Message or image is required',
        details: 'Please provide either a message or an image'
      });
    }

    if (!userId) {
      return res.status(400).json({ 
        error: 'User ID is required',
        details: 'Please provide a valid user ID'
      });
    }

    console.log('Processing chat request:', { 
      messageLength: message?.length,
      hasImage: !!imageUrl,
      userId 
    });

    let reply;
    if (imageUrl) {
      // If there's an image, analyze it first
      const analysis = await analyzeImage(imageUrl, userId);
      
      // Combine the image analysis with the user's message
      const combinedMessage = message 
        ? `${message}\n\nImage Analysis: ${analysis}`
        : `Please analyze this image: ${analysis}`;
      
      reply = await sendMessageToGemini(combinedMessage, imageUrl, userId);
    } else {
      // If it's just a text message
      reply = await sendMessageToGemini(message, null, userId);
    }
    
    console.log('Gemini response received');

    res.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Health check at http://localhost:${PORT}/health`);
}); 