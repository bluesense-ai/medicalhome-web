import React, { useState } from "react";
import ReactSlider from "react-slider";

interface FilterBoxProps {
  onApplyFilters: (filters: FilterState) => void;
}

interface FilterState {
  searchTerm: string;
  physicianType: string;
  clinic: string;
  sex: string;
  age: [number, number];
  startDate: Date | null;
  endDate: Date | null;
}

const FilterBox: React.FC<FilterBoxProps> = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    physicianType: "",
    clinic: "",
    sex: "",
    age: [0, 100],
    startDate: null,
    endDate: null,
  });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleSexChange = (value: string) => {
    // Toggle sex selection - if clicking the same button, clear the selection
    const newValue = filters.sex === value ? "" : value;
    const newFilters = { ...filters, sex: newValue };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleAgeChange = (value: [number, number]) => {
    const newFilters = { ...filters, age: value };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const dateValue = value ? new Date(value) : null;

    if (name === "startDate") {
      setStartDate(dateValue);
    } else if (name === "endDate") {
      setEndDate(dateValue);
    }

    // Apply filters on date change
    onApplyFilters({
      ...filters,
      startDate: name === "startDate" ? dateValue : startDate,
      endDate: name === "endDate" ? dateValue : endDate,
    });
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      searchTerm: "",
      physicianType: "",
      clinic: "",
      sex: "",
      age: [0, 100],
      startDate: null,
      endDate: null,
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const renderSexButton = (
    value: string,
    label: string,
    iconSrc: string,
    colorScheme: {
      border: string;
      text: string;
      bg: string;
    }
  ) => (
    <button
      onClick={() => handleSexChange(value)}
      className={`flex items-center space-x-2 px-6 py-1 rounded-md text-base border transition-all duration-200 ${
        filters.sex === value
          ? `${colorScheme.border} ${colorScheme.text} ${colorScheme.bg}`
          : "border-gray-300 text-gray-600 hover:bg-gray-50"
      }`}
    >
      <img src={iconSrc} alt={label} width={18} height={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 w-full">
      <div className="flex flex-col space-y-4">
        {/* Search and Select Providers Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/2 lg:w-[400px]">
            <div className="relative w-full">
              <input
                type="text"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleInputChange}
                placeholder="Search by last name or name"
                className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7C3AED]">
                <img
                  src="/Icons/Search.svg"
                  alt="Search"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-[60%] flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-2 lg:space-x-5">
            <span className="text-sm text-gray-600 whitespace-nowrap md:hidden lg:inline">
              Select
            </span>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2 lg:space-x-8 w-full">
              <div className="flex-1 relative">
                <select
                  name="physicianType"
                  value={filters.physicianType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 "
                >
                  <option value="">Select type of provider</option>
                  <option value="Family physician">Family Physician</option>
                  <option value="Specialist">Specialist</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <img
                    src="/Icons/Chevron down.svg"
                    alt="Dropdown arrow"
                    className="w-4 h-4"
                  />
                </div>
              </div>
              <div className="flex-1 relative">
                <select
                  name="clinic"
                  value={filters.clinic}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 "
                >
                  <option value="">Select clinic</option>
                  <option value="Hope Health Centre">Hope Health Centre</option>
                  <option value="Walmart clinic">Walmart Clinic</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <img
                    src="/Icons/Chevron down.svg"
                    alt="Dropdown arrow"
                    className="w-4 h-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Filters Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <button
              onClick={handleClearFilters}
              className="text-red-500 hover:text-red-700 text-sm flex items-center space-x-2"
            >
              <img
                src="/Icons/cleaning_services.svg"
                alt="Clear"
                width={16}
                height={16}
              />
              <span>Clear all filters</span>
            </button>
            <div className="mt-8 flex flex-col space-y-2">
              <label>Date Joined:</label>
              <div className="flex flex-wrap gap-3 sm:flex-nowrap">
                <div className="flex flex-col">
                  <input
                    className="w-full sm:w-auto px-6 py-1 rounded-md text-base border transition-all duration-200"
                    type="date"
                    name="startDate"
                    value={
                      startDate ? startDate.toISOString().split("T")[0] : ""
                    }
                    onChange={handleDateChange}
                  />
                  <span className="text-sm text-gray-500 self-start ml-2">From</span>
                </div>
                <div className="flex flex-col">
                  <input
                    className="w-full sm:w-auto px-6 py-1 rounded-md text-base border transition-all duration-200"
                    type="date"
                    name="endDate"
                    value={endDate ? endDate.toISOString().split("T")[0] : ""}
                    onChange={handleDateChange}
                  />
                  <span className="text-sm text-gray-500 self-start ml-2">To</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:w-[60%] space-y-8 pt-5">
            {/* Sex Filter */}
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Sex
                <br />
                (assigned at birth)
              </span>

              <div className="flex flex-wrap gap-9">
                {renderSexButton("Male", "Male", "/Icons/male.svg", {
                  border: "border-blue-500",
                  text: "text-blue-600",
                  bg: "bg-blue-50",
                })}
                {renderSexButton("Female", "Female", "/Icons/female.svg", {
                  border: "border-pink-500",
                  text: "text-pink-600",
                  bg: "bg-pink-50",
                })}
                {renderSexButton("Other", "Other", "/Icons/others.svg", {
                  border: "border-green-500",
                  text: "text-green-600",
                  bg: "bg-green-50",
                })}
              </div>
            </div>
            {/* Age Filter */}
            <div className="flex items-start space-x-4">
              <span className="text-sm text-gray-600 whitespace-nowrap w-20">
                Age(s)
              </span>

              <div className="flex-grow flex flex-col items-start">
                <div className="w-[77%]">
                  <ReactSlider
                    className="h-4 flex items-center"
                    thumbClassName="w-5 h-5 bg-green-500 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    trackClassName="h-2 custom-track"
                    min={0}
                    max={100}
                    defaultValue={[0, 100]}
                    ariaLabel={["Lower thumb", "Upper thumb"]}
                    ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                    renderThumb={(props) => <div {...props} />}
                    pearling
                    minDistance={1}
                    value={filters.age}
                    onChange={handleAgeChange}
                  />
                </div>
                <div className="flex justify-center text-xs text-gray-500 font-bold w-[77%] mt-2">
                  <span>
                    {filters.age[0]} - {filters.age[1]} years
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBox;
