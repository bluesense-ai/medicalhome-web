import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";


const Calendar = ({ selectedDate, view, handleToday, handlePrevious, handleNext, handleView ,formatDate }: { 
  selectedDate: Date;
  view: 'day' | 'week' | 'month';
  handleToday: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleView: (value:string)=> void;
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
        
          <button  onClick={handleToday} className="today-button" >
            <FiCalendar size={20} />
            <span className="text-sm">Today</span>
          </button>
          
          
          <div className="date-selector">
            <button 
              onClick={handlePrevious}
              className="nav-arrow prev"
            >
              <FiChevronLeft />
            </button>
            
            <h2 className="current-date">{formatDate(selectedDate)}</h2>
            
            <button 
              onClick={handleNext}
              className="nav-arrow next"
            >
              <FiChevronRight />
            </button>
          </div>
        
        
        <div className="view-selector">
          <button onClick={()=> handleView('day')}
            className={`view-button ${view === 'day' ? 'active' : ''}`}
          >
            Day
          </button>
          <button onClick={()=> handleView('week')}
            className={`view-button ${view === 'week' ? 'active' : ''}`}
          >
            Week
          </button>
          <button onClick={()=> handleView('month')}
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

export default Calendar;