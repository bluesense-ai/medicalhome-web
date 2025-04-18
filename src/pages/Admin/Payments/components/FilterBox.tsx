import React from "react";

export interface FilterValues {
  physicianType: string;
  clinic: string;
  status: string[];
}

interface FilterBoxProps {
  filters: FilterValues;
  setFilters: React.Dispatch<React.SetStateAction<FilterValues>>;
  onClose: () => void;
}

const FilterBox: React.FC<FilterBoxProps> = ({ filters, setFilters }) => {
  const statusOptions = [
    { label: "Available", color: "bg-[#5BE548]" },
    { label: "On call", color: "bg-[#CC2B29]" },
    { label: "Vacation", color: "bg-[#3499D6]" },
    { label: "Out of Office", color: "bg-[#F6B818]" },
  ];

  const toggleStatus = (status: string) => {
    setFilters((prev: FilterValues) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s: string) => s !== status)
        : [...prev.status, status],
    }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters((prev: FilterValues) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full flex flex-col space-y-4 sm:space-y-8 bg-white shadow-sm rounded-lg border-2 border-[#6ba4ad] px-4 sm:px-9 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
        <p className="text-[16px] text-gray-600 w-full sm:w-auto">Select</p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-grow">
          <div className="flex-1 relative">
            <select
              name="physicianType"
              value={filters.physicianType}
              onChange={handleSelectChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-white appearance-none cursor-pointer"
            >
              <option value="">Select type of physician</option>
              <option value="Family physician">Family Physician</option>
              <option value="Chiropractor">Chiropractor</option>
              <option value="Physical therapist">Physical Therapist</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <img
                src="/Icons/Chevron down.svg"
                alt="Dropdown arrow"
                className="w-4 h-4"
              />
            </div>
          </div>
          {/* <div className="flex-1 relative">
            <select
              name="clinic"
              value={filters.clinic}
              onChange={handleSelectChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-white appearance-none cursor-pointer"
            >
              <option value="">Select clinic</option>
              <option value="clinic1">Clinic 1</option>
              <option value="clinic2">Clinic 2</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <img
                src="/Icons/Chevron down.svg"
                alt="Dropdown arrow"
                className="w-4 h-4"
              />
            </div>
          </div> */}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
        <p className="text-[16px] text-gray-600 w-full sm:w-auto">Status</p>
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-start sm:justify-between w-full">
          {statusOptions.map((status) => (
            <button
              key={status.label}
              onClick={() => toggleStatus(status.label)}
              className={`flex items-center justify-between space-x-2 px-2 py-1 rounded-lg text-sm sm:text-base ${
                filters.status.includes(status.label)
                  ? "bg-gray-200"
                  : "bg-white"
              } border border-gray-300`}
            >
              <span
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${status.color}`}
              ></span>
              <span>{status.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBox;
