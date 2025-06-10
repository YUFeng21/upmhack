import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from environment variable
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Debug logging (only shows first 4 characters for security)
console.log('API Key Status:', {
  isPresent: !!GEMINI_API_KEY,
  length: GEMINI_API_KEY?.length || 0,
  prefix: GEMINI_API_KEY?.substring(0, 4) || 'none'
});

// Validate API key
if (!GEMINI_API_KEY) {
  throw new Error(
    'Gemini API key is not set. Please add REACT_APP_GEMINI_API_KEY to your .env file. ' +
    'You can get an API key from the Google Cloud Console.'
  );
}

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Create a chat instance
let chat = null;

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 60, // requests per minute
  windowMs: 60 * 1000, // 1 minute
};

// Track request timestamps for rate limiting
const requestTimestamps = [];

// Helper function to check rate limit
const checkRateLimit = () => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.windowMs;

  // Remove old timestamps
  while (requestTimestamps.length && requestTimestamps[0] < windowStart) {
    requestTimestamps.shift();
  }

  // Check if we're over the limit
  if (requestTimestamps.length >= RATE_LIMIT.maxRequests) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  // Add current timestamp
  requestTimestamps.push(now);
};

// Helper function to validate image data
const validateImageData = (imageUrl) => {
  if (!imageUrl) return null;

  // Handle both data URLs and regular URLs
  if (imageUrl.startsWith('data:')) {
    const [header, data] = imageUrl.split(',');
    const mimeType = header.split(':')[1].split(';')[0];
    
    if (!mimeType.startsWith('image/')) {
      throw new Error('Invalid image format. Please upload a valid image file.');
    }

    // Check file size (assuming base64 data)
    const sizeInBytes = Math.ceil((data.length * 3) / 4);
    if (sizeInBytes > 4 * 1024 * 1024) { // 4MB limit
      throw new Error('Image size should be less than 4MB');
    }

    return {
      mime_type: mimeType,
      data: data
    };
  }

  // For regular URLs, just return the URL
  return {
    mime_type: 'image/jpeg', // Assuming JPEG for URLs
    url: imageUrl
  };
};

export const sendMessageToGemini = async (message, imageUrl = null, userId) => {
  try {
    // Check rate limit
    checkRateLimit();

    // Initialize or get existing chat
    if (!chat) {
      chat = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }).startChat({
        history: [],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      });
    }

    let response;
    if (imageUrl) {
      const imageData = validateImageData(imageUrl);
      if (!imageData) {
        throw new Error('Invalid image data');
      }

      // Create image part
      const imagePart = imageData.url 
        ? { inlineData: { data: imageData.data, mimeType: imageData.mime_type } }
        : { url: imageData.url };

      // Send message with image
      response = await chat.sendMessage([
        { text: message },
        imagePart
      ]);
    } else {
      // Send text-only message
      response = await chat.sendMessage(message);
    }

    // Get the response text
    const result = await response.response;
    return result.text();

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Handle specific error cases
    if (error.message?.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please try again in a minute.');
    } else if (error.message?.includes('invalid')) {
      throw new Error('Invalid request. Please check your input and try again.');
    } else if (error.message?.includes('authentication')) {
      throw new Error('Authentication failed. Please check your API key.');
    } else if (error.message?.includes('permission')) {
      throw new Error('Access denied. Please check your API permissions.');
    } else if (error.message?.includes('model')) {
      throw new Error('Model not found. Please check if the Gemini API is enabled in your Google Cloud Console.');
    }

    throw new Error(error.message || 'Failed to get response from Gemini');
  }
};

// Reset chat history
export const resetChat = () => {
  chat = null;
};

export const analyzeImage = async (imageUrl, userId) => {
  try {
    // Check rate limit
    checkRateLimit();

    const imageData = validateImageData(imageUrl);
    if (!imageData) {
      throw new Error('Invalid image data');
    }

    const payload = {
      contents: [{
        parts: [
          { text: "Analyze this image and provide detailed information about any plants, their health, and potential issues. Focus on agricultural aspects." },
          imageData.url ? { url: imageData.url } : {
            inline_data: {
              mime_type: imageData.mime_type,
              data: imageData.data
            }
          }
        ],
        role: 'user'
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const response = await geminiClient.post(
      '/models/gemini-pro-vision:generateContent',
      payload,
      {
        params: { key: GEMINI_API_KEY },
        retry: 3 // Add retry logic
      }
    );

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text;
    }

    throw new Error('Invalid analysis response format');
  } catch (error) {
    console.error('Gemini Vision API Error:', error);
    
    // Handle specific error cases
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a minute.');
    } else if (error.response?.status === 400) {
      throw new Error('Invalid image format. Please try a different image.');
    } else if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please check your API key.');
    } else if (error.response?.status === 403) {
      throw new Error('Access denied. Please check your API permissions.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }

    throw new Error(error.response?.data?.error?.message || 'Failed to analyze image');
  }
}; 