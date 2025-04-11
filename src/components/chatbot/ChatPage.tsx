import React, { useState,  ReactNode } from 'react';
import { FiSearch,  FiCalendar, FiUpload, FiMic, FiMaximize2, FiMoreVertical, FiEdit, FiMessageSquare, FiHome, FiUser, FiFileText, FiSettings, FiHelpCircle, FiLogOut, FiPlus } from 'react-icons/fi';
import './ChatPage.css';
import { useNavigate } from 'react-router-dom';
import Header from '../dashboard/Header';


// Type definitions
interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface MessageProps {
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface ConversationCardProps {
  title: string;
  date: string;
  content: string;
  tagColor: string;
  tagText: string;
}

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
  
  const navigate=useNavigate()


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

// Message Component
const Message: React.FC<MessageProps> = ({ content, isUser, timestamp }) => {
  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
      <div className="message-content">{content}</div>
      <div className="message-time">{timestamp}</div>
    </div>
  );
};

// Chat Input Area
const ChatInputArea: React.FC<{onSendMessage: (message: string) => void}> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  return (
    <div className="chat-input-area">
      <div className="chat-input-container">
        <input 
          type="text" 
          className="chat-input-field" 
          placeholder="Ask whatever..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <button className="send-button" onClick={handleSubmit}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  );
};

// Results Section
const ResultsSection: React.FC = () => {
  return (
    <div className="results-section">
      <div className="results-header">
        <span>Results</span>
        <button className="expand-button">
          <FiMaximize2 />
        </button>
      </div>
      <div className="results-content">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar.
        </p>
        <p>
          Donec ut rhoncus ex. Suspendisse ac rhoncus nisi, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
        </p>
      </div>
    </div>
  );
};

// Conversation Card
const ConversationCard: React.FC<ConversationCardProps> = ({ title, date, content, tagColor, tagText }) => {
  return (
    <div className="conversation-card">
      <div className="conversation-header">
        <div className="conversation-info">
          <FiCalendar className="calendar-icon" />
          <span>{date}</span>
        </div>
        <button className="more-options-button">
          <FiMoreVertical />
        </button>
      </div>
      <div className="conversation-content">
        <h3 className="conversation-title">{title}</h3>
        <p>{content}</p>
      </div>
      <div className="conversation-footer">
        <div className="conversation-tag" style={{ backgroundColor: tagColor }}>
          {tagText}
        </div>
        <button className="tag-edit-button">
          <FiEdit />
        </button>
      </div>
    </div>
  );
};

// Recent Chats Section
const RecentChats: React.FC = () => {
  return (
    <div className="recent-conversations">
      <h2 className="section-title">Recent Chats</h2>
      <div className="conversations-grid">
        <ConversationCard
          title="Headache Consultation"
          date="Friday, April 4 2024"
          content="I've been experiencing frequent headaches lately. Could this be migraine? Which medications might be more effective?"
          tagColor="#FFCA28"
          tagText="Tag #1"
        />
        <ConversationCard
          title="Medication Reminder"
          date="Friday, April 4 2024"
          content="I need to take my blood pressure medication twice a day. Can you set up regular morning and evening reminders for me?"
          tagColor="#66BB6A"
          tagText="Tag #2"
        />
        <ConversationCard
          title="Test Results"
          date="Friday, April 4 2024"
          content="My blood test results show slightly low hemoglobin levels. What does this value mean and what should I do about it?"
          tagColor="#EF5350"
          tagText="Tag #3"
        />
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

  const navigate= useNavigate();

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

// Main Chat Page Component
const ChatPage = () => {
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      content: "Hello, I am Durabilis AI. How can I help you today?",
      isUser: false,
      timestamp: "10:00"
    },
    {
      content: "I've been experiencing frequent headaches lately. Could this be migraine?",
      isUser: true,
      timestamp: "10:02"
    },
    {
      content: "It's possible that you're experiencing migraines. Migraines typically cause throbbing pain on one side of the head and can be accompanied by nausea, sensitivity to light and sound. How long do your headaches last and have you noticed any triggers?",
      isUser: false,
      timestamp: "10:03"
    }
  ]);
  
  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage = {
      content,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiMessage = {
        content: "I understand your concern. Based on what you've shared, I'll analyze your symptoms and provide some recommendations. Would you like me to suggest some preventive measures for headaches?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="chat-page">

      <Header/>

      <div className="chat-page-content">
        <Sidebar />
        <div className="chat-main-container">
          <div className="chat-content">
            <div className="chat-content-header">
              <h2 className="chat-title">New Chat</h2>
            </div>
            <SearchBar />
            <div className="chat-main">
              <div className="messages-container">
                {messages.map((message, index) => (
                  <Message 
                    key={index}
                    content={message.content}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                  />
                ))}
              </div>
              <ChatInputArea onSendMessage={handleSendMessage} />
              <ResultsSection />
              <RecentChats />
            </div>
          </div>
        </div>
        <AppointmentsPanel />
      </div>
    </div>
  );
};

export default ChatPage; 