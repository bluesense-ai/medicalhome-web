import { useState, useEffect } from 'react';
import '../ChatBot.css'; // Reuse existing CSS file for now
import { FiX, FiSend } from 'react-icons/fi'; // Re-added FiSend

interface ChatPopupProps {
  initialResults: string | null; // Add prop for initial results
  onClose: () => void;
  onSendMessage: (message: string) => void; // Re-added prop to handle sending message (will navigate)
  // Optional: Add a prop to trigger navigation to full chat
  onNavigateToChat?: () => void; 
}

const ChatPopup: React.FC<ChatPopupProps> = ({ initialResults, onClose, onSendMessage, onNavigateToChat }) => {
  const [resultsContent, setResultsContent] = useState(initialResults); // State for content
  const [inputValue, setInputValue] = useState(''); // Re-added state for input

  // Update content if initialResults prop changes after mount
  useEffect(() => {
    console.log("ChatPopup: initialResults prop changed to:", initialResults);
    setResultsContent(initialResults);
  }, [initialResults]);

  // Placeholder for "This worked!" button action
  const handleThisWorked = () => {
    console.log("User clicked 'This worked!'");
    onClose(); // Close the popup for now
  };

  // Handler for sending message from the popup's input
  const handleSendClick = () => {
    if (!inputValue.trim()) return;
    // Call the passed onSendMessage function, which should handle navigation
    onSendMessage(inputValue);
    setInputValue(''); // Clear input after sending
    // Don't close popup here, let the navigation handle it
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  console.log("ChatPopup: Rendering with resultsContent:", resultsContent); // Log render value

  return (
    <div className="chat-popup">
      {/* Close button is still optional, but perhaps more useful now */}
      <button className="chat-popup-close" onClick={onClose} aria-label="Close chat results">
        <FiX size={18} />
      </button>
      <div className="chat-popup-header">
        <h4>Here are your results</h4>
      </div>
      <div className="chat-popup-content">
        {/* Display resultsContent state, which holds initial or updated results */}
        {typeof resultsContent === 'string' ? (
          <pre className="popup-results-text">{resultsContent}</pre> // Use pre for formatting
        ) : (
          <p>Loading...</p> // Fallback or initial loading state
        )}
      </div>
      <div className="chat-popup-actions">
        <button className="popup-action-button" onClick={handleThisWorked}>
          This worked!
        </button>
        {/* Optional: Button/Link to navigate to full chat 
        {onNavigateToChat && (
          <button className="popup-navigate-button" onClick={onNavigateToChat}>
            Ask Follow-up
          </button>
        )}*/} 
      </div>
      {/* Re-added Input area */}
      <div className="chat-popup-input-area">
        <input
          type="text"
          placeholder="Ask away..." // Or maybe "Ask follow-up..."?
          className="chat-popup-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          className="chat-popup-send-button" 
          onClick={handleSendClick}
          disabled={!inputValue.trim()}
          aria-label="Send follow-up message and go to chat"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatPopup; 