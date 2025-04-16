import './Dashboard.css'; // Assuming styles will be in Dashboard.css
import { FiMenu } from 'react-icons/fi';

const TopNavbar = () => {
  return (
    <div className="top-navbar">
      <div className="navbar-left">
        <button className="menu-button-dash" aria-label="Toggle menu">
          <FiMenu size={24} />
        </button>
      </div>
      <div className="navbar-center">
        {/* Use img tag for logo */}
        <img src="/logo.svg" alt="Medical Home Logo" className="navbar-logo" />
      </div>
      <div className="navbar-right">
        {/* Placeholder for user avatar - replace D with dynamic initial or image */}
        <div className="user-avatar-dash" aria-label="User menu">
          D
        </div>
      </div>
    </div>
  );
};

export default TopNavbar; 