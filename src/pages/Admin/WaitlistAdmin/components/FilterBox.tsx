import React, { useState, useRef } from "react";
import ReactSlider from "react-slider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FilterBoxProps {
  onApplyFilters: (filters: any) => void;
}

const FilterBox: React.FC<FilterBoxProps> = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    physicianType: "",
    clinic: "",
    fromDate: null,
    toDate: null,
    sex: "",
    age: [0, 100],
  });

  const fromDatePickerRef = useRef(null);
  const toDatePickerRef = useRef(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleDateChange = (date: Date | null, name: string) => {
    const newFilters = { ...filters, [name]: date };
    setFilters(newFilters);
  };

  const handleSexChange = (value: string) => {
    const newFilters = { ...filters, sex: value };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleAgeChange = (value: number[]) => {
    const newFilters = { ...filters, age: value };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      searchTerm: "",
      physicianType: "",
      clinic: "",
      fromDate: null,
      toDate: null,
      sex: "",
      age: [0, 100],
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const handleCalendarClick = (pickerRef: React.RefObject<any>) => {
    pickerRef.current?.setOpen(true);
  };

  return (
    <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-black w-full">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/2 lg:w-[400px]">
            <div className="relative w-full">
              <input
                type="text"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleInputChange}
                placeholder="Search a last name, MINC #, name or job title"
                className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7C3AED]">
                <img
                  src="/Icons/Search.svg"
                  alt="Search"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-[60%] flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-2 lg:space-x-5">
            <span className="text-base text-gray-600 whitespace-nowrap md:hidden lg:inline">
              Select
            </span>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2 lg:space-x-8 w-full">
              <select
                name="physicianType"
                value={filters.physicianType}
                onChange={handleInputChange}
                className="w-full md:w-[45%] py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              >
                <option value="">Select type of physician</option>
                <option value="Family physician">Family Physician</option>
                <option value="Specialist">Specialist</option>
              </select>

              <select
                name="clinic"
                value={filters.clinic}
                onChange={handleInputChange}
                className="w-full md:w-[45%] py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              >
                <option value="">Select clinic</option>
                <option value="Hope Health Centre">Hope Health Centre</option>
                <option value="Walmart clinic">Walmart Clinic</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
          <button
            onClick={handleClearFilters}
            className="text-red-500 hover:text-red-700 text-base flex items-center space-x-2 w-full lg:w-[40%]"
          >
            <img
              src="/Icons/cleaning_services.svg"
              alt="Clear"
              width={16}
              height={16}
            />
            <span>Clear all filters</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-9 w-full lg:w-[60%] mt-5 lg:pt-8">
            <span className="text-base text-gray-500 text-left whitespace-nowrap">
              Sex
              <br />
              (assigned at birth)
            </span>

            <div className="flex flex-wrap gap-9">
              <button
                onClick={() => handleSexChange("male")}
                className={`flex items-center space-x-2 px-6 py-1 rounded-md text-base border ${
                  filters.sex === "male"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <img src="/Icons/male.svg" alt="Male" width={16} height={16} />
                <span>Male</span>
              </button>
              <button
                onClick={() => handleSexChange("female")}
                className={`flex items-center space-x-2 px-6 py-1 rounded-md text-base border ${
                  filters.sex === "female"
                    ? "border-pink-500 text-pink-600 bg-pink-50"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <img
                  src="/Icons/female.svg"
                  alt="Female"
                  width={16}
                  height={16}
                />
                <span>Female</span>
              </button>
              <button
                onClick={() => handleSexChange("other")}
                className={`flex items-center space-x-2 px-6 py-1 rounded-md text-base border ${
                  filters.sex === "other"
                    ? "border-green-500 text-green-600 bg-green-50"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <img
                  src="/Icons/others.svg"
                  alt="Other"
                  width={16}
                  height={16}
                />
                <span>Other</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <span className="text-base text-gray-700">Joined in-between</span>

          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
            {/* From Date Input */}
            <div className="w-full md:w-[15%] relative">
              <DatePicker
                ref={fromDatePickerRef}
                selected={filters.fromDate}
                onChange={(date) => handleDateChange(date, "fromDate")}
                placeholderText="From"
                className="w-full py-1 px-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                // Remove any filtering props here
              />
              <img
                src="/Icons/calendar_today.svg"
                alt="Calendar"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                width={16}
                height={16}
                onClick={() => handleCalendarClick(fromDatePickerRef)}
              />
            </div>

            {/* To Date Input */}
            <div className="w-full md:w-[15%] relative">
              <DatePicker
                ref={toDatePickerRef}
                selected={filters.toDate}
                onChange={(date) => handleDateChange(date, "toDate")}
                placeholderText="To"
                className="w-full py-1 px-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                // Remove any filtering props here
              />
              <img
                src="/Icons/calendar_today.svg"
                alt="Calendar"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                width={16}
                height={16}
                onClick={() => handleCalendarClick(toDatePickerRef)}
              />
            </div>

            {/* Age Slider */}
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-4 w-full md:w-[60%] mt-2">
              <span className="text-sm text-gray-600 whitespace-nowrap w-20">
                Age(s)
              </span>

              <div className="flex-grow flex flex-col items-start ">
                <div className="w-full md:w-[77%]">
                  <ReactSlider
                    className="h-4 flex items-center"
                    thumbClassName="w-5 h-5 bg-green-500 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    trackClassName="h-2 bg-[#006e9e]"
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
                <div className="flex justify-center text-xs text-gray-500 font-bold w-full md:w-[77%]">
                  <span>
                    {filters.age[0]} - {filters.age[1]}
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
