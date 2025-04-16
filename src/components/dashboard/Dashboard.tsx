import { useState, useRef } from 'react';
import ChatButton from '../chatbot/ChatButton';
import './Dashboard.css';
import Calendar from '../dashboard/Calendar';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Navigate to previous day/week/month
  const handlePrevious = () => {
    const newDate = new Date(selectedDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setSelectedDate(newDate);
  };
  
  // Navigate to next day/week/month
  const handleNext = () => {
    const newDate = new Date(selectedDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const handleView = (value: string) => {
    setView(value as 'day' | 'week' | 'month');
  };
  
  // Set today's date
  const handleToday = () => {
    setSelectedDate(new Date());
  };
  
  // Format the date for display
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="dashboard-container">
      
      {/* Main content below navbar */}
      <div className="dashboard-main-content" ref={contentRef}>
        {/* Calendar Component - Pass necessary props */}
        <Calendar 
          selectedDate={selectedDate} 
          view={view}
          handleToday={handleToday}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          handleView={handleView}
          formatDate={formatDate}
        />
        {/* Render other views if needed */}
        {/* {view === 'week' && <div>Week view coming soon</div>} */}
        {/* {view === 'month' && <div>Month view coming soon</div>} */}
      </div>
      
      <ChatButton />
    </div>
  );
};

export default Dashboard; 