import React, { useState } from "react";

interface FilterBoxProps {
  onApplyFilters: (filters: FilterState) => void;
}

interface FilterState {
  searchTerm: string;
}

const FilterBox: React.FC<FilterBoxProps> = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: ""
  });

  // const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };



  return (
    <div className="w-[80%]  py-[18.50px]  rounded-lg justify-center ">
      <div className="flex flex-col space-y-2 md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2 lg:items-start">
        <div className="flex flex-col items-start space-y-2 w-full lg:w-auto">
          <div className="flex items-start space-x-2 w-full lg:w-[450px]">
            <div className="flex items-center space-x-1 w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={handleInputChange}
                  placeholder="Search a Service Name, duration ,description or status"
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
          </div>
        
        </div>
        
      </div>
    </div>
  );
};

export default FilterBox;
