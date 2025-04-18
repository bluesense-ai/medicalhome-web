import React, { useEffect, useState } from "react";
import ReactSelect from "../Common/ReactSelect";
import axiosInstance from "../../axios/axiosInstance";


interface ProviderHeaderProps {
  title: string;
  showAddButton?: boolean;
  showIcon?: boolean;
  showAssignProviderButton?: boolean;
  onAddClick?: () => void;
  onIconClick?: () => void;
  iconSrc?: string;
  onAssignProviderClick?: () => void;
  customRightContent?: React.ReactNode;
  textAlignment?: "left" | "center" | "right";
  iconColor?: "white" | "default";
  onProviderSelect?: (selectedProvider: any) => void;
  selectedProvider?: string;
  enableAssign?: boolean;
}

const ProviderHeader: React.FC<ProviderHeaderProps> = ({
  title,
  showAddButton = false,
  showIcon = false,
  showAssignProviderButton = false,
  onAddClick,
  iconSrc = "/Icons/ButtonIcon.svg",
  customRightContent,
  textAlignment = "left",
  iconColor = "default",
  onIconClick,
  onAssignProviderClick,
  onProviderSelect,
  selectedProvider,
  enableAssign,
}) => {
  const [providers, setProviders] = useState([]);
  const [providerOptions, setProviderOptions] = useState<any>();
  const getContainerClasses = () => {
    const baseClasses =
      "bg-[#005063] text-white rounded-lg opacity-100 flex items-center w-full h-auto min-h-[60px] px-4 py-4 sm:px-7";
    switch (textAlignment) {
      case "center":
        return `${baseClasses} justify-center relative`;
      case "right":
        return `${baseClasses} justify-end`;
      default:
        return `${baseClasses} justify-between flex-wrap sm:flex-nowrap`;
    }
  };

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response: any = await axiosInstance.get(
          import.meta.env.VITE_BACKEND_URL + "/providers"
        );
        const filteredProviders = response.data.filter((provider: any) => (provider.accepting_patients != false));
        setProviders(filteredProviders);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    const options = providers.map((provider: any) => ({
      value: provider.id,
      label: provider.first_name + " " + provider.last_name,
    }));
    setProviderOptions(options);
  }, [providers]);

  const getTitleClasses = () => {
    const baseClasses =
      "font-roboto text-[20px] sm:text-[24px] font-bold leading-[27.36px] text-nowrap";
    return `${baseClasses} text-${textAlignment} mb-2 sm:mb-0 w-full sm:w-auto`;
  };

  const getActionClasses = () => {
    return textAlignment === "center"
      ? "absolute right-4 sm:right-7"
      : "w-full  flex justify-end";
  };

  const getIconClasses = () => {
    const baseClasses = "cursor-pointer";
    return iconColor === "white"
      ? `${baseClasses} filter brightness-0 invert`
      : baseClasses;
  };

  return (
    <div className={getContainerClasses()}>
      <h2 className={getTitleClasses()}>{title}</h2>
      <div className={`flex items-center gap-4 ${getActionClasses()}`}>
        {showAddButton && (
          <button
            onClick={onAddClick}
            className="text-white cursor-pointer focus:outline-none flex items-center gap-2"
          >
            <img src="/Icons/add.svg" alt="Add" className="w-5 h-5" />
            <span className="hidden sm:inline">Add provider</span>
          </button>
        )}
        {showAssignProviderButton && (
          <>
            <button
              onClick={onAssignProviderClick}
              className={`${
                enableAssign
                  ? "bg-[#22c55e] text-[#ffff]"
                  : "bg-[#f0f8ff] text-[#b7b7b7]"
              } font-semibold py-2 px-2 sm:px-4 rounded-lg flex items-center space-x-1 sm:space-x-2`}
            >
              <i
                className={`${
                  enableAssign ? "text-[#ffff]" : "text-[#b7b7b7]"
                } fas fa-user-plus`}
              ></i>
              <span className="text-xs sm:text-base">Assign Provider</span>
            </button>
            <div className="w-full sm:w-auto ">
              <ReactSelect
                name="provider"
                label="Provider"
                options={providerOptions}
                onSelectionChange={onProviderSelect}
                value={selectedProvider}
              />
            </div>
          </>
        )}
        {showIcon && (
          <button>
            <img
              src={iconSrc}
              alt="icon"
              className={getIconClasses()}
              onClick={onIconClick}
            />
          </button>
        )}
        {customRightContent}
      </div>
    </div>
  );
};

export default ProviderHeader;
