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
}

const FilterBox: React.FC<FilterBoxProps> = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    physicianType: "",
    clinic: "",
    sex: "",
    age: [0, 100],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleSexChange = (value: string) => {
    const newFilters = { ...filters, sex: value };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleAgeChange = (value: [number, number]) => {
    const newFilters = { ...filters, age: value };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      searchTerm: "",
      physicianType: "",
      clinic: "",
      sex: "",
      age: [0, 100],
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  return (
    <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 w-full">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/2 lg:w-[400px]">
            <div className="relative w-full">
              <input
                type="text"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleInputChange}
                placeholder="Search a last name, or name"
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
            <span className="text-sm text-gray-600 whitespace-nowrap md:hidden lg:inline">
              Select
            </span>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2 lg:space-x-8 w-full">
              <select
                name="physicianType"
                value={filters.physicianType}
                onChange={handleInputChange}
                className="w-full md:w-[45%] py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              >
                <option value="">Select type of provider</option>
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

          <div className="flex flex-col lg:w-[60%] space-y-8 pt-5">
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Sex
                <br />
                (assigned at birth)
              </span>

              <div className="flex flex-wrap gap-9">
                <button
                  onClick={() => handleSexChange("Male")}
                  className={`flex items-center space-x-2 px-6 py-1 rounded-md text-base border ${
                    filters.sex === "Male"
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  <img
                    src="/Icons/male.svg"
                    alt="Male"
                    width={18}
                    height={18}
                  />
                  <span>Male</span>
                </button>
                <button
                  onClick={() => handleSexChange("Female")}
                  className={`flex items-center space-x-2 px-6 py-1 rounded-md text-base border ${
                    filters.sex === "Female"
                      ? "border-pink-500 text-pink-600 bg-pink-50"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  <img
                    src="/Icons/female.svg"
                    alt="Female"
                    width={18}
                    height={18}
                  />
                  <span>Female</span>
                </button>
                <button
                  onClick={() => handleSexChange("Other")}
                  className={`flex items-center space-x-2 px-6 py-1 rounded-md text-base border ${
                    filters.sex === "Other"
                      ? "border-green-500 text-green-600 bg-green-50"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  <img
                    src="/Icons/others.svg"
                    alt="Other"
                    width={18}
                    height={18}
                  />
                  <span>Other</span>
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <span className="text-sm text-gray-600 whitespace-nowrap w-20">
                Age(s)
              </span>

              <div className="flex-grow flex flex-col items-start ">
                <div className="w-[77%]">
                  <ReactSlider
                    className="h-4 flex items-center"
                    thumbClassName="w-5 h-5 bg-green-500 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    trackClassName="h-2 custom-track"
                    defaultValue={[0, 100]}
                    ariaLabel={["Lower thumb", "Upper thumb"]}
                    ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                    pearling
                    minDistance={1}
                    value={filters.age}
                    onChange={handleAgeChange}
                  />
                </div>
                <div className="flex justify-center text-xs text-gray-500 font-bold w-[77%] ">
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
