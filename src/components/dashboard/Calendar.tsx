interface CalendarProps {
  view: 'day' | 'week' | 'month';
  selectedDate: Date;
}

const Calendar = ({ view, selectedDate }: CalendarProps) => {
  // Generate time slots for the day view
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const period = hour < 12 ? 'AM' : 'PM';
      slots.push(`${formattedHour}:00 ${period}`);
      slots.push(`${formattedHour}:30 ${period}`);
    }
    return slots;
  };
  
  // For week view, get the days of the week
  const getDaysOfWeek = () => {
    const days = [];
    const currentDate = new Date(selectedDate);
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };
  
  // Format day for display
  const formatDay = (date: Date) => {
    return date.getDate();
  };
  
  // Format month for display
  const formatMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'short' });
  };
  
  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  // Render the appropriate calendar view
  const renderCalendarView = () => {
    if (view === 'day') {
      return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            <div className="bg-background-blue p-3 text-primary-blue-dark font-medium">
              All day
            </div>
            {generateTimeSlots().map((timeSlot, index) => (
              <div key={index} className="grid grid-cols-12 border-b border-gray-100">
                <div className="col-span-2 p-3 text-gray-500 font-medium bg-gray-50 border-r border-gray-200">
                  {index % 2 === 0 && timeSlot}
                </div>
                <div className="col-span-10 p-2 bg-white">
                  {/* Appointment slots would go here */}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (view === 'week') {
      const weekDays = getDaysOfWeek();
      
      return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-8 divide-x divide-gray-200">
            {/* Time column */}
            <div className="bg-gray-50">
              <div className="h-12 border-b border-gray-200">
                {/* Empty cell for the corner */}
              </div>
              {generateTimeSlots().map((timeSlot, index) => (
                index % 2 === 0 && (
                  <div key={index} className="h-12 flex items-center justify-end pr-2 text-gray-500 font-medium">
                    {timeSlot}
                  </div>
                )
              ))}
            </div>
            
            {/* Days columns */}
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="min-w-0">
                <div className={`h-12 flex flex-col items-center justify-center border-b border-gray-200 
                  ${isToday(day) ? 'bg-primary-blue text-white' : 'bg-gray-50'}`}>
                  <div className="text-sm font-medium">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-semibold ${isToday(day) ? 'text-white' : 'text-gray-700'}`}>
                    {formatDay(day)}
                  </div>
                </div>
                
                {generateTimeSlots().map((_, slotIndex) => (
                  <div key={slotIndex} className="h-6 border-b border-gray-100">
                    {/* Appointment slots would go here */}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      // Month view
      const today = new Date();
      const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
      const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
      
      // Calculate previous month's days that appear in current month view
      const prevMonthDays = [];
      const prevMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0);
      const daysInPrevMonth = prevMonth.getDate();
      for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        prevMonthDays.push(daysInPrevMonth - i);
      }
      
      // Calculate days for current month
      const currentMonthDays = [];
      for (let i = 1; i <= daysInMonth; i++) {
        currentMonthDays.push(i);
      }
      
      // Calculate next month's days that appear in current month view
      const nextMonthDays = [];
      const totalDaysShown = 42; // 6 rows of 7 days
      const remainingDays = totalDaysShown - prevMonthDays.length - currentMonthDays.length;
      for (let i = 1; i <= remainingDays; i++) {
        nextMonthDays.push(i);
      }
      
      return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Month header */}
          <div className="grid grid-cols-7 bg-gray-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center text-gray-600 font-medium">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {/* Previous month days */}
            {prevMonthDays.map((day, index) => (
              <div key={`prev-${index}`} className="bg-gray-100 p-2 h-24">
                <div className="text-gray-400">{day}</div>
              </div>
            ))}
            
            {/* Current month days */}
            {currentMonthDays.map((day) => {
              const isCurrentDay = 
                day === today.getDate() && 
                selectedDate.getMonth() === today.getMonth() && 
                selectedDate.getFullYear() === today.getFullYear();
              
              return (
                <div key={`current-${day}`} className="bg-white p-2 h-24">
                  <div className={`text-sm font-medium ${isCurrentDay ? 'bg-primary-blue text-white rounded-full w-7 h-7 flex items-center justify-center' : 'text-gray-700'}`}>
                    {day}
                  </div>
                  
                  {/* You could add appointment indicators here */}
                </div>
              );
            })}
            
            {/* Next month days */}
            {nextMonthDays.map((day, index) => (
              <div key={`next-${index}`} className="bg-gray-100 p-2 h-24">
                <div className="text-gray-400">{day}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };
  
  return (
    <div>
      {renderCalendarView()}
    </div>
  );
};

export default Calendar; 