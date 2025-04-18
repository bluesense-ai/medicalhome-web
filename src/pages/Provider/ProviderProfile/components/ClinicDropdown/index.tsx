import { useEffect, useState, useContext } from "react";
import axiosInstance from "../../../../../axios/axiosInstance";
import { ProviderClinicsContext } from "../..";

type ClinicOption = {
  id: string;
  name: string;
  location: string;
  weekday_hours: string;
  weekend_hours: string;
  contact: string;
  status: "active" | "inactive"; // Use a union type for known statuses
  ms_calendar_id: string | null;
  createdAt: string; // You could use Date if parsing it beforehand
  updatedAt: string; // Same as above, Date type is optional
  medicalGroup: MedicalGroup; // Referencing the MedicalGroup type
};

type MedicalGroup = {
  id: string;
  name: string;
  status: string | null;
  info: string;
  validity_date: string | null;
};

// Define the type for the main clinic object
type ProviderClinic = {
  id: string;
  name: string;
  location: string;
  weekday_hours: string;
  weekend_hours: string;
  contact: string;
  status: "active" | "inactive"; // Use a union type for known statuses
  ms_calendar_id: string | null;
  createdAt: string; // You could use Date if parsing it beforehand
  updatedAt: string; // Same as above, Date type is optional
  medicalGroup: MedicalGroup; // Referencing the MedicalGroup type
};

const Dropdown = () => {
  const { providerClinics, setProviderClinics } = useContext(
    ProviderClinicsContext
  );
  const [allClinics, setAllClinics] = useState<ClinicOption[]>([]);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BACKEND_URL}/clinics/get-all-clinics`
        );
        const fetchedClinics = response.data.map((clinic: ClinicOption) => ({
          id: clinic.id,
          name: clinic.name,
        }));
        setAllClinics(fetchedClinics);
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };

    fetchClinics();
  }, []);

  // Check if a clinic is in the providerClinics array
  const isClinicSelected = (clinicId: string) => {
    return providerClinics.some((clinic) => clinic.id === clinicId);
  };

  // Handle selecting/deselecting a clinic
  const handleCheckboxChange = (clinic: ClinicOption) => {
    setProviderClinics((prevClinics: ProviderClinic[]) => {
      if (isClinicSelected(clinic.id)) {
        // Remove the clinic if it is already selected
        return prevClinics.filter((c) => c.id !== clinic.id);
      } else {
        // Add the clinic if it is not selected
        return [...prevClinics, clinic];
      }
    });
  };

  return (
    <div
      // onClick={() => console.log("This is all clinics", providerClinics)}
      className="h-auto p-4 w-full bg-white rounded-lg shadow border border-[#d9d9d9] flex-col justify-start items-start gap-4 inline-flex"
    >
      <h1 className="text-[#1e1e1e] text-xs font-semibold font-['Roboto'] leading-none">
        Select clinic(s)
      </h1>
      {allClinics.map((clinic) => (
        <div key={clinic.id} className="flex w-full gap-2">
          <input
            type="checkbox"
            className="accent-[#004f62]"
            checked={isClinicSelected(clinic.id)}
            onChange={() => handleCheckboxChange(clinic)}
          />
          <p className="text-[#1e1e1e] text-xs font-normal font-['Roboto'] leading-none">
            {clinic.name}
          </p>
        </div>
      ))}
    </div>
  );
};

const ClinicDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { providerClinics } = useContext(ProviderClinicsContext);

  const renderProviderClinics = (providersClinics: ProviderClinic[]) => {
    if (providersClinics.length === 1) {
      return providersClinics[0].name;
    } else {
      return `${providersClinics[0].name} + ${providersClinics.length - 1}`;
    }
  };

  return (
    <>
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="h-10 self-stretch p-3 bg-white rounded-lg border border-[#b1b1b1] justify-between items-start gap-2 inline-flex"
      >
        <p className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-tight tracking-tight">
          {providerClinics.length === 0
            ? "Clinics"
            : renderProviderClinics(providerClinics)}
        </p>
        <img src="/Icons/DropdownArrow.svg" />
      </div>
      {isDropdownOpen && <Dropdown />}
    </>
  );
};

export default ClinicDropdown;
