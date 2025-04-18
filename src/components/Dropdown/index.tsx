import { useRef, useState } from "react";

type Option = {
  id: string;
  name: string;
};

type DropdownProps = {
  width: string; // 8/16/auto => w-8/w-16/w-auto or [100%]/[10px]/[20rem] => w-[100%]/w-[10px]/w-[20rem]
  label: string;
  options: Option[];
  selectedOption: (arg: string) => void;
};

const DropdownList = ({
  label,
  onSelect,
  options,
}: {
  label: string;
  onSelect: (arg: string) => void;
  options: Option[];
}) => {
  return (
    <div className="h-auto w-[75%] absolute top-2 bg-white p-2 rounded-lg shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] border border-[#d9d9d9] flex-col justify-start items-start gap-3 inline-flex">
      <h3 className="text-[#1e1e1e] text-sm font-semibold font-['Roboto'] leading-none">
        {label}
      </h3>
      {options.map((option) => (
        <p
          key={option.id}
          onClick={() => onSelect(option.name)}
          className="text-[#1e1e1e] text-xs font-normal font-['Roboto'] leading-none cursor-pointer"
        >
          {option.name}
        </p>
      ))}
    </div>
  );
};

const Dropdown = ({ width, label, options, selectedOption }: DropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(label);
  const dropdownOptionsRef = useRef<HTMLInputElement>(null);

  const closeOpenMenus = (e: any) => {
    if (isDropdownOpen && !dropdownOptionsRef.current?.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", closeOpenMenus);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    selectedOption(value);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div
        ref={dropdownOptionsRef}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`w-${width} relative flex justify-between pl-4 pr-3 py-3 h-10 bg-white rounded-lg border border-[#b1b1b1] items-center gap-2`}
      >
        <p className="text-[#757575] whitespace-nowrap w-[80%] text-sm font-normal font-['Roboto'] leading-tight tracking-tight">
          {selectedValue}
        </p>
        <img src="/Icons/DropdownArrow.svg" />
        {isDropdownOpen && (
          <DropdownList
            label={label}
            onSelect={handleSelect}
            options={options}
          />
        )}
      </div>
    </>
  );
};

export default Dropdown;
