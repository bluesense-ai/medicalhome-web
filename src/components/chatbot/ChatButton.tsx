import { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import './ChatBot.css';

interface ChatButtonProps {
  onOpenChat?: () => void; // Optional prop for full-page chat navigation
}

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

const ChatButton = ({ onOpenChat }: ChatButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  // Function to navigate to full-page chat
  const handleOpenFullChat = () => {
    if (onOpenChat) {
      // Save the last user message
      if (lastMessage) {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          content: lastMessage,
          sender: 'user',
          timestamp: new Date()
        };
        
        // Automatic AI response (example)
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: 'How can I help you?',
          sender: 'ai',
          timestamp: new Date(Date.now() + 1000)
        };
        
        chatMessages = [...chatMessages, newMessage, aiResponse];
      }
      onOpenChat();
    }
  };

  // Toggle chat window visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (hasUnread && isOpen === false) {
      setHasUnread(false);
    }
  };

  // Set hover state for both button and bubble
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Simulate receiving a new message after 30 seconds
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setHasUnread(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="chatbot-container">
      {/* Chat window - mini chat window */}
      {isOpen && (
        <ChatWindow 
          onClose={() => setIsOpen(false)} 
          onOpenFullChat={handleOpenFullChat}
        />
      )}
      
      {/* Chat bubble with conditional expanded state */}
      {!isOpen && (
        <div 
          className={`chatbot-bubble ${isHovered ? 'expanded' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="bubble-content">
            <div className="bubble-text">
              {isHovered ? "How can I help you?" : "Hello! I'm your AI Assistant."}
            </div>
            {isHovered && (
              <div 
                className="bubble-input" 
                onClick={() => setIsOpen(true)}
                style={{ cursor: 'pointer' }}
              >
                Type your question...
              </div>
            )}
          </div>
          <div className="bubble-arrow"></div>
        </div>
      )}
      
      {/* Chat button */}
      <button
        onClick={toggleChat}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`chatbot-button ${isOpen ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
        aria-label="Get chat help"
      >
        {hasUnread && !isOpen && (
          <span className="notification-badge">1</span>
        )}
        
        <img 
          src="/icons/chatbot-white-icon.svg"
          alt="Chat Icon"
          className="chatbot-icon"
        />
      </button>
    </div>
  );
};

export default ChatButton;
export { chatMessages }; 