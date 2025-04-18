import { useState, useEffect, useRef } from 'react';
// import ChatWindow from './ChatWindow'; // Keep ChatWindow import commented for now
import ChatPopup from './ChatPopup'; // Import the new popup component
import '../ChatBot.css';
import { useNavigate } from 'react-router-dom';
import { queryChatbot } from '../../common/Services/chatbotService';

// To store message data globally
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Temporarily storing messages in memory
// In a real application, these should be stored in a database
let chatMessages: ChatMessage[] = [];

// Replicated from ChatPage.tsx - Ideally move to a shared service
const sendMessageToApi = async (message: string): Promise<{ response: string, timestamp?: string }> => {
  try {
    console.log("Sending message to Hugging Face API");
    const response = await queryChatbot(message);
    return { response };
  } catch (error) {
    console.error('Chatbot API error:', error);
    // Return an error structure that matches expected response
    return { response: "Sorry, there was an error connecting to the chatbot." }; 
  }
};

const ChatButton = () => {
  // const [isOpen, setIsOpen] = useState(false); // State for old ChatWindow
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for new ChatPopup
  const [popupResults, setPopupResults] = useState<string | null>(null); // State for results in popup
  const [hasUnread, setHasUnread] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // For hover bubble visibility
  const [isInitialBubbleVisible, setIsInitialBubbleVisible] = useState(true); // For fixed initial bubble
  // const [lastMessage, setLastMessage] = useState<string | null>(null); // Needed if we send from popup
  const [bubbleInputValue, setBubbleInputValue] = useState(''); // Input state for bubble
  const navigate = useNavigate();
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for hover timeout
  const hoverBubbleRef = useRef<HTMLDivElement>(null); // Ref for the hover bubble
  const [isSending, setIsSending] = useState(false); // Add loading state

  // Function to handle opening the popup (replaces toggleChat)
  const openPopup = (results: string | null = null) => {
    setPopupResults(results ?? "Loading results..."); // Show loading or passed results
    setIsPopupOpen(true);
    setIsHovered(false); // Close bubble if open
    if (hasUnread) {
      setHasUnread(false);
    }
  };

  // Function to close the popup
  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupResults(null);
    setIsInitialBubbleVisible(true); // Show initial bubble when popup closes
  };

  // Function to handle sending a message from the popup
  const handleSendMessageFromPopup = (message: string) => {
    console.log("Message from popup:", message);
    // TODO: Send follow-up message to API and update popupResults
    setPopupResults(`Follow-up sent: "${message}". Waiting for new results...`);
  };
  
  // Function to navigate to full-page chat (Can be triggered from popup or button?)
  // Kept original logic for now, might need adjustment based on where it's triggered
  const handleNavigateToChat = (messageFromPopup?: string) => {
    let initialQuery: string | null = null;
    let initialResponse: string | null = null;

    if (messageFromPopup) {
      // If triggered from popup send button, use that message
      initialQuery = messageFromPopup;
      initialResponse = null; // /chat page will fetch its own response
      console.log(`Navigating to /chat from popup with message: ${messageFromPopup}`);
    } else if (popupResults && popupResults.startsWith('Results for')) {
       // If triggered by button click WHILE popup has results from BUBBLE send
       // Extract original query from the results text (simple example)
       try {
           initialQuery = popupResults.match(/"(.*?)"/)?.[1] || null;
           initialResponse = popupResults; 
           console.log(`Navigating to /chat from button click with previous results for query: ${initialQuery}`);
       } catch (e) { /* ignore parsing error */ }
    }
     else {
        console.log("Navigating to /chat from button click (no prior message).");
     }

    navigate('/chat', { 
      state: { 
        initialQuery: initialQuery,
        initialResponse: initialResponse
      } 
    });
    
    // Reset states
    setIsPopupOpen(false);
    setPopupResults(null);
    setIsHovered(false);
    setIsInitialBubbleVisible(true); 
  };

  // Set hover state for button and bubble (remains the same)
  const handleMouseEnter = () => {
    if (isPopupOpen) return; // Don't show hover bubble if popup is open
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsInitialBubbleVisible(false); // Hide initial bubble
    setIsHovered(true); // Show hover bubble
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      // Only hide hover bubble if mouse is not over it
      if (!hoverBubbleRef.current?.matches(':hover')) {
        setIsHovered(false);
        if (!isPopupOpen) {
           setIsInitialBubbleVisible(true); // Show initial bubble if popup isn't open
        }
      }
    }, 300); 
  };

  // Handles sending message typed into the BUBBLE input
  const handleSendMessageFromBubble = async () => {
    if (!bubbleInputValue.trim() || isSending) return;
    
    const messageToSend = bubbleInputValue;
    setBubbleInputValue(''); 
    setIsHovered(false); 
    setIsPopupOpen(true);
    setIsInitialBubbleVisible(false); 
    setIsSending(true); // Set loading
    setPopupResults(`Processing: "${messageToSend}"...`); 
    
    console.log("Sending message from bubble:", messageToSend);
    
    try {
      // ---- Use actual API Call ----
      const apiResponse = await sendMessageToApi(messageToSend);
      console.log("ChatButton: Received API response:", apiResponse);
      setPopupResults(apiResponse.response); // Update popup with actual results
    
    } catch (error) {
      // Error handling is now mostly inside sendMessageToApi, but catch edge cases
      console.error("Error in handleSendMessageFromBubble:", error);
      setPopupResults("Sorry, there was an error processing your request.");
    } finally {
      setIsSending(false); // Unset loading
    }
  };

  const handleBubbleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBubbleInputValue(e.target.value);
  };

  const handleBubbleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageFromBubble();
    }
  };

  // Simulate receiving a new message (remains the same)
  useEffect(() => {
    if (!isPopupOpen && !isHovered) {
      const timer = setTimeout(() => {
        if (!isPopupOpen && !isHovered) setHasUnread(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isPopupOpen, isHovered]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="chatbot-container">
      {/* Chat Popup (renders based on isPopupOpen state) */}
      {isPopupOpen && (
        <ChatPopup 
          initialResults={popupResults} 
          onClose={closePopup} 
          onSendMessage={handleNavigateToChat} 
        />
      )}
      
      {/* Old ChatWindow rendering - Keep commented or remove
      {isOpen && (
        <ChatWindow 
          onClose={() => setIsOpen(false)} 
          onOpenFullChat={handleOpenFullChat}
        />
      )} */}
      
      {/* Initial Fixed Bubble (Visible when not hovered and popup closed) */} 
      <div 
        className={`chatbot-bubble-initial ${isInitialBubbleVisible ? 'visible' : ''}`}
        onMouseEnter={handleMouseEnter} // Allow hover over this too
        onMouseLeave={handleMouseLeave}
      >
        Hello! I am your AI Assistant.
        {/* Maybe add a subtle arrow */} 
      </div>

      {/* Hover Bubble (Visible only on hover) */} 
      <div 
        ref={hoverBubbleRef} 
        className={`chatbot-bubble-hover ${isHovered ? 'expanded' : ''}`}
        style={{ 
            visibility: (isHovered && !isPopupOpen) ? 'visible' : 'hidden', // Also hide if popup is open
            opacity: (isHovered && !isPopupOpen) ? 1 : 0, 
            pointerEvents: (isHovered && !isPopupOpen) ? 'auto' : 'none' 
        }}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        <div className="bubble-content">
          <div className="bubble-text">
            How can I help you?
          </div>
          <input
            type="text"
            className="bubble-input"
            placeholder="Ask away..."
            value={bubbleInputValue}
            onChange={handleBubbleInputChange}
            onKeyPress={handleBubbleInputKeyPress}
            onFocus={handleMouseEnter} 
            disabled={isSending} // Disable input while sending
          />
        </div>
      </div>
      
      {/* Chat button - Always visible */} 
      <button
        onClick={() => handleNavigateToChat()} // Click button navigates to full chat
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`chatbot-button ${isPopupOpen ? 'popup-active' : ''}`}
        aria-label="Chat with AI Assistant"
        disabled={isSending} // Disable button while sending
      >
        {/* Loading indicator can be added here if needed */}
        {isSending && <div className="button-loading-spinner"></div>} 
        {!isSending && hasUnread && !isPopupOpen && !isHovered && (
          <span className="notification-badge">1</span>
        )}
        {!isSending && (
          <img 
            src="/Icons/chatbot-white-icon.svg"
            alt="Chat Icon"
            className="chatbot-icon"
          />
        )}
      </button>
    </div>
  );
};

export default ChatButton;
// export { chatMessages }; // Export chatMessages if needed elsewhere 