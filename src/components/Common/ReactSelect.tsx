import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

interface ReactSelectProps {
  name: string;
  label?: string;
  options: any;
  isMulti?: boolean;
  width?: string; // New prop for dynamic width
  onSelectionChange?: (selectedProvider: any) => void;
  allowCustomData?: boolean;
  value?: any;
  customStyles?: any;
  showLabel?: boolean;
  className?: string;
}

const ReactSelect: React.FC<ReactSelectProps> = ({
  name,
  label="",
  options,
  isMulti = false,
  width = "250px",
  onSelectionChange,
  value = null,
  allowCustomData = false,
  customStyles,
  showLabel = false,
  className="",
}) => {
  const [selectedOption, setSelectedOption] = useState(value);
  const [localOptions, setLocalOptions] = useState(options);

  const handleChange = (option: any) => {
    setSelectedOption(option);
    if (onSelectionChange) {
      onSelectionChange(option);
    }
  };
  useEffect(() => {
    if (value && options) {
      if (typeof value === "string") {
        const matchedOption = options.find(
          (option: any) => option.value === value
        );
        setSelectedOption(matchedOption || null);
      } else {
        setSelectedOption(value);
      }
    }
  }, [value, options]);
  useEffect(() => {
    setLocalOptions(options); // Update local options if `options` prop changes
  }, [options]);

  const handleCreate = (inputValue: string) => {
    const newOption = { value: inputValue, label: inputValue, isNew: true };
    setLocalOptions((prevOptions: any) => [...prevOptions, newOption]);
    setSelectedOption(
      isMulti ? [...(selectedOption || []), newOption] : newOption
    );

    if (onSelectionChange) {
      isMulti
        ? onSelectionChange([...(selectedOption || []), newOption])
        : onSelectionChange(newOption);
    }
  };
  const styles = {
    container: (provided: any) => ({
      ...provided,
      width: width,
      ...(customStyles?.container || {}),
    }),
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "white", // Ensure background color is applied here
      borderColor: "#ccc", // Light gray border
      borderRadius: "5px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#3498db",
      },
    }),
    option: (provided: any) => ({
      ...provided,
      color: "black",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#fff", // Ensure the dropdown is visible
      borderRadius: "5px",
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "rgba(52, 152, 219, 0.25)",
      borderRadius: "8px",
      padding: "3px",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#004F62", 
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#004F62",
      "&:hover": {
        backgroundColor: "rgba(52, 152, 219, 0.35)", 
        color: "white",
      },
    }),
  };
  const SelectComponent = allowCustomData ? CreatableSelect : Select;
  return (
    <div className={`${className}`}>
      {showLabel && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <SelectComponent
        inputId={name}
        value={selectedOption}
        onChange={handleChange}
        options={localOptions}
        isMulti={isMulti}
        onCreateOption={allowCustomData ? handleCreate : undefined}
        styles={styles}
        placeholder={`Select ${label.toLowerCase()}`}
      />
    </div>
  );
};

export default ReactSelect;
