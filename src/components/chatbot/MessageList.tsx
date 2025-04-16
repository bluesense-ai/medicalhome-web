import React, { useRef, useEffect } from 'react';
import './ChatPage.css';

export interface Message {
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="messages-container">
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
        >
          <div className="message-content">{message.content}</div>
          <div className="message-time">{message.timestamp}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 