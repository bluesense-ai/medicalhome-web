import { toast } from "react-toastify";
import * as helper from "./helper";
import axiosInstance from "../../../../axios/axiosInstance";

interface SaveRecordParams {
    formValues: any;
    previousFormValues: any;
    localSelectedEvent: any;
    provider: any;
    clinicId: any;
    setConsultIdResp: Function;
    setDataExist: Function;
    setIsSaved: Function;
    setIsSaving: Function;
  }
export const saveRecord = async ({
    formValues,
    previousFormValues,
    localSelectedEvent,
    provider,
    clinicId,
    setConsultIdResp,
    setDataExist,
    setIsSaved,
    setIsSaving,
  }: SaveRecordParams): Promise<void> =>  {
    if (
        JSON.stringify(formValues) === JSON.stringify(previousFormValues.current)
      ) {
        console.log("No changes made");
        return;
      }
      setIsSaving(true);
      const { first_name, last_name } = helper.getFirstAndLastName(
        localSelectedEvent.title
      );
      if (!localSelectedEvent?.localServiceId) {
        toast.error("Service not selected", { autoClose: 3000 });
        return ;
      }
      console.log("saving data");
      const data = {
        ms_booking_id: localSelectedEvent?.ms_booking_id,
        id: localSelectedEvent?.id,
        subjective: formValues.subjective,
        objective: formValues.objective,
        assessment: formValues.assessment,
        plan: formValues.plan,
        providerNotes: formValues.providerNotes,
        provider_id: provider?.providerID,
        health_card_number: localSelectedEvent?.healthCardNumber,
        email_address: localSelectedEvent?.customerEmailAddress,
        service_id: localSelectedEvent.localServiceId,
        first_name,
        last_name,
        clinic_id: clinicId,
        illnesses: formValues.illnesses,
      };
      try {
        const response = await axiosInstance.post(
          `${import.meta.env.VITE_BACKEND_URL}/consults`,
          {
            ...data,
          }
        );
  
        if (response.status === 200) {
        
  
          previousFormValues.current = { ...formValues };
          setConsultIdResp(response.data.consult.id);

  
          setDataExist(true);
          setIsSaved(true);
        } else {
          toast.error("Failed to save record", { autoClose: 3000 });
        }
      } catch (error) {
        console.error("Error saving record:", error);
        toast.error("Error saving record", { autoClose: 3000 });
      } finally {
        setIsSaving(false);
      }
  };