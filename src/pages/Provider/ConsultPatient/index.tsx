import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProgressModal from "./components/ProgresModal";
import Loader from "../../../components/Loader";
import { useSelector } from "react-redux";
import MicTestModal from "./components/MicTestModal";
import axiosInstance from "../../../axios/axiosInstance";
import ProviderNavbar from "../../../components/ProviderNavbar";
import { getMSClient } from "../../../api/external/microsoft";
import * as utils from "../../../common/utils/utils";
import SettingsDropdown from "./components/SettingsDropdown";
import MessageContainer from "./components/MessageContainer";
import * as sr from "./helpers/speechRecognition";
import * as transHandler from "./helpers/transcriptionHandlers";
import useFetchConsultData from "./Hooks/useFetchConsultData";
import * as storeRecordHandler from "./helpers/storeRecordHandler";
import useHandleBeforeUnload from "./Hooks/useHandleBeforeUnload";
import { validateEvent } from "./helpers/componentFunctions";
import FormSection from "./components/FormSection";
import RecordingControls from "./components/RecordingControls";
import Tasks from "./Tasks/Tasks";
import TemplateList from "./Template/TemplateList";
import { Template } from "./Template/types/template.type";

//import Tasks from "./Tasks/TasksTest";

const ConsultPatient: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const consultId = queryParams.get("id");
  const selectedEvent = location.state?.selectedEvent;
  const [localSelectedEvent, setLocalSelectedEvent] = useState(
    selectedEvent || {}
  );
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [templates, setTemplates] = useState<Template[]>([]);
  const [, setTranscription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isTranscriptionDone, setIsTranscriptionDone] = useState(false);
  const [isSoapNotesGenerated, setIsSoapNotesGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataExist, setDataExist] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [businessId, setBusinessId] = useState("");
  const [msClient, setMsClient] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState<string>("");
  const [formValues, setFormValues] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    providerNotes: "",
    clinic_id: "",
    illnesses: [],
  });

  const [showMicTestModal, setShowMicTestModal] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clinicId, setClinicId] = useState("");
  const [consultRaw, setConsultRaw] = useState("");
  const [consultIdResp, setConsultIdResp] = useState<string | null>(null);
  const [fieldForTranscription, setFieldForTranscription] = useState("");
  const [micInactive, setMicInactive] = useState(false);
  const [transcriptionTrigger, setTranscriptionTrigger] =
    useState<boolean>(false);

  const previousFormValues = useRef(formValues);

  let newRecord = useRef(false);
  const provider = useSelector(
    (state: {
      provider: {
        username: string;
        methodOfVerification: string;
        providerID: string;
        ms_calendar_id: string;
      };
    }) => state.provider
  );
  //const saveButtonClass = (dataExist && editMode) || !dataExist ? "" : "hidden";

  useEffect(() => {
    const { subjective, objective, assessment, plan } = formValues;
    setConsultRaw(
      `Name:${localSelectedEvent?.title}\nHealthCardNumber:${localSelectedEvent?.healthCardNumber}\nSubjective:\n${subjective}\nObjective:\n${objective}\nAssessment:\n${assessment}\nPlan:\n${plan}`
    );
  }, [formValues]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BACKEND_URL}/templates`
        );
        console.log(response.data);
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (dataExist && clinicId === formValues.clinic_id) {
      saveRecord();
    }
  }, [formValues.clinic_id, dataExist]);

  useEffect(() => {
    setMsClient(getMSClient());
  }, []);

  useEffect(() => {
    if (!provider.ms_calendar_id) {
      toast.error("Calendar ID not found", { autoClose: 3000 });
    } else {
      setBusinessId(provider.ms_calendar_id);
    }
  }, []);

  useEffect(() => {
    const fetchSelectedConsultInfo = async () => {
      if (!msClient || consultId) {
        return;
      }
      let url: any = `/solutions/bookingBusinesses/${businessId}/appointments/${localSelectedEvent.ms_booking_id}`;
      const response = await msClient.api(url).get();
      setBookingDate(response.startDateTime.dateTime);
    };

    fetchSelectedConsultInfo();
  }, [msClient]);

  // Use current URL or nextLink for request
  useEffect(() => {
    validateEvent(localSelectedEvent, consultId, navigate);
  }, [localSelectedEvent, consultId]);

  const {
    loading: hookLoading,
    dataExist: hookDataExist,
    editMode: hookEditMode,
    clinicId: hookClinicId,
    consultIdResp: hookConsultIdResp,
    formValues: hookFormValues,
    previousFormValues: hookPreviousFormValues,
  } = useFetchConsultData(consultId, localSelectedEvent, setLocalSelectedEvent);

  useEffect(() => {
    setLoading(hookLoading);
    setDataExist(hookDataExist);
    setEditMode(hookEditMode);
    setClinicId(hookClinicId);
    setConsultIdResp(hookConsultIdResp);
    setFormValues(hookFormValues);
    previousFormValues.current = hookPreviousFormValues;
  }, [
    hookLoading,
    hookDataExist,
    hookEditMode,
    hookClinicId,
    hookConsultIdResp,
    hookFormValues,
  ]);

  const startListening = async () => {
    setIsFileUploaded(false);
    setIsTranscriptionDone(false);
    setIsSoapNotesGenerated(false);

    const audioBlob = await transHandler.startListening(
      setAudioStream,
      setRecording,
      setMediaRecorder,
      fieldForTranscription
    );
    if (!audioBlob) return;
    setShowModal(true);
    const response = await transHandler.uploadFile(
      audioBlob,
      localSelectedEvent,
      provider,
      setIsFileUploaded
    );
    handleFileUploaded(response);
  };

  const stopListening = () => {
    if (mediaRecorder) {
      transHandler.stopListening(mediaRecorder);
    } else {
      sr.stopRecognition();
    }
  };

  const startFieldRecording = (fieldName: string) => {
    setFieldForTranscription(fieldName);
    setTranscriptionTrigger((transcriptionTrigger) => !transcriptionTrigger);
  };

  useEffect(() => {
    //using use effects instead of directly putting this code inside startFieldRecording()
    // as react does not update state instantly and fieldForTranscription is not updated immediately

    if (fieldForTranscription) {
      const initialized = sr.initializeRecognition(
        setFormValues,
        setRecording,
        fieldForTranscription,
        setAudioStream
      );
      if (
        initialized &&
        (utils.detectBrowser() == "Chrome" || utils.detectBrowser() == "Edge")
      ) {
        console.log(fieldForTranscription, "Starting listening...");
        sr.startRecognition();
        return () => sr.stopRecognition();
      } else {
        console.log("Starting listening...");
        startListening(); //field transcription from AI as browser is not supported
      }
    }
  }, [fieldForTranscription, transcriptionTrigger]);

  const updateFormValues = (data: any) => {
    const providerNotes = formValues.providerNotes || "";

    if (fieldForTranscription) {
      setFormValues((prevValues: any) => ({
        ...prevValues,
        [fieldForTranscription]:
          (prevValues[fieldForTranscription] || "") + " " + data.transcription,
      }));
      setShowModal(false);
      setFieldForTranscription("");
    } else if (!dataExist) {
      generateSoapNotes(data.transcription, data.consult.id);
    } else {
      setFormValues({
        ...formValues,
        providerNotes: providerNotes + " " + data.transcription,
      });
      setShowModal(false);
    }
    setIsTranscriptionDone(true);
    newRecord.current = true;
  };

  const handleFileUploaded = (response: any) => {
    if (response.status === 200) {
      setTranscription(response.data.transcription);
      updateFormValues(response.data);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setShowModal(true);
    const validity = utils.validateFile(file);

    if (validity.valid) {
      const response = await transHandler.uploadFile(
        file,
        localSelectedEvent,
        provider,
        setIsFileUploaded
      );
      handleFileUploaded(response);
    } else {
      toast.error(validity.message, {
        autoClose: 4000,
      });
      setShowModal(false);
    }
  };

  const generateSoapNotes = async (
    transcription: string,
    consult_id: string
  ) => {
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/consults/soap-notes`,
        { transcription, consult_id }
      );

      if (response.status === 200) {
        parseSoapNotes(response.data.soapNotes, consult_id);
        setIsSoapNotesGenerated(true);
      } else {
        toast.error("Failed to generate SOAP notes", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error generating SOAP notes:", error);
      toast.error("Error generating SOAP notes", {
        autoClose: 3000,
      });
    } finally {
      setShowModal(false);
    }
  };
  const parseSoapNotes = (soapNotes: string, consult_id: any) => {
    console.log(soapNotes);
    const parsedSoapNotes = JSON.parse(soapNotes);
    console.log(parsedSoapNotes);
    const illness = parsedSoapNotes.illness || "";
    if (illness) {
      parsedSoapNotes.illnesses = [
        {
          value: illness,
          label: illness,
          isNew: true,
          isProgrammaticChange: true,
        },
      ];
    }
    console.log(parsedSoapNotes);

    setFormValues({
      ...parsedSoapNotes,
      id: consult_id,
    });
  };
  const handleBlur = async () => {
    if (
      JSON.stringify(formValues) !== JSON.stringify(previousFormValues.current)
    ) {
      saveRecord();
      previousFormValues.current = { ...formValues };
    }
  };
  useEffect(() => {
    setIsSaved(false);
    if (formValues && newRecord.current) {
      saveRecord();
      newRecord.current = false;
    }
  }, [formValues]);

  const saveRecord = async () => {
    storeRecordHandler.saveRecord({
      formValues,
      previousFormValues,
      localSelectedEvent,
      provider,
      clinicId,
      setConsultIdResp,
      setDataExist,
      setIsSaved,
      setIsSaving,
    });
  };

  useHandleBeforeUnload(formValues, previousFormValues, saveRecord);

  return (
    <>
      {provider.providerID && (
        <ProviderNavbar
          isSidebarOpened={isSidebarOpen}
          setIsSidebarOpened={setIsSidebarOpen}
        />
      )}

      <div
        className={`flex flex-col mt-24 items-center p-4 ${
          isSidebarOpen ? "blur-sm ml-[25%]" : "ml-0"
        }`}
      >
        <div className="flex mb-3 w-full h-auto py-[18.50px] bg-[#004f62] rounded-lg justify-center items-center">
          <h2 className="text-[#f2f8ff] w-full text-center text-2xl font-bold font-['Roboto'] leading-7">
            {localSelectedEvent?.title} Visit
          </h2>
        </div>
        {recording && dataExist && !fieldForTranscription && (
          <MessageContainer
            message={
              "Transcription of new recording will append to the notes section of the SOAP notes"
            }
          />
        )}
        {micInactive && recording && (
          <MessageContainer
            message={
              "No audio input detected: Check \nmicrophone before proceeding with recording."
            }
            borderColor="border-[#a30e0e]"
            bgColor="bg-[#fff6f2]"
            textColor="text-[#a30e0e]"
          />
        )}
        <div className="w-full flex justify-center flex-wrap lg:flex-nowrap gap-4">
          <div
            className={`${
              dataExist ? "lg:w-1/2" : "w-1/2"
            } mt-3 h-auto bg-[#f2f8ff] px-[53px] py-[50px] rounded-[10px] border-2 border-[#016c9d] shadow-md p-6`}
          >
            <RecordingControls
              recording={recording}
              startListening={startListening}
              stopListening={stopListening}
              handleFileChange={handleFileChange}
              audioStream={audioStream}
              setMicInactive={setMicInactive}
            />
            <SettingsDropdown
              setShowMicTestModal={setShowMicTestModal}
              consultRaw={consultRaw}
            />
            <FormSection
              formValues={formValues}
              setFormValues={setFormValues}
              handleBlur={handleBlur}
              startFieldRecording={startFieldRecording}
              dataExist={dataExist}
              editMode={editMode}
              loading={loading}
              isSaving={isSaving}
              isSaved={isSaved}
              bookingDate={bookingDate}
              consultIdResp={consultIdResp}
              clinicId={clinicId}
              setClinicId={setClinicId}
              recording={recording}
              localSelectedEvent={localSelectedEvent}
              saveRecord={saveRecord}
              setEditMode={setEditMode}
              templates={templates}
              
            />
          </div>

          <div className="lg:w-1/2 mt-3">
            {dataExist && (
              <div className="  max-h-max bg-[#fff]  rounded-[10px] border-2 border-[#016c9d] shadow-md">
                <Tasks consultId={consultIdResp} />
              </div>
            )}
            <div className="mt-3  max-h-max bg-[#fff]  rounded-[10px] border-2 border-[#016c9d] shadow-md">
              <TemplateList templates={templates} setTemplates={setTemplates} />
            </div>
          </div>

          {loading && <Loader />}
          <MicTestModal
            show={showMicTestModal}
            onClose={() => setShowMicTestModal(false)}
          />
          <ProgressModal
            show={showModal}
            isFileUploaded={isFileUploaded}
            isTranscriptionDone={isTranscriptionDone}
            isSoapNotesGenerated={isSoapNotesGenerated}
            dataExist={dataExist}
            fieldForTranscription={fieldForTranscription}
          />
        </div>
      </div>
    </>
  );
};

export default ConsultPatient;
