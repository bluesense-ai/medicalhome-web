import React from "react";
import { useNavigate } from "react-router-dom";
import AutoSaveProgress from "./AutoSaveProgress";
import CopyButton from "../../../../components/Common/CopyButton";
import ClinicSelector from "./ClinicSelector";
import * as helper from "../helpers/helper";
import SelectIllnesses from "./SelectIllnesses";
import { Template } from "../Template/types/template.type";
import SelectTemplate from "./SelectTemplate";

interface FormSectionProps {
  formValues: any;
  setFormValues: Function;
  handleBlur: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  startFieldRecording: Function;
  dataExist: boolean;
  editMode: boolean;
  loading: boolean;
  isSaving: boolean;
  isSaved: boolean;
  bookingDate: string;
  consultIdResp: string | null;
  clinicId: string | "";
  setClinicId: Function;
  recording: boolean;
  localSelectedEvent: any;
  saveRecord: (event: React.FormEvent) => void;
  setEditMode: Function;
  templates: Template[];
}

const FormSection: React.FC<FormSectionProps> = ({
  formValues,
  setFormValues,
  handleBlur,
  startFieldRecording,
  dataExist,
  editMode,
  loading,
  isSaving,
  isSaved,
  bookingDate,
  consultIdResp,
  clinicId,
  setClinicId,
  recording,
  localSelectedEvent,
  saveRecord,
  setEditMode,
  templates,
}) => {
  const navigate = useNavigate();

  const handleClinicChange = (newClinicId: string) => {
    setClinicId(newClinicId);
    console.log(newClinicId);
    if (dataExist) {
      setFormValues((prevValues: any) => ({
        ...prevValues,
        clinic_id: newClinicId,
      }));
    }
  };
  console.log(localSelectedEvent);
  return (
    <form className="space-y-10" onSubmit={saveRecord}>
      <div>
        <AutoSaveProgress isSaving={isSaving} isSaved={isSaved} />
        {!loading && (
          <ClinicSelector
            onClinicChange={handleClinicChange}
            existingClinicId={clinicId}
            dataExist={dataExist}
          />
        )}
        <label
          htmlFor="date_time"
          className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider"
        >
          Date and Time
        </label>
        <input
          id="date_time"
          value={helper.formatISODate(bookingDate)}
          readOnly
          placeholder="Consult's Date and Time"
          className="w-full px-4 py-3 rounded-lg border border-[#b1b1b1] mt-1 bg-gray-100 text-gray-500 text-sm font-normal font-['Roboto'] leading-tight tracking-wide justify-start items-center placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-wide cursor-not-allowed"
        />
      </div>

      <div>
        <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
          Service type
        </label>
        <input
          value={localSelectedEvent?.serviceName}
          readOnly
          placeholder="Consult's Date and Time"
          className="w-full px-4 py-3 rounded-lg border border-[#b1b1b1] mt-1 bg-gray-100 text-gray-500 text-sm font-normal font-['Roboto'] leading-tight tracking-wide justify-start items-center placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-wide cursor-not-allowed"
        />
      </div>

      <div>
        <SelectTemplate
          formValues={formValues}
          setFormValues={setFormValues}
          saveRecord={saveRecord}
          templates={templates}
          localSelectedEvent={localSelectedEvent}
        />
        <SelectIllnesses
          formValues={formValues}
          setFormValues={setFormValues}
          saveRecord={saveRecord}
        />

        <label
          htmlFor="subjective"
          className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider"
        >
          Subjective
          {!recording && (
            <i
              className="fa-solid fa-microphone float-right mr-3 text-red-700 cursor-pointer"
              onClick={() => startFieldRecording("subjective")}
            ></i>
          )}
        </label>
        <textarea
          id="subjective"
          value={formValues.subjective}
          onChange={(e) =>
            setFormValues({ ...formValues, subjective: e.target.value })
          }
          placeholder="Subjective Information"
          className="flex w-full h-20 px-4 py-3 bg-white rounded-lg border border-[#b1b1b1] text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-tight tracking-wide justify-start items-center placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-wide"
          readOnly={dataExist && !editMode}
          onBlur={handleBlur}
        ></textarea>
      </div>
      <div>
        <label
          htmlFor="objective"
          className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider"
        >
          Objective
          {!recording && (
            <i
              className="fa-solid fa-microphone float-right mr-3 text-red-700 cursor-pointer"
              onClick={() => startFieldRecording("objective")}
            ></i>
          )}
        </label>
        <textarea
          id="objective"
          value={formValues.objective}
          onChange={(e) =>
            setFormValues({ ...formValues, objective: e.target.value })
          }
          placeholder="Observable and factual Information"
          className="flex w-full h-20 px-4 py-3 bg-white rounded-lg border border-[#b1b1b1] text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-tight tracking-wide justify-start items-center placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-wide"
          readOnly={dataExist && !editMode}
          onBlur={handleBlur}
        ></textarea>
      </div>
      <div>
        <label
          htmlFor="assessment"
          className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider"
        >
          Assessment
          {!recording && (
            <i
              className="fa-solid fa-microphone float-right mr-3 text-red-700 cursor-pointer"
              onClick={() => startFieldRecording("assessment")}
            ></i>
          )}
        </label>
        <textarea
          id="assessment"
          value={formValues.assessment}
          onChange={(e) =>
            setFormValues({ ...formValues, assessment: e.target.value })
          }
          placeholder="Assessment or Diagnosis by Provider"
          className="flex w-full h-20 px-4 py-3 bg-white rounded-lg border border-[#b1b1b1] text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-tight tracking-wide justify-start items-center placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-wide"
          readOnly={dataExist && !editMode}
          onBlur={handleBlur}
        />
      </div>
      <div>
        <label
          htmlFor="plan"
          className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider"
        >
          Plan
          {!recording && (
            <i
              className="fa-solid fa-microphone float-right mr-3 text-red-700 cursor-pointer"
              onClick={() => startFieldRecording("plan")}
            ></i>
          )}
        </label>
        <textarea
          id="plan"
          value={formValues.plan}
          onChange={(e) =>
            setFormValues({ ...formValues, plan: e.target.value })
          }
          placeholder="Plan made by Provider"
          className="flex w-full h-20 px-4 py-3 bg-white rounded-lg border border-[#b1b1b1] text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-tight tracking-wide justify-start items-center placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-wide"
          readOnly={dataExist && !editMode}
          onBlur={handleBlur}
        />
      </div>
      <div>
        <label
          htmlFor="providerNotes"
          className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider"
        >
          Notes
          {!recording && (
            <i
              className="fa-solid fa-microphone float-right mr-3 text-red-700 cursor-pointer"
              onClick={() => startFieldRecording("providerNotes")}
            ></i>
          )}
        </label>
        <textarea
          id="providerNotes"
          value={formValues.providerNotes}
          onChange={(e) =>
            setFormValues({
              ...formValues,
              providerNotes: e.target.value,
            })
          }
          placeholder="Provider Notes"
          className="flex w-full h-20 px-4 py-3 bg-white rounded-lg border border-[#b1b1b1] text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-tight tracking-wide justify-start items-center placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-wide"
          readOnly={dataExist && !editMode}
          onBlur={handleBlur}
        />
      </div>
      {dataExist && (
        <div>
          <label
            htmlFor="link"
            className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider"
          >
            Link
            <CopyButton
              data={
                import.meta.env.VITE_APP_URL + "/consult?id=" + consultIdResp
              }
            />
          </label>
          <input
            id="link"
            value={
              import.meta.env.VITE_APP_URL + "/consult?id=" + consultIdResp
            }
            readOnly
            placeholder="Consult's Date and Time"
            className="w-full px-4 py-3 rounded-lg border border-[#b1b1b1] mt-1 bg-gray-100 text-gray-500 text-sm font-normal font-['Roboto'] leading-tight tracking-wide justify-start items-center placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-wide cursor-not-allowed"
          />
        </div>
      )}
      <div className="flex mt-6 justify-center">
        {dataExist && (
          <button
            type="button"
            className={`bg-none py-2 px-4 rounded text-[#016c9d] text-sm font-semibold font-['Roboto'] leading-[14px] ${
              editMode ? "hidden" : ""
            }`}
            onClick={() => setEditMode(true)}
          >
            Edit Data
          </button>
        )}
        <button
          type="button"
          className="text-[#016c9d] text-sm font-semibold font-['Roboto'] leading-[14px] mr-5 flex space-x-3 justify-center items-center"
          onClick={() => {
            console.log("This is the booking date", bookingDate);
            navigate("/provider-dashboard", {
              state: {
                bookingDate,
              },
            });
          }}
        >
          <img src="/Icons/arrow_back.svg" alt="" />
          <p>Back</p>
        </button>
        <button
          type="button"
          className={`h-[38px] bg-[#016c9d] rounded-lg border border-[#016c9d] text-[#f2f8ff] text-sm font-semibold font-['Roboto'] leading-[14px] py-2 px-4 mr-2`}
          onClick={() => {
            navigate("/provider-dashboard", {
              state: {
                bookFollowUp: localSelectedEvent,
              },
            });
          }}
        >
          Book Followup
        </button>
      </div>
    </form>
  );
};

export default FormSection;
