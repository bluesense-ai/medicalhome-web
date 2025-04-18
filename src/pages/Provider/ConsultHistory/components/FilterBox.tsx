import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../axios/axiosInstance";
import * as utils from "../../../../common/utils/utils";
export interface FilterValues {
  serviceType: string;
  clinic: string;
  date_time: string;
  dateType: string;
}
interface FilterBoxProps {
  consults: any[];
  onFilter: (filteredConsults: any[]) => void;
}

const FilterBox: React.FC<FilterBoxProps> = ({ consults, onFilter }) => {
  const [services, setServices] = useState([]);
  const [clinics, setClinics] = useState([]);

  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);

  const toggleFilterBox = () => setIsFilterBoxOpen(!isFilterBoxOpen);
  const [filterText, setFilterText] = useState("");

  const [filters, setFilters] = useState<FilterValues>({
    serviceType: "",
    clinic: "",
    date_time: "",
    dateType: "onOrAfter",
  });
 
  const applyFilters = () => {
    const filtered = consults.filter((consult) => {
      const matchesText =
        !filterText ||
        (consult.patient.first_name + " " + consult.patient.last_name)
          .toLowerCase()
          .includes(filterText.toLowerCase()) ||
        consult.patient.health_card_number?.includes(
          filterText.toLowerCase()
        ) ||
        consult.patient.email_address
          ?.toLowerCase()
          .includes(filterText.toLowerCase()) ||
        consult.assessment?.toLowerCase().includes(filterText.toLowerCase()) ||
        (consult.provider.first_name + " " + consult.provider.last_name)
          .toLowerCase()
          .includes(filterText.toLowerCase());

      const matchesServiceType =
        !filters.serviceType || consult.service?.name === filters.serviceType;

      const matchesClinic =
        !filters.clinic || consult.clinic?.name === filters.clinic;

      const consultDate = consult.date_time;
      const selectedDate = filters.date_time;

      let matchesDate = true;
      if (selectedDate) {
     
        switch (filters.dateType) {
          case "on":
            matchesDate = utils.normalizeDate(consultDate) == utils.normalizeDate(selectedDate);
            break;
          case "onOrAfter":
            matchesDate =  utils.normalizeDate(consultDate) >= utils.normalizeDate(selectedDate);
            break;
          case "onOrBefore":
            matchesDate =  utils.normalizeDate(consultDate) <= utils.normalizeDate(selectedDate);
            break;
          case "oneMonthAfter":
            const oneMonthAfter = new Date(selectedDate);
            oneMonthAfter.setMonth(oneMonthAfter.getMonth() + 1);
            matchesDate =
              new Date(consult.date_time) >= oneMonthAfter;
            break;
          case "oneMonthBefore":
            const oneMonthBefore = new Date(selectedDate);
            oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);
            matchesDate =
              new Date(consult.date_time) <= oneMonthBefore;
            break;
        }
      }

      return matchesText && matchesServiceType && matchesDate && matchesClinic;
    });

    onFilter(filtered);
  };

  // Update the input handler to apply filters immediately
  useEffect(() => {
    applyFilters();
  }, [filters, filterText]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get(
          import.meta.env.VITE_BACKEND_URL + "/services"
        );
        const uniqueServices = response.data.reduce(
          (acc: any, current: any) => {
            if (!acc.find((service: any) => service.name === current.name)) {
              acc.push(current);
            }
            return acc;
          },
          []
        );
        try {
          const response = await axiosInstance.get(
            import.meta.env.VITE_BACKEND_URL + "/clinics/get-all-clinics"
          );
          setClinics(response.data);
        } catch (error) {
          console.error("Error fetching services:", error);
        }

        setServices(uniqueServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);
  const clearAllFilters = () => {
    setFilters({
      serviceType: "",
      clinic: "",
      date_time: "",
      dateType: "",
    });
    setFilterText("");
  };
  const isAnyFilterApplied =
    filters.serviceType !== "" ||
    filters.clinic !== "" ||
    filters.date_time !== "" ||
    filterText !== "";
  filters.dateType !== "";

  const handleSelectChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    console.log(name, value);
    setFilters((prev: FilterValues) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-[80%]  py-[18.50px]  rounded-lg justify-center ">
      <div className="flex flex-col space-y-2 md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2 lg:items-start">
        <div className="flex flex-col items-start space-y-2 w-full lg:w-auto">
          <div className="flex items-start space-x-2 w-full lg:w-[450px]">
            <div className="flex items-center space-x-1 w-full">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search a doctor, patient, or keywords"
                  className="w-full h-[39px] lg:w-[400px] pl-4 pr-12 py-2 rounded-full border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#3499d6]  text-sm"
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
            <div className="w-full flex flex-col space-y-4 sm:space-y-8 bg-white shadow-sm rounded-lg border-2 border-[#6ba4ad] px-4 sm:px-9 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
                <p className="text-[16px] text-gray-600 w-full sm:w-auto">
                  Select
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-grow">
                  <div className="flex-1 relative">
                    <select
                      name="serviceType"
                      value={filters.serviceType}
                      onChange={handleSelectChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-white appearance-none cursor-pointer"
                    >
                      <option value="">Select Service</option>
                      {services &&
                        services.map((service: any) => (
                          <option key={service.id} value={service.name}>
                            {service.name}
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
                  <div className="flex-1 relative">
                    <select
                      name="clinic"
                      value={filters.clinic}
                      onChange={handleSelectChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-white appearance-none cursor-pointer"
                    >
                      <option value="">Select Clinic</option>
                      {clinics &&
                        clinics.map((service: any) => (
                          <option key={service.id} value={service.name}>
                            {service.name}
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
