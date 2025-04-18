import React, { useState } from 'react';
import { FiSearch, FiBell, FiCalendar, FiUpload, FiMic, FiMaximize2, FiMoreVertical, FiEdit, FiClock, FiTag } from 'react-icons/fi';
import MicProgressBar from './MicProgressBar';

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

interface ChatInterfaceProps {
  input: string;
  isLoading: boolean;
  latestResult: Message | null;
  conversationPairs: ConversationPair[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleMicClick: () => void;
  handleUploadClick: () => void;
  stopListening: () => void;
  recording: boolean;
  audioStream: MediaStream | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  input,
  isLoading,
  latestResult,
  conversationPairs,
  handleInputChange,
  handleKeyPress,
  handleMicClick,
  handleUploadClick,
  stopListening,
  recording,
  audioStream
}) => {
  const [recordBtnClicked, setRecordBtnClicked] = useState(false);
  
  const handleMicButtonClick = () => {
    setRecordBtnClicked(true);
    handleMicClick();
    
    // We will let the recording state from the parent component reset this button
    // No need for a timeout which might conflict with actual recording state
  };
  
  // Reset button click state when actual recording starts or stops
  React.useEffect(() => {
    if (recording) {
      // If recording actually starts, we should immediately reset the button clicked state
      setRecordBtnClicked(false);
    }
  }, [recording]);

  return (
    <div className="flex-1 mr-5 font-['Roboto']">
      {/* Search bar */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="search-bar-top bg-gray-100 rounded-[8px] flex items-center px-3 py-2 w-full max-w-lg">
          <FiSearch className="text-gray-500 mr-2" />
          <input type="text" placeholder="Search" className="bg-transparent border-none outline-none w-full font-['Roboto']" />
        </div>
        <button className="notification-button bg-white p-2 rounded-[8px] ml-2">
          <FiBell size={20} className="text-gray-600" />
        </button>
      </div>
      
      {/* New Chat Section */}
      <div className="mb-4">
        <h2 className="text-[20px] leading-[24px] font-semibold mb-4 font-['Roboto']">New Chat</h2>
        
        {/* Show Mic Progress Bar or Input */}
        {recording ? (
          <div className="main-chat-input-wrapper bg-[#004F62] rounded-[8px] flex flex-col items-center overflow-hidden p-4">
             <MicProgressBar audioStream={audioStream} />
             <button
                onClick={stopListening}
                className="action-button bg-[#cc2b29] text-white p-2 rounded-[8px] flex items-center mx-1 mt-3"
                disabled={isLoading}
              >
                <FiMic className="mr-2" />
                <span className="text-xs font-['Roboto']">Stop Recording</span>
             </button>
          </div>
        ) : (
          <div className="main-chat-input-wrapper bg-[#004F62] rounded-[8px] flex items-center overflow-hidden p-2">
            <input
              type="text"
              className="main-chat-input-field flex-grow bg-transparent border-none outline-none text-white px-3 py-2 text-xs font-['Roboto']"
              placeholder="Ask whatever..."
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <div className="flex">
              <button 
                className="action-button speak-button bg-[#004F62] text-white p-2 rounded-[8px] flex items-center mx-1"
                onClick={handleMicButtonClick} // This now handles the click state
                disabled={isLoading || recordBtnClicked}
              >
                {recordBtnClicked ? (
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                ) : (
                  <FiMic className="mr-2" />
                )}
                <span className="text-xs font-['Roboto']">Speak</span>
              </button>
              <button 
                className="action-button upload-button bg-[#004F62] text-white p-2 rounded-[8px] flex items-center mx-1"
                onClick={handleUploadClick}
                disabled={isLoading}
              >
                <FiUpload className="mr-2" />
                <span className="text-xs font-['Roboto']">Upload</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Results Section */}
      <div className="mb-4 bg-[#004F62] text-white rounded-[8px] overflow-hidden">
        <div className="flex justify-between items-center p-3 border-b border-[rgba(255,255,255,0.1)]">
          <h3 className="text-sm leading-[16px] font-semibold font-['Roboto']">Results</h3>
          <button className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded-[8px]">
            <FiMaximize2 size={18} />
          </button>
        </div>
        <div className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <div className="spinner-border animate-spin inline-block w-6 h-6 border-2 rounded-full border-white border-t-transparent" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : latestResult ? (
            <pre className="results-text-formatted whitespace-pre-wrap text-xs font-['Roboto']">{latestResult.content}</pre>
          ) : (
            <p className="text-[rgba(255,255,255,0.7)] italic text-xs font-['Roboto']">Chatbot response will appear here...</p>
          )}
        </div>
      </div>
      
      {/* Recent Chats Section */}
      <div className="mt-4 flex-grow">
        <h2 className="text-xl font-semibold mb-4 font-['Roboto']">Recent Chats</h2>
        {conversationPairs.length === 0 ? (
          <p className="text-gray-500 italic text-xs font-['Roboto']">No recent chats yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {conversationPairs.map((pair, index) => (
              <div key={pair.id} className="bg-[#004F62] text-white rounded-[8px] overflow-hidden shadow-sm">
                <div className="flex justify-between items-center p-3 border-b border-[rgba(255,255,255,0.1)]">
                  <div className="flex items-center text-xs text-[rgba(255,255,255,0.8)] gap-1 font-['Roboto']">
                    <FiCalendar size={14} /> 
                    <span>Friday, April 5 2024</span>
                    <FiClock size={14} className="ml-2" />
                    <span>15m</span> 
                  </div>
                  <button className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded-[8px]">
                    <FiMoreVertical size={16} />
                  </button>
                </div>
                <div className="p-4 min-h-[100px]">
                  <h4 className="font-semibold mb-2 truncate text-xs font-['Roboto']">{pair.userMessage.content}</h4>
                  <p className="text-xs text-[rgba(255,255,255,0.9)] line-clamp-2 font-['Roboto']">
                    {pair.botMessage?.content || 'Waiting for response...'}
                  </p>
                </div>
                <div className="flex justify-between items-center p-3 border-t border-[rgba(255,255,255,0.1)]">
                  <div className={`conversation-tag text-xs px-2 py-1 rounded-[8px] font-['Roboto'] ${
                    index % 3 === 0 ? 'bg-[#FFCA28] text-[#5f4700]' : 
                    index % 3 === 1 ? 'bg-[#66BB6A] text-white' : 
                    'bg-[#EF5350] text-white'
                  }`}>
                    <FiTag size={10} className="mr-1 inline" /> Tag #{index+1}
                  </div>
                  <button className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded-[8px]">
                    <FiEdit size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface; 