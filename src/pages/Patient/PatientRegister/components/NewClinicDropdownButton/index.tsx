import { useContext, useEffect, useState } from "react";
import { UserDetailsContext } from "../.."; // Adjust this import based on your context file location
import axiosInstance from "../../../../../axios/axiosInstance"; // Adjust this import based on your axios instance location

const Arrow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="12"
      viewBox="0 0 22 12"
      fill="none"
    >
      <path d="M1 1L11.4348 11L21 1" stroke="black" />
    </svg>
  );
};

type ClinicOption = {
  id: string;
  name: string;
};

type DropdownProps = {
  clinics: ClinicOption[];
  onSelect: (arg: string) => void;
};

const Dropdown = ({ clinics, onSelect }: DropdownProps) => {
  return (
    <div className="relative flex flex-col w-full h-[120px] border rounded-md border-black/50 bg-white justify-start p-3 z-10">
      {clinics.map((clinic) => (
        <div
          key={clinic.id}
          className="flex text-sm font-normal font-['Roboto'] leading-tight self-start tracking-tight my-2 cursor-pointer"
          onClick={() => onSelect(clinic.id)}
        >
          {clinic.name}
        </div>
      ))}
    </div>
  );
};

type NewClinicDropdownButtonProps = {
  onSelectedClinicIdChange: (clinicId: string) => void;
};

const NewClinicDropdownButton = ({
  onSelectedClinicIdChange,
}: NewClinicDropdownButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clinics, setClinics] = useState<ClinicOption[]>([]);
  const { selectedClinic, setSelectedClinic } = useContext(UserDetailsContext);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BACKEND_URL}/clinics//get-all-clinics`
        );
        const fetchedClinics = response.data.map((clinic: ClinicOption) => ({
          id: clinic.id,
          name: clinic.name,
        }));
        setClinics(fetchedClinics);
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };

    fetchClinics();
  }, []);

  const handleSelect = (clinicId: string) => {
    setSelectedClinic(clinicId);
    onSelectedClinicIdChange(clinicId);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-between items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575]"
        type="button"
      >
        <p>
          {selectedClinic && clinics.length > 0
            ? clinics.find((c) => c.id === selectedClinic)?.name ||
              "Choose Clinic"
            : "Choose Clinic"}
        </p>
        <Arrow />
      </button>
      {isOpen && <Dropdown clinics={clinics} onSelect={handleSelect} />}
    </>
  );
};

export default NewClinicDropdownButton;
