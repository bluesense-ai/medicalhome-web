const Header = () => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center">
        <button className="text-gray-700 hover:text-gray-900">
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center">
        <img 
          src="/logo.svg" 
          alt="Medical Home Logo" 
          className="h-10"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://placehold.co/120x40?text=Medical+Home';
          }}
        />
      </div>
      
      <div className="flex items-center">
        <button className="rounded-full bg-gray-800 text-white w-10 h-10 flex items-center justify-center">
          D
        </button>
      </div>
    </header>
  );
};

export default Header; 