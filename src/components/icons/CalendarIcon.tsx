

const CalendarIcon = () => {
    return (
        <img 
            src="/Calendar.svg" 
            alt="Calendar" 
            className="calendar-logo"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/150x50?text=Medical+Home';
            }}
        />
      )
}

export default CalendarIcon
