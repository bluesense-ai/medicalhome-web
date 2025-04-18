import React from "react";

interface SelectFieldProps {
  name: string;
  label: string;
  showLabel?: boolean;
  options: { value: string; label: string }[];
  selectedValue?: string
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  showLabel = true,
  selectedValue,
  onChange
}) => (
  <div className="relative w-full">
    {showLabel && (
         <label
         htmlFor={name}
         className="block text-sm font-medium text-gray-700 mb-1 "
       >
         {label}
       </label>
    )}
   
    <select
      name={name}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer appearance-none "
      onChange={onChange}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} selected={option.value === selectedValue} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
      <img
        src="/Icons/Chevron down.svg"
        alt="Dropdown arrow"
        className="w-4 h-4"
      />
    </div>
  </div>
);
