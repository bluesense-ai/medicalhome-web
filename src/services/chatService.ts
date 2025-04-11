import { Message } from '../components/chatbot/types';

// Clinical responses with formatted info
const clinicalResponses = [
  "According to GINA 2024 guidelines, low-dose ICS-formoterol as needed is preferred for mild asthma in adults.\n\nDosage: 100-200 mcg\nFrequency: As needed\nContraindications: Severe hypersensitivity to components",
  "Amoxicillin Dosing Information:\n\nAdults: 500mg every 8 hours\nChildren: 20-90mg/kg/day divided every 8 hours\nAdministration: Can be taken with or without food\nDuration: Typically 7-14 days depending on infection",
  "Drug interaction detected:\n\nWarfarin + NSAIDs\nSeverity: High\nEffect: Increased bleeding risk\nRecommendation: Avoid combination if possible or monitor INR closely",
  "First line treatment for hypertension:\n\nACE inhibitors or ARBs for patients under 55\nCalcium channel blockers for patients over 55\nMonitor kidney function when starting ACE inhibitors"
];

// Task management responses
const taskResponses = [
  "I've set a reminder for Dr. Lee to follow up on Mrs. Jensen's bloodwork at 10 AM tomorrow.",
  "Task assigned to Dr. Williams to review patient charts by EOD.",
  "I've added a reminder for you to call the pharmacy about medication supply on Thursday at 3 PM.",
  "Your task list has been updated. You have 3 high priority items due today."
];

// Schedule responses
const scheduleResponses = [
  "The next available slot for a team huddle is Wednesday at 12:30 PM. Would you like me to reserve this time?",
  "Dr. Smith is available tomorrow between 10 AM and 12 PM. Dr. Johnson is available after 2 PM. When would you like to schedule the meeting?",
  "I found 3 available slots for the staff meeting next week:\n- Monday, 9-10 AM\n- Tuesday, 2-3 PM\n- Thursday, 11 AM-12 PM",
  "The conference room is booked for the next 3 days. The first available slot is Friday at 1 PM."
];

// General responses
const generalResponses = [
  "Hello! I'm Medical Home virtual assistant. How can I help you today?",
  "I can help with clinical references, task management, and scheduling. What would you like assistance with?",
  "At Medical Home, we bring healthcare services right to your computer or device.",
  "Is there anything specific you'd like to know about our services?",
  "How else can I assist you today?"
];

// Get response based on input content
export const getAIResponse = async (userMessage: string): Promise<Message> => {
  // Classify the message to determine response type
  const message = userMessage.toLowerCase();
  let responseArray = generalResponses;
  
  if (message.includes('drug') || 
      message.includes('dose') || 
      message.includes('treatment') || 
      message.includes('medication') ||
      message.includes('clinical')) {
    responseArray = clinicalResponses;
  } else if (message.includes('remind') || 
            message.includes('task') || 
            message.includes('assign') ||
            message.includes('todo')) {
    responseArray = taskResponses;
  } else if (message.includes('schedule') || 
            message.includes('meeting') || 
            message.includes('available') ||
            message.includes('slot') ||
            message.includes('calendar')) {
    responseArray = scheduleResponses;
  }
  
  // Add artificial delay (for realistic feel)
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Select a random response from the appropriate category
  const randomIndex = Math.floor(Math.random() * responseArray.length);
  
  return {
    id: Date.now().toString(),
    text: responseArray[randomIndex],
    isUser: false,
    timestamp: new Date()
  };
};

export const sendMessageToAI = async (message: string): Promise<Message> => {
  try {
    // For testing purposes only - in a real app this would call an AI API
    return await getAIResponse(message);
  } catch (error) {
    console.error('AI service error:', error);
    return {
      id: Date.now().toString(),
      text: "I'm sorry, I can't respond right now. Please try again later.",
      isUser: false,
      timestamp: new Date()
    };
  }
}; 