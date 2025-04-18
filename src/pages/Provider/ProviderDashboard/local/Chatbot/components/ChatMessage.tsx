import { Message, ChatMessageProps } from './types';

const ChatMessage = ({ message }: ChatMessageProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Function to format clinical information with simple markdown-like syntax
  const formatMessageText = (text: string) => {
    // Detect clinical information patterns
    if (text.includes(':') && !message.isUser) {
      return (
        <div>
          {text.split('\n').map((line, index) => {
            // Check if line contains a key-value pair (like "Dosage: 500mg")
            if (line.includes(':')) {
              const [key, value] = line.split(':');
              return (
                <div key={index} className="mb-1">
                  <span className="font-semibold">{key.trim()}:</span> {value.trim()}
                </div>
              );
            }
            return <p key={index} className="mb-1">{line}</p>;
          })}
        </div>
      );
    }
    
    // Check for task-like content
    if (text.toLowerCase().includes('reminder') && !message.isUser) {
      return (
        <div>
          <div className="mb-2">{text.split('reminder').shift()}</div>
          <div className="bg-background-green p-2 rounded-md border border-secondary-green-dark">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-secondary-green-dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Reminder set</span>
            </div>
          </div>
        </div>
      );
    }
    
    return <p>{text}</p>;
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!message.isUser && (
        <div className="h-8 w-8 rounded-full bg-primary-blue flex items-center justify-center text-white mr-2 flex-shrink-0">
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
        </div>
      )}
      
      <div 
        className={`max-w-[75%] p-3 rounded-lg ${
          message.isUser 
            ? 'bg-primary-blue text-white rounded-br-none' 
            : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
        }`}
      >
        <div className="text-sm">{formatMessageText(message.text)}</div>
        <span className={`text-xs block mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage; 