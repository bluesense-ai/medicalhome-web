import { useState } from 'react';

const ToggleAdmin = () => {
  const [toggled, setToggled] = useState(false);
  const [selectedUser, setSelectedUser] = useState('Admin');

  const handleClick = () => {
    setToggled(!toggled);
    const newUser = toggled ? 'Admin' : 'Admin'; // Determine new user state
    setSelectedUser(newUser);
    console.log(`Switching to ${newUser}`);
    console.log(`Switching to ${selectedUser}`);
  };

  return (
    <button
      onClick={handleClick}
      className="w-[150px] h-[38px] p-2.5 bg-[#004f62] rounded-[165px] flex-col justify-center items-start gap-2.5 transition-colors duration-100 ease-in-out flex relative" 
    >
      <div
        className={
          toggled
            ? 'w-16 h-7 py-1.5 bg-[#33c213] rounded-[170px] justify-center items-center absolute left-3 gap-2.5 inline-flex'
            : 'w-16 h-7 px-2.5 py-[9px] bg-white rounded-[170px] justify-center items-center absolute right-3 gap-2.5 inline-flex'
        }
      >
        {toggled ? (
          <p className="text-center text-white text-[11px] font-bold font-['Roboto'] capitalize leading-relaxed tracking-wide">
            Admin
          </p>
        ) : (
          <p className="text-center text-[#33c213] text-[11px] font-bold font-['Roboto'] capitalize leading-relaxed tracking-wide">
            Admin
          </p>
        )}
      </div>
    </button>
  );
};

export default ToggleAdmin;
