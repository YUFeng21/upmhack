const express = require('express');
const router = express.Router();
const { sendMessageToGemini, analyzeImage } = require('../../src/api/gemini');
const { auth } = require('../middleware/auth');

// Middleware to verify Firebase token
router.use(auth);

// Chat endpoint
router.post('/', async (req, res) => {
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

// Add endpoint to get chat history
router.get('/history/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await getChatHistory(userId);
    res.json({ history });
  } catch (error) {
    console.error('Chat History Error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Add endpoint to clear chat history
router.delete('/history/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    await clearChatHistory(userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Clear History Error:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

module.exports = router; 