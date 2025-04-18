import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../../axios/axiosInstance";


const useFetchConsultData = (consultId:any, localSelectedEvent:any,setLocalSelectedEvent:any) => {
  const [loading, setLoading] = useState(false);
  const [dataExist, setDataExist] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [clinicId, setClinicId] = useState("");
  const [consultIdResp, setConsultIdResp] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    providerNotes: "",
    clinic_id: "",
    illnesses: [],

  });
  const previousFormValues = useRef(formValues);

  useEffect(() => {
    const fetchConsultData = async () => {
      try {
        setLoading(true);
        const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/consults`;
        const reqUrl = consultId
          ? `${baseUrl}/booking/${consultId}`
          : `${baseUrl}/ms-booking/${localSelectedEvent?.ms_booking_id}`;

        const response = await axiosInstance.get(reqUrl);
        
        setDataExist(true);
        setEditMode(false);
        console.log(response);
        const {
          subjective,
          objective,
          assessment,
          plan,
          providerNotes,
          id,
          patient,
          service,
          clinic_id,
          illnesses
        } = response.data;

        if (consultId && id) {
          setLocalSelectedEvent({
            serviceName: service?.name || "",
            localServiceId: service?.id || "",
            serviceId: service?.id || "",
            title: `${patient?.first_name || ""} ${patient?.last_name || ""}`,
            ms_booking_id: response.data.ms_booking_id || "",
            id: id || "",
            healthCardNumber: patient?.health_card_number || "",
            clinic_id: clinic_id || "",
            illnesses: illnesses || [],
          });
        }
        console.log(id);
        setClinicId(clinic_id || "");
        setConsultIdResp(id);
        setFormValues({
          subjective: subjective || "",
          objective: objective || "",
          assessment: assessment || "",
          plan: plan || "",
          providerNotes: providerNotes || "",
          clinic_id: clinic_id || "",
          illnesses:  illnesses || [],
        });

        previousFormValues.current = {
          subjective: subjective || "",
          objective: objective || "",
          assessment: assessment || "",
          plan: plan || "",
          providerNotes: providerNotes || "",
          clinic_id: clinic_id || "",
          illnesses:  illnesses || [],
        };
      } catch (error) {
        console.error("Error fetching consult data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultData();
  }, [consultId, localSelectedEvent?.ms_booking_id]);

  return {
    loading,
    dataExist,
    editMode,
    clinicId,
    consultIdResp,
    formValues,
    previousFormValues: previousFormValues.current,
  };
};

export default useFetchConsultData;
