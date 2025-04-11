import { useState, useEffect, useRef } from 'react';
import ChatButton from '../chatbot/ChatButton';
import './Dashboard.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <div className="header-center">
        <img 
          src="/logo.svg" 
          alt="Medical Home Logo" 
          className="header-logo"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://placehold.co/150x50?text=Medical+Home';
          }}
        />
      </div>
      
      <div className="header-right">
        <button className="user-avatar">
          D
        </button>
      </div>
    </header>
  );
};

// Calendar Component
const Calendar = ({ selectedDate, view, handleToday, handlePrevious, handleNext, formatDate }: { 
  selectedDate: Date;
  view: 'day' | 'week' | 'month';
  handleToday: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
  formatDate: (date: Date) => string;
}) => {
  // Sample appointments data matching Figma
  const appointments = [
    { id: '1', time: '10:00', endTime: '10:10', patient: 'Joseph Mondesire', title: 'Stomach Hurts', patientId: '123456789', type: 'standard' },
    { id: '2', time: '10:00', endTime: '10:20', patient: 'John Smith', title: 'Short visit', patientId: '122554787', type: 'standard' },
    { id: '3', time: '10:00', endTime: '10:30', patient: 'Jose Gustavo Carvajal Pena', title: 'Short visit', patientId: '125455782', type: 'standard' },
    { id: '4', time: '11:00', endTime: '11:15', patient: 'Dami Egbeyemi', title: 'Nausea, migraines and indigestion', patientId: '223426899', type: 'standard' },
    { id: '5', time: '11:00', endTime: '11:15', patient: 'Ron Swanson', title: 'Walk-in', patientId: '123456789', type: 'walk-in' },
    { id: '6', time: '11:00', endTime: '11:30', patient: 'Mandy Rogers', title: 'Tingling sensation in my arms...', patientId: '132555789', type: 'standard' }
  ];

  // Time slots as per Figma
  const timeSlots = [
    { label: '10:00 AM', time: '10:00' },
    { label: '10:30 AM', time: '10:30' },
    { label: '11:00 PM', time: '11:00' },
    { label: '11:30 PM', time: '11:30' }
  ];
  
  // Group appointments by exact start time for rendering
  const groupedByStartTime: Record<string, typeof appointments> = {};
  appointments.forEach(appointment => {
    if (!groupedByStartTime[appointment.time]) {
      groupedByStartTime[appointment.time] = [];
    }
    groupedByStartTime[appointment.time].push(appointment);
  });

  return (
    <div className="calendar-wrapper">
      {/* Calendar Navigation */}
      <div className="calendar-nav">
        <div className="nav-left">
          <button 
            onClick={handleToday}
            className="today-button"
          >
            <svg className="today-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0117.25 2.25h-10.5zm10.5 7.5a1.5 1.5 0 00-1.5-1.5h-8a1.5 1.5 0 00-1.5 1.5v8a1.5 1.5 0 001.5 1.5h8a1.5 1.5 0 001.5-1.5v-8z" />
            </svg>
            <span>Today</span>
          </button>
          
          <div className="date-selector">
            <button 
              onClick={handlePrevious}
              className="nav-arrow prev"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
              </svg>
            </button>
            
            <h2 className="current-date">{formatDate(selectedDate)}</h2>
            
            <button 
              onClick={handleNext}
              className="nav-arrow next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="view-selector">
          <button 
            className={`view-button ${view === 'day' ? 'active' : ''}`}
          >
            Day
          </button>
          <button 
            className={`view-button ${view === 'week' ? 'active' : ''}`}
          >
            Week
          </button>
          <button 
            className={`view-button ${view === 'month' ? 'active' : ''}`}
          >
            Month
          </button>
        </div>
      </div>
      
      <div className="calendar-container">
        {/* All Day Row */}
        <div className="all-day-row">
          <div className="all-day-label">All day</div>
          <div className="all-day-events"></div>
        </div>
        
        {/* Time Grid */}
        <div className="time-grid">
          {timeSlots.map((slot, index) => (
            <div key={index} className="time-slot">
              <div className="time-label">{slot.label}</div>
              <div className="time-events">
                {/* Special separator line positioned correctly */}
                {slot.time === '10:30' && (
                  <div className="separator-line"></div>
                )}
                
                <div className="event-container">
                  {/* Filter appointments that *start* at this specific time slot */}
                  {appointments
                    .filter(appointment => appointment.time === slot.time)
                    .map(appointment => (
                      <div 
                        key={appointment.id} 
                        className={`event ${appointment.type === 'walk-in' ? 'walk-in' : ''}`}
                      >
                        {appointment.type === 'walk-in' ? (
                          <div className="event-meta"> 
                            <div className="event-details-group"> {/* Group label, patient, ID */} 
                              <span className="walk-in-label">Walk-in</span>
                              <span className="event-patient">{appointment.patient}</span>
                              {appointment.patientId && <span className="event-id">{appointment.patientId}</span>}
                            </div>
                            <span className="event-time">{appointment.time} - {appointment.endTime}</span>
                          </div>
                        ) : (
                          <>
                            <div className="event-title">{appointment.title}</div>
                            <div className="event-meta">
                               <div> {/* Group patient and ID */} 
                                <span className="event-patient">{appointment.patient}</span>
                                {appointment.patientId && <span className="event-id">{appointment.patientId}</span>}
                               </div>
                               <span className="event-time">{appointment.time} - {appointment.endTime}</span>
                            </div>
                          </>
                        )}
                      </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Dashboard component is updated with onChatOpen prop
interface DashboardProps {
  onChatOpen: () => void;
}

const Dashboard = ({ onChatOpen }: DashboardProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
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
    <div className="dashboard">
      <Header />
      
      {/* Main content */}
      <div className="dashboard-content" ref={contentRef}>
        {/* Calendar based on view */}
        {view === 'day' && (
          <Calendar 
            selectedDate={selectedDate} 
            view={view}
            handleToday={handleToday}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            formatDate={formatDate}
          />
        )}
        {view === 'week' && <div>Week view coming soon</div>}
        {view === 'month' && <div>Month view coming soon</div>}
      </div>
      
      {/* Chatbot - pass the onChatOpen prop */}
      <ChatButton onOpenChat={onChatOpen} />
    </div>
  );
};

export default Dashboard; 