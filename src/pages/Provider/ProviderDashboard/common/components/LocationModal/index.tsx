import { useSelector, useDispatch } from "react-redux";
import Dropdown from "../../../../../../components/Dropdown";
import { useEffect, useState } from "react";
import { setProvider } from "../../../../../../features/Provider/providerSlice";
import axiosInstance from "../../../../../../axios/axiosInstance";

const LocationModal = ({ handleModalSubmit }: { handleModalSubmit: any }) => {
  const [selectedClinic, setSelectedClinic] = useState("");
  const [clinics, setClinics] = useState<any[]>([]);
  const dispatch = useDispatch();
  const provider = useSelector(
    (state: {
      provider: {
        lastName: string;
        clinic: string;
      };
    }) => state.provider
  );
  const today = new Date().toLocaleDateString();

  const handleSelectedClinic = (value: string) => {
    setSelectedClinic(value);
    localStorage.setItem(
      "selectedClinic",
      clinics.find((clinic) => clinic.name === value).id
    );
    localStorage.setItem("clinicSelectionDate", today);
    // console.log("The id", clinics.find((clinic) => clinic.name === value).id);
    // console.log(clinics);
  };

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axiosInstance.get(
          import.meta.env.VITE_BACKEND_URL + "/clinics/get-all-clinics"
        );
        setClinics(response.data);
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };
    fetchClinics();
  }, []);

  const handleSubmit = () => {
    if (selectedClinic != "") {
      dispatch(
        setProvider({
          ...provider,
          clinic: selectedClinic,
        })
      );
      console.log("Clinics", formatClinics(clinics));
      handleModalSubmit();
    } else {
      alert("Select a Clinic!");
      console.log("Clinics", formatClinics(clinics));
    }
  };

  const formatClinics = (clinics: any) => {
    const formattedClinics = [];
    for (let i = 0; i < clinics.length; i++) {
      const { id, name } = clinics[i];
      const subset = { id, name };
      formattedClinics.push(subset);
    }
    // console.log("Formatted clinics", formattedClinics);
    return formattedClinics;
  };

  return (
    <div className="h-60 w-[553px] bg-[#004f62]/70 rounded-[11px] overflow-hidden flex flex-col justify-center items-center">
      <h1 className="text-[#f2f8ff] text-2xl font-bold font-['Roboto'] leading-7 mb-[22px]">
        Welcome, Dr. {provider.lastName}
      </h1>
      <p className="text-[#f2f8ff] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider mb-[8px]">
        Where are you logging in from?
      </p>
      <Dropdown
        label="Clinic"
        width="[45%]"
        options={formatClinics(clinics)}
        selectedOption={handleSelectedClinic}
      />
      <button
        onClick={handleSubmit}
        className="w-[172px] h-[38px] p-3 bg-[#33c213] rounded-lg border mt-5 border-[#33c213] justify-center items-center gap-2 inline-flex overflow-hidden"
      >
        <p className="text-[#f2fff3] text-sm font-semibold font-['Roboto'] leading-[14px]">
          Start my day
        </p>
      </button>
    </div>
  );
};

export default LocationModal;
