import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../axios/axiosInstance";
import Swal from "sweetalert2";

const ClinicSelector: React.FC<{
  onClinicChange: (clinicId: string) => void;
  existingClinicId: string | "";
  dataExist: boolean;
}> = ({ onClinicChange, existingClinicId, dataExist }) => {
  const [clinics, setClinics] = useState<any[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<string>(
    existingClinicId || ""
  );

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

  useEffect(() => {
    if (!dataExist) {
      const storedClinic = localStorage.getItem("selectedClinic");
      const today = new Date().toLocaleDateString();
      const storedDate = localStorage.getItem("clinicSelectionDate");
      if (
        (!storedClinic || !storedDate || storedDate !== today) &&
        clinics.length
      ) {
        Swal.fire({
          title: "Select Today's Clinic",
          input: "select",
          inputOptions: clinics.reduce((options: any, clinic: any) => {
            options[clinic.id] = clinic.name;
            return options;
          }, {}),
          inputPlaceholder: "Choose a clinic",
          showCancelButton: false,
          confirmButtonText: "Select",
          allowOutsideClick: false,
          preConfirm: (selected: any) => {
            if (!selected) {
              Swal.showValidationMessage("Please select a clinic");
              return false;
            }
            setSelectedClinic(selected);
            onClinicChange(selected);
            localStorage.setItem("selectedClinic", selected);
            localStorage.setItem("clinicSelectionDate", today);
          },
        });
      } else if (storedClinic) {
        setSelectedClinic(storedClinic);
        onClinicChange(storedClinic);
      }
    }
  }, [clinics, dataExist]);
  useEffect(() => {
    if (dataExist) {
      setSelectedClinic(existingClinicId);
    }
  }, [existingClinicId, dataExist]);

  const handleChange = (event: any) => {
    const selected = event.target.value;
    setSelectedClinic(selected);
    if (!dataExist) {
      localStorage.setItem("selectedClinic", selected);
    }
    onClinicChange(selected);
  };

  return (
    <div className="clear-both mb-4">
      <label
        htmlFor="clinic-select"
        className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider"
      >
        {dataExist ? "Consult's Clinic" : "Today's Clinic"}
      </label>
      <select
        id="clinic-select"
        value={selectedClinic}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg border border-[#b1b1b1] mt-1 text-sm font-normal font-['Roboto'] leading-tight tracking-wide"
      >
        <option value="" disabled>
          {dataExist ? "Select Consult's Clinic" : "Select Today's Clinic"}
        </option>
        {clinics &&
          clinics.map((clinic: any) => (
            <option key={clinic.id} value={clinic.id}>
              {clinic.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default ClinicSelector;
