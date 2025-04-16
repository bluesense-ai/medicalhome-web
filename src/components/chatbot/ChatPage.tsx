import React, { useState, ReactNode, useEffect } from 'react';
import { FiSearch, FiBell, FiCalendar, FiUpload, FiMic, FiMaximize2, FiMoreVertical, FiEdit, FiMessageSquare, FiHome, FiUser, FiFileText, FiSettings, FiHelpCircle, FiLogOut, FiPlus, FiMenu, FiClock, FiTag } from 'react-icons/fi';
import './ChatPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { queryChatbot } from '../../services/chatbotService';

// Type definitions
interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

// Message interface
interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

// Conversation Pair interface
interface ConversationPair {
  id: string;
  userMessage: Message;
  botMessage: Message | null;
}

// API communication function
const sendMessageToApi = async (message: string) => {
  try {
    console.log("Sending message to Hugging Face API");
    const response = await queryChatbot(message);
    return { 
      response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    console.error('Chatbot API error:', error);
    throw error;
  }
};

// Sidebar Item component
const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, isActive, onClick }) => {
  return (
    <li className={`nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="nav-icon">{icon}</div>
      <div className="nav-text">{text}</div>
    </li>
  );
};

// Sidebar component
const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.svg" alt="Logo" className="sidebar-logo" />
        <div className="sidebar-title">Medical Home AI</div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <SidebarItem icon={<FiHome />} text="Home" isActive={true} />
          <SidebarItem icon={<FiFileText />} text="Perscriptions" />
          <SidebarItem icon={<FiUser />} text="Lab Results" />
          <SidebarItem icon={<FiMessageSquare />} text="Patient List" />
          <SidebarItem icon={<FiSettings />} text="Action Items" />
          <SidebarItem icon={<FiHelpCircle />} text="Tags" />
          
          <div className="sidebar-separator">Workspace</div>
          
          <SidebarItem icon={<FiLogOut />} text="Archived" />
          <SidebarItem icon={<FiPlus />} text="Integrations" />
          <SidebarItem icon={<FiSettings />} text="Settings" />
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button className="back-button" title="Back to Dashboard" onClick={()=>navigate('/')}>
          <FiLogOut />
        </button>
      </div>
    </div>
  );
};

// Search Bar component
const SearchBar: React.FC = () => {
  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" />
        <input type="text" className="search-input" placeholder="Search" />
      </div>
      <div className="action-buttons">
        <button className="action-button speak-button">
          <FiMic />
          <span>Speak</span>
        </button>
        <button className="action-button upload-button">
          <FiUpload />
          <span>Upload</span>
        </button>
      </div>
    </div>
  );
};

// Recent Chats Component
interface ChatPreview {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
  isUnread?: boolean;
}

const RecentChats: React.FC = () => {
  // Sample data for recent chats
  const recentChats: ChatPreview[] = [
    {
      id: '1',
      title: 'Medical Consultation',
      lastMessage: 'I have scheduled your appointment with Dr. Johnson for tomorrow at 2 PM.',
      time: '2 min ago',
      isUnread: true
    },
    {
      id: '2',
      title: 'Prescription Refill',
      lastMessage: 'Your prescription has been sent to the pharmacy and will be ready for pickup.',
      time: '1 hour ago'
    },
    {
      id: '3',
      title: 'Lab Results',
      lastMessage: 'Your recent blood test results show normal levels. No further action needed.',
      time: 'Yesterday'
    },
    {
      id: '4',
      title: 'Health Tips',
      lastMessage: 'Remember to stay hydrated and take your medication as prescribed.',
      time: '2 days ago'
    }
  ];

  return (
    <div className="recent-chats">
      <div className="recent-chats-header">
        <h3>Recent Chats</h3>
        <button className="new-chat-button">
          <FiEdit />
          <span>New Chat</span>
        </button>
      </div>
      <div className="chat-list">
        {recentChats.map(chat => (
          <div key={chat.id} className={`chat-preview ${chat.isUnread ? 'unread' : ''}`}>
            <div className="chat-icon">
              <FiMessageSquare />
            </div>
            <div className="chat-preview-content">
              <div className="chat-preview-header">
                <h4 className="chat-title">{chat.title}</h4>
                <span className="chat-time">{chat.time}</span>
              </div>
              <p className="chat-last-message">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Message List Component
const MessageList: React.FC<{messages: Message[]}> = ({ messages }) => {
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
    </div>
  );
};

// Chat Input Component
const ChatInput: React.FC<{onSendMessage: (message: string) => void, isLoading: boolean}> = 
  ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSend = (): void => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-area">
      <div className="input-container">
        <input
          type="text"
          className="chat-input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question here..."
          disabled={isLoading}
        />
        <button 
          className="send-button" 
          onClick={handleSend} 
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

// Activity Card
const ActivityCard: React.FC<{time: string, title: string, description: string, isActive?: boolean}> = 
  ({time, title, description, isActive}) => {
  return (
    <div className={`activity-card ${isActive ? 'active' : ''}`}>
      <div className="activity-time">{time}</div>
      <div className="activity-details">
        <h4 className="activity-title">{title}</h4>
        <p className="activity-description">{description}</p>
      </div>
    </div>
  );
};

// Appointments Panel
const AppointmentsPanel: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="appointments-panel">
      <div className="panel-header">
        <div className="date-display">
          <h2>Today</h2>
          <button className="calendar-button" onClick={() => {navigate('/')}}>
            <FiCalendar />
          </button>
        </div>
      </div>
      
      <div className="activities-section">
        <div className="activity-header">
          <h3>Activities</h3>
        </div>
        <div className="activity-list">
          <ActivityCard 
            time="09:00" 
            title="Dr. Michael Johnson" 
            description="Cardiology Check-up" 
            isActive={true}
          />
          <ActivityCard 
            time="11:30" 
            title="Medication Reminder" 
            description="Blood pressure medicine - 1 tablet" 
          />
          <ActivityCard 
            time="14:00" 
            title="Laboratory" 
            description="Blood Test" 
          />
          <ActivityCard 
            time="16:30" 
            title="Dr. Sarah Miller" 
            description="Physical Therapy Session" 
          />
        </div>
      </div>
      
      <div className="upcoming-section">
        <div className="upcoming-header">
          <h3>Upcoming</h3>
          <button className="view-all-button">View All</button>
        </div>
        <div className="upcoming-list">
          <ActivityCard 
            time="Tomorrow 10:00" 
            title="Online Consultation" 
            description="Dr. Robert Smith" 
          />
          <ActivityCard 
            time="Jun 25, 09:30" 
            title="Eye Examination" 
            description="Specialty Eye Center" 
          />
        </div>
      </div>
    </div>
  );
};

// --- Central Panel Components --- //

// Top Header for Central Panel
const TopHeader: React.FC = () => {
  return (
    <div className="top-header-container">
      <div className="search-bar-top">
        <FiSearch className="search-icon-top" />
        <input type="text" placeholder="Search" className="search-input-top" />
      </div>
      <button className="notification-button" title="Notifications">
        <FiBell />
      </button>
    </div>
  );
};

// New Chat Input Section Component (Updated for button placement)
const NewChatInput: React.FC<{onSendMessage: (message: string) => void, isLoading: boolean}> = 
  ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSend = (): void => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="new-chat-section">
      <h2 className="section-header">New Chat</h2>
      {/* Wrap input and buttons together */}
      <div className="input-wrapper-with-buttons">
        <input
          type="text"
          className="main-chat-input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask whatever..."
          disabled={isLoading}
        />
        <div className="action-buttons-main">
          <button className="action-button speak-button" disabled={isLoading}>
            <FiMic />
            <span>Speak</span>
          </button>
          <button className="action-button upload-button" disabled={isLoading}>
            <FiUpload />
            <span>Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Results Section Component (Updated for formatting)
const ResultsSection: React.FC<{ latestResult: Message | null }> = ({ latestResult }) => {
  return (
    <div className="results-section">
      <div className="results-header">
        <h3>Results</h3>
        <button className="expand-button" title="Expand">
          <FiMaximize2 />
        </button>
      </div>
      <div className="results-content">
        {latestResult ? (
          <pre className="results-text-formatted">{latestResult.content}</pre>
        ) : (
          <p className="placeholder-text">Chatbot response will appear here...</p>
        )}
      </div>
    </div>
  );
};

// Conversation Card Component
interface ConversationCardProps {
  pair: ConversationPair;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ pair }) => {
  // Basic tag rendering, can be expanded later
  const renderTag = (index: number) => {
    const colors = ['#FFCA28', '#66BB6A', '#EF5350'];
    const color = colors[index % colors.length];
    return (
      <span className="conversation-tag" style={{ backgroundColor: color }}>
        <FiTag size={10} /> Tag #{index + 1}
      </span>
    );
  };
  
  return (
    <div className="conversation-card">
      <div className="conversation-header">
        <div className="conversation-info">
          <FiCalendar size={14} /> 
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <FiClock size={14} />
          {/* Display time elapsed or timestamp */} 
          <span>{pair.userMessage.timestamp || '15m'}</span> 
        </div>
        <button className="more-options-button" title="More options">
          <FiMoreVertical />
        </button>
      </div>
      <div className="conversation-content">
        <h4 className="conversation-title">{pair.userMessage.content}</h4>
        <p>{pair.botMessage?.content || '...'}</p>
      </div>
      <div className="conversation-footer">
        {renderTag(parseInt(pair.id) % 3)} {/* Example Tag rendering */} 
        <button className="tag-edit-button" title="Edit tag">
          <FiEdit />
        </button>
      </div>
    </div>
  );
};

// Recent Chats Grid Component
const RecentChatsGrid: React.FC<{ conversationPairs: ConversationPair[] }> = ({ conversationPairs }) => {
  return (
    <div className="recent-chats-section">
      <h2 className="section-header">Recent Chats</h2>
      {conversationPairs.length === 0 ? (
         <p className="placeholder-text">No recent chats yet.</p>
      ) : (
        <div className="conversations-grid">
          {conversationPairs.map((pair) => (
            <ConversationCard key={pair.id} pair={pair} />
          ))}
        </div>
      )}
    </div>
  );
};

// Main Chat Page Component
const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize state with potential data from navigation
  const initialQuery = location.state?.initialQuery as string | null;
  const initialResponse = location.state?.initialResponse as string | null;

  const [conversationPairs, setConversationPairs] = useState<ConversationPair[]>(() => {
     // Initialize with passed state if available
     if (initialQuery && initialResponse) {
         const initialUserMessage: Message = {
             id: 'user-init',
             content: initialQuery,
             isUser: true,
             timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
         };
         const initialBotMessage: Message = {
             id: 'bot-init',
             content: initialResponse,
             isUser: false,
             timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
         };
         return [{ id: 'init', userMessage: initialUserMessage, botMessage: initialBotMessage }];
     }
     return []; // Start empty if no initial data
  });
  
  // Set initial result display if only response was passed
  const [latestResult, setLatestResult] = useState<Message | null>(() => {
      if (!initialQuery && initialResponse) { // Should not happen often with current logic
          return {
              id: 'bot-init',
              content: initialResponse,
              isUser: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
      } else if (initialQuery && initialResponse) {
          return {
             id: 'bot-init',
             content: initialResponse,
             isUser: false,
             timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
         };
      }
      return null;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [nextId, setNextId] = useState(1); 

  // Send message if only initialQuery was passed via navigation
  useEffect(() => {
    if (initialQuery && !initialResponse) {
      console.log("ChatPage: Received initial query from navigation, sending to API:", initialQuery);
      handleSendMessage(initialQuery);
    }
    // Clear location state after processing to avoid re-triggering
    window.history.replaceState({}, document.title) 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, initialResponse]); // Run only when these specific state values change initially

  const handleSendMessage = async (messageContent: string) => {
    setIsLoading(true);
    setLatestResult(null);
    const currentId = nextId.toString();
    setNextId(prev => prev + 1);

    const userMessage: Message = {
      id: `user-${currentId}`,
      content: messageContent,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user message first, even if it's the initial one
    const newPair: ConversationPair = {
        id: currentId, 
        userMessage: userMessage, 
        botMessage: null 
    };
    setConversationPairs(prevPairs => [newPair, ...prevPairs.filter(p => p.id !== 'init')]); // Add new, remove potential init placeholder

    try {
      const response = await sendMessageToApi(messageContent);
      
      const botMessage: Message = {
        id: `bot-${currentId}`,
        content: response.response,
        isUser: false,
        timestamp: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setConversationPairs(prevPairs => 
        prevPairs.map(pair => 
          pair.id === currentId ? { ...pair, botMessage: botMessage } : pair
        )
      );
      setLatestResult(botMessage);

    } catch (error) {
       const errorMessage: Message = {
        id: `error-${currentId}`,
        content: "Sorry, an error occurred. Please try again.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
       setConversationPairs(prevPairs => 
        prevPairs.map(pair => 
          pair.id === currentId ? { ...pair, botMessage: errorMessage } : pair
        )
      );
       setLatestResult(errorMessage); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-page-content">
        <Sidebar />
        <div className="chat-main-container">
          <div className="chat-content-figma">
            <TopHeader />
            <NewChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            <ResultsSection latestResult={latestResult} />
            <RecentChatsGrid conversationPairs={conversationPairs} />
          </div>
        </div>
        <AppointmentsPanel />
      </div>
    </div>
  );
};

export default ChatPage; 