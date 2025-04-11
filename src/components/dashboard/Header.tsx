import { FiMenu } from "react-icons/fi";
import Logo from "../icons/Logo";

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-button">
          <FiMenu />
        </button>
      </div>
      
      <div className="header-center">
        <Logo />
      </div>
      
      <div className="header-right">
        <button className="user-avatar">
          D
        </button>
      </div>
    </header>
  );
};

export default Header; 