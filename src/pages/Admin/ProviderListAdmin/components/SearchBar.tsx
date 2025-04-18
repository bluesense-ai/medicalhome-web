import React, { useState } from "react";
import FilterBox from "./FilterBox";

interface SearchBarProps {
  filterText: string;
  setFilterText: (text: string) => void;
  filters: FilterValues;
  setFilters: React.Dispatch<React.SetStateAction<FilterValues>>;
}

interface FilterValues {
  physicianType: string;
  clinic: string;
  status: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  filterText,
  setFilterText,
  filters,
  setFilters,
}) => {
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);

  const toggleFilterBox = () => setIsFilterBoxOpen(!isFilterBoxOpen);

  const clearAllFilters = () => {
    setFilters({
      physicianType: "",
      clinic: "",
      status: [],
    });
    setFilterText("");
  };

  const isAnyFilterApplied =
    filters.physicianType !== "" ||
    filters.clinic !== "" ||
    filters.status.length > 0 ||
    filterText !== "";

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-2 md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2 lg:items-start">
        <div className="flex flex-col items-start space-y-2 w-full lg:w-auto">
          <div className="flex items-start space-x-2 w-full lg:w-[450px]">
            <div className="flex items-center space-x-1 w-full">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search a last name, MINC #, name or job title"
                  className="w-full h-[39px] lg:w-[400px] pl-4 pr-12 py-2 rounded-full border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent text-sm"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
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
              <button
                className="w-[39px] h-[39px] flex-shrink-0 flex items-center justify-center bg-white hover:bg-gray-50 rounded-lg "
                onClick={toggleFilterBox}
              >
                {isFilterBoxOpen ? (
                  <img
                    src="/Icons/close.svg"
                    alt="Close"
                    width={20}
                    height={20}
                  />
                ) : (
                  <img
                    src="/Icons/tune.svg"
                    alt="Tune"
                    width={20}
                    height={20}
                  />
                )}
              </button>
            </div>
          </div>
          {isFilterBoxOpen && isAnyFilterApplied && (
            <div
              className="flex items-center space-x-2 text-sm text-[#CC2B29] cursor-pointer ml-2"
              onClick={clearAllFilters}
            >
              <img
                src="/Icons/cleaning_services.svg"
                alt="Clear"
                width={16}
                height={16}
              />
              <span>Clear all filters</span>
            </div>
          )}
        </div>
        <div className="w-full lg:w-full">
          {isFilterBoxOpen && (
            <FilterBox
              filters={filters}
              setFilters={setFilters}
              onClose={() => setIsFilterBoxOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;