import React, { useEffect, useState } from "react";
import * as utils from "../../../../common/utils/utils";
import ReactSelect from "../../../../components/Common/ReactSelect";
import axiosInstance from "../../../../axios/axiosInstance";
interface FilterBoxProps {
  tasks: any;
  setFilteredTasks: Function;
}

interface FilterState {
  searchTerm: string;
  assigned_to: Array<{ label: string; value: string }>;
  date_time: string;
  dateType: string;
}

const FilterBox: React.FC<FilterBoxProps> = ({ setFilteredTasks, tasks }) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    assigned_to: [],
    date_time: "",
    dateType: "onOrAfter",
  });
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);
  const toggleFilterBox = () => setIsFilterBoxOpen(!isFilterBoxOpen);
  const [assignedToOptions, setAssignedToOptions] = React.useState([]);
  
  useEffect(() => {
    const fetchAllStaff = async()=>{
      const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/staff/all`);
      const options = response.data.map((staff: any) => ({
        value: staff.id,
        label: staff.first_name + " " + staff.last_name
      }))
      setAssignedToOptions(options);
    }
    fetchAllStaff();
  },[])



  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      searchTerm: "",
      assigned_to: [],
      date_time: "",
      dateType: "onOrAfter",
    };
    setFilters(clearedFilters);
  };

  const isAnyFilterApplied =
    filters.searchTerm !== "" ||
    filters.assigned_to.length > 0 ||
    filters.date_time !== "" ||
    filters.dateType !== "onOrAfter";

  const applyFilters = () => {
    console.log("filters", filters);
    const filtered = tasks.filter((task: any) => {
      const matchesText =
        !filters.searchTerm ||
        task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        task.details?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const due_date = task.due_date;
      const selectedDate = filters.date_time;
      console.log(due_date, selectedDate);

      let matchesAssignedTo = true;
      if (filters.assigned_to.length > 0) {
         matchesAssignedTo = filters.assigned_to.some((assignedTo: any) =>
          task.assigned_to.some((taskMember: any) => taskMember.label.includes(assignedTo.label))
        );
      }

      let matchesDate = true;
      if (selectedDate) {
        switch (filters.dateType) {
          case "on":
            matchesDate =
              utils.normalizeDate(due_date) ==
              utils.normalizeDate(selectedDate);
            break;
          case "onOrAfter":
            matchesDate =
              utils.normalizeDate(due_date) >=
              utils.normalizeDate(selectedDate);
            break;
          case "onOrBefore":
            matchesDate =
              utils.normalizeDate(due_date) <=
              utils.normalizeDate(selectedDate);
            break;
          case "oneMonthAfter":
            const oneMonthAfter = new Date(selectedDate);
            oneMonthAfter.setMonth(oneMonthAfter.getMonth() + 1);
            matchesDate = new Date(task.due_date) >= oneMonthAfter;
            break;
          case "oneMonthBefore":
            const oneMonthBefore = new Date(selectedDate);
            oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);
            matchesDate = new Date(task.due_date) <= oneMonthBefore;
            break;
        }
      }
      console.log(matchesText, matchesDate);
      return matchesText && matchesDate && matchesAssignedTo;
    });

    setFilteredTasks(filtered);
  };
  const handleSelectionChange = (selectedOptions: any) => {
    setFilters({ ...filters, assigned_to: selectedOptions });
  };
  useEffect(() => {
    applyFilters();
  }, [filters]);

  const handleSelectChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    console.log(name, value);
    setFilters((prev: any) => ({ ...prev, [name]: value }));
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
            <div className="w-full flex flex-col space-y-4 sm:space-y-8 bg-white shadow-sm rounded-lg border-2 border-[#6ba4ad] px-4 sm:px-9 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
                <p className="text-[16px] text-gray-600 w-full sm:w-auto">
                  Select
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-grow">
                  <div className="flex-1 relative">
                    <ReactSelect
                      name="assigned_to"
                      label="Assigned To"
                      className="my-1"
                      width="100%"
                      isMulti={true}
                      onSelectionChange={handleSelectionChange}
                      options={assignedToOptions}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
                <p className="text-[16px] text-gray-600 w-full sm:w-auto">
                  Date &nbsp;
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-4 justify-start sm:justify-between w-full">
                  <div className="flex-1 relative">
                    <input
                      type="date"
                      name="date_time"
                      value={filters.date_time}
                      onChange={handleSelectChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-white appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <select
                      name="dateType"
                      value={filters.dateType}
                      onChange={handleSelectChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-white appearance-none cursor-pointer"
                    >
                      <option value="">Where Date is</option>
                      <option value="on">On Date</option>
                      <option value="onOrAfter">On/After Date</option>
                      <option value="onOrBefore">On/Before Date</option>
                      <option value="oneMonthAfter">1 Month After Date</option>
                      <option value="oneMonthBefore">
                        1 Month Before Date
                      </option>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBox;
