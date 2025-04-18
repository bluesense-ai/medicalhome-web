import config from '../../../../../../config';
import axios from 'axios';

interface ChatbotResponse {
  response: string;
  error?: string;
}

export const queryChatbot = async (query: string): Promise<string> => {
  try {
    // Log API request for debugging
    console.log(`Sending request to: ${config.apiUrl}/chat with query:`, query);
    
    const response = await axios({
      method: 'post',
      url: `${config.apiUrl}/chat`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${config.hfToken}`
      },
      data: { query },
      timeout: 10000 // 10 second timeout
    });
    
    // Log response for debugging
    console.log('API response status:', response.status);
    console.log('API response data:', response.data);
    
    if (response.data && response.data.response) {
      return response.data.response;
    } else {
      console.error('Unexpected response format:', response.data);
      return 'Sorry, received an unexpected response from the server.';
    }
  } catch (error) {
    console.error('Error querying chatbot:', error);
    
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return 'Request timed out. The server might be busy or temporarily unavailable.';
      }
      
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        return `Server error: ${error.response.status}. Please try again later.`;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        return 'No response from server. Please check your connection and try again.';
      }
    }
    
    // Generic error message
    return 'Sorry, an error occurred while connecting to the chatbot service.';
  }
}; 