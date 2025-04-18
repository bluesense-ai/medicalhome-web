import { Message } from "../../Chatbot/components/types";
import { queryChatbot } from "./chatbotService";

// Clinical responses with formatted info
const clinicalResponses = [
  "According to GINA 2024 guidelines, low-dose ICS-formoterol as needed is preferred for mild asthma in adults.\n\nDosage: 100-200 mcg\nFrequency: As needed\nContraindications: Severe hypersensitivity to components",
  "Amoxicillin Dosing Information:\n\nAdults: 500mg every 8 hours\nChildren: 20-90mg/kg/day divided every 8 hours\nAdministration: Can be taken with or without food\nDuration: Typically 7-14 days depending on infection",
  "Drug interaction detected:\n\nWarfarin + NSAIDs\nSeverity: High\nEffect: Increased bleeding risk\nRecommendation: Avoid combination if possible or monitor INR closely",
  "First line treatment for hypertension:\n\nACE inhibitors or ARBs for patients under 55\nCalcium channel blockers for patients over 55\nMonitor kidney function when starting ACE inhibitors"
];

// Get response based on input content
export const getAIResponse = async (userMessage: string): Promise<Message> => {
  try {
    // Send the query to the chatbot API
    const apiResponse = await queryChatbot(userMessage);
    
    // Return the response
    return {
      id: Date.now().toString(),
      text: apiResponse,
      isUser: false,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error in API call:', error);
    return {
      id: Date.now().toString(),
      text: 'Sorry, I encountered an error while processing your request. Please try again later.',
      isUser: false,
      timestamp: new Date()
    };
  }
};

export const sendMessageToAI = async (message: string): Promise<Message> => {
  return await getAIResponse(message);
}; 