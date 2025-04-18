import { useContext, useState } from "react";

import { SelectedUserContextNew } from "../../pages/Patient/Onboarding";

const TogglePatient = () => {
  const [toggled, setToggled] = useState(true);
  const { selectedUser, setSelectedUser } = useContext(SelectedUserContextNew);

  const handleClick = (toggleState: boolean, toggleValue: string) => {
    setToggled(!toggleState);
    if (toggleValue === "Patient") {
      console.log("text");
      console.log(selectedUser);
      setSelectedUser("Provider");
    } else {
      console.log("text 2");
      console.log(selectedUser);
      setSelectedUser("Patient");
    }
  };

  return (
    <button
      onClick={() => handleClick(toggled, selectedUser)}
      className="w-[150px] h-[38px] p-2.5 bg-[#004f62] rounded-[165px] flex-col justify-center items-start gap-2.5 transition-colors duration-100 ease-in-out flex"
    >
      <div
        className={
          toggled
            ? "w-16 h-7 py-1.5 bg-[#33c213] rounded-[170px] justify-center items-center absolute left-3 gap-2.5 inline-flex"
            : "w-16 h-7 px-2.5 py-[9px] bg-white rounded-[170px] justify-center items-center absolute right-3 gap-2.5 inline-flex"
        }
      >
        {toggled ? (
          <p className="text-center text-white text-[11px] font-bold font-['Roboto'] capitalize leading-relaxed tracking-wide">
            {selectedUser}
          </p>
        ) : (
          <p className="text-center text-[#33c213] text-[11px] font-bold font-['Roboto'] capitalize leading-relaxed tracking-wide">
            {selectedUser}
          </p>
        )}
      </div>
    </button>
  );
};

export default TogglePatient;
