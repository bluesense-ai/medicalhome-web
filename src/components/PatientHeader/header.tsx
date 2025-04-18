import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm h-[56px]">
      <div className="container mx-auto flex items-center justify-between py-2 px-4 h-full">
        <img
          src="/img/general/logo.png" // Replace with your logo path
          alt="Logo"
          className="h-8 mr-4"
        />
        <div className="flex items-center">
          <nav className="flex space-x-6">
            <a
              href="/"
              onClick={() => {
                localStorage.removeItem("token");
              }}
              className="text-primary hover:text-blue-800 font-medium"
            >
              Logout
            </a>
            {/* <a href="#" className="text-primary hover:text-blue-800 font-medium">
             New Link
            </a>
            <a href="#" className="text-primary hover:text-blue-800 font-medium">
              New Link
            </a> */}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
