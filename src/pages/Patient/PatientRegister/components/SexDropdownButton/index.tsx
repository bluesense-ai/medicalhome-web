import { useContext, useState } from "react";
import { UserDetailsContext } from "../..";

const Arrow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="12"
      viewBox="0 0 22 12"
      fill="none"
    >
      <path d="M1 1L11.4348 11L21 1" stroke="black" />
    </svg>
  );
};

type props = {
  onSelect: (arg: string) => void;
};

const Dropdown = ({ onSelect }: props) => {
  const options = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  return (
    <div className="relative flex flex-col w-full h-auto border rounded-md border-black/50 bg-white justify-start p-3 z-10">
      {options.map((option) => (
        <div
          key={option.value}
          className="flex text-sm font-normal font-['Roboto'] leading-tight self-start tracking-tight my-2 cursor-pointer" // Added 'cursor-pointer' class
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

const SexDropdownButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedSex, setSelectedSex } = useContext(UserDetailsContext);

  const handleSelect = (value: string) => {
    setSelectedSex(value);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-between items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
        type="button" // Had to set the button type to 'button' because the default type is submit if you don't select anything
        //  which triggers the submit in the larger form.
      >
        <p>{selectedSex}</p>
        <Arrow />
      </button>
      {isOpen && <Dropdown onSelect={handleSelect} />}
    </>
  );
};

export default SexDropdownButton;

// added other option and fixed the cursor error