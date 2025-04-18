import CopyButton from "../../../../components/Common/CopyButton";
import { useEffect, useState } from "react";

const SettingsDropdown = ({ setShowMicTestModal, consultRaw }: any) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [triggerCopy, setTriggerCopy] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  useEffect(() => {
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 100);
  }, [triggerCopy]);

  return (
    <div className="relative float-right w-[7%] mt-3">
      {/* Dropdown Toggle Icon */}
      <button
        onClick={toggleDropdown}
        className="text-gray-600 text-lg focus:outline-none ml-4 w-full"
      >
        <i className="fa-solid fa-ellipsis-vertical"> </i>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-[13rem]  bg-[#004f62] border border-gray-200 rounded-lg shadow-lg z-50 py-2">
          <div
            className="flex items-center px-4  hover:bg-[#e7e7e1] group cursor-pointer py-3"
            onClick={() => setTriggerCopy(true)}
          >
            <CopyButton
              data={consultRaw}
              color="text-white"
              triggerCopy={triggerCopy}
              setTriggerCopy={setTriggerCopy}
            />
            <span className="text-white group-hover:text-[#a9a9a9]">
              Copy Soap Notes
            </span>
          </div>
          <div
            onClick={() => {
              setShowMicTestModal(true);
              setIsDropdownOpen(false);
            }}
            className="flex items-center px-4  hover:bg-[#e7e7e1] cursor-pointer py-3 group"
          >
            <i className="fa-solid fa-microphone-lines text-white mr-2 text-xl group-hover:text-[#a9a9a9]"></i>
            <span className="text-white group-hover:text-[#a9a9a9]">
              Microphone Test
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
