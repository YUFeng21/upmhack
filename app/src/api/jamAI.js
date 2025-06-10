import axios from 'axios';

const JAM_AI_API_URL = 'https://api.jamaibase.com';
const JAM_AI_API_KEY = 'jamai_pat_515e59bd2c8c6e315cf11ef6361556838650a47631c6c868';
const JAM_AI_PROJECT_ID = 'proj_cf47c021e73c23f7195d29ec';
const JAM_AI_TABLE_ID = 'vhack25';

const jamAIClient = axios.create({
  baseURL: JAM_AI_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${JAM_AI_API_KEY}`,
    'X-Project-ID': JAM_AI_PROJECT_ID,
    'X-Table-ID': JAM_AI_TABLE_ID,
  },
});

export const sendMessageToJAM = async (message, imageUrl = null, userId) => {
  try {
    const payload = {
      query: message,
      user_id: userId,
      context: {
        timestamp: new Date().toISOString(),
        platform: 'web',
        has_image: !!imageUrl,
      },
      ...(imageUrl && { image_url: imageUrl }),
    };

    const response = await jamAIClient.post('/chat', payload);
    
    // Adjust based on your JAM AI's response format
    if (response.data && response.data.response) {
      return response.data.response;
    } else {
      throw new Error('Invalid response format from JAM AI');
    }
  } catch (error) {
    console.error('JAM AI API Error:', error);
    throw new Error(error.response?.data?.error || 'Failed to get response from JAM AI');
  }
};

export const analyzeImage = async (imageUrl, userId) => {
  try {
    const payload = {
      image_url: imageUrl,
      user_id: userId,
      analysis_type: 'plant_health', // Adjust based on your JAM AI's capabilities
    };

    const response = await jamAIClient.post('/analyze', payload);
    
    // Adjust based on your JAM AI's response format
    if (response.data && response.data.analysis) {
      return response.data.analysis;
    } else {
      throw new Error('Invalid analysis response format');
    }
  } catch (error) {
    console.error('JAM AI Vision API Error:', error);
    throw new Error(error.response?.data?.error || 'Failed to analyze image');
  }
};

// Add any additional JAM AI specific functions here
export const getChatHistory = async (userId) => {
  try {
    const response = await jamAIClient.get(`/chat/history/${userId}`);
    return response.data.history || [];
  } catch (error) {
    console.error('JAM AI History Error:', error);
    throw new Error('Failed to fetch chat history');
  }
};

export const clearChatHistory = async (userId) => {
  try {
    await jamAIClient.delete(`/chat/history/${userId}`);
    return true;
  } catch (error) {
    console.error('JAM AI Clear History Error:', error);
    throw new Error('Failed to clear chat history');
  }
}; 