import { useState } from 'react';
import './ChatBot.css';

interface ChatWindowProps {
  onClose: () => void;
  onOpenFullChat?: () => void;
  userMessage?: string;
}

const ChatWindow = ({ onClose, onOpenFullChat }: ChatWindowProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [sentMessage, setSentMessage] = useState('');
  
  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    
    setSentMessage(inputValue);
    setIsSent(true);
    setInputValue('');
    
    if (onOpenFullChat) {
      setTimeout(() => {
        onOpenFullChat();
      }, 1500);
    }
  };
  
  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-title">{isSent ? "Processing..." : "How can I help you?"}</div>
        <button className="chat-close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div className="chat-body">
        {isSent ? (
          <div className="chat-messages">
            <div className="chat-message user-message">
              <span className="message-content">{sentMessage}</span>
              <span className="message-time">Now</span>
            </div>
            <div className="chat-message ai-message loading">
              <div className="loading-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-welcome">
            <p>Hello! How can I help you?</p>
            <p className="chat-suggestion">For example, you can ask:</p>
            <ul className="suggestion-list">
              <li>What are my appointments today?</li>
              <li>Latest lab results for Joseph Mondesire</li>
              <li>Can you provide information about diabetes mellitus?</li>
            </ul>
          </div>
        )}
      </div>
      
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type your question..."
          className="chat-input-field"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={isSent}
        />
        <button 
          className="chat-send-button" 
          onClick={() => handleSend()}
          disabled={isSent || !inputValue.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow; 