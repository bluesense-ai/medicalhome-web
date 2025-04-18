import { toast } from "react-toastify";
import axiosInstance from "../../../../axios/axiosInstance";
import * as audioHelper from "./audioHelpers";
import * as helper from "./helper";

export const startListening = async (
  setAudioStream: React.Dispatch<React.SetStateAction<MediaStream | null>>,
  setRecording: React.Dispatch<React.SetStateAction<boolean>>,
  setMediaRecorder: React.Dispatch<React.SetStateAction<MediaRecorder | null>>,
  fieldForTranscription: string,
) => {
  try {
    console.log("Starting listening...", fieldForTranscription);
    const stream = await audioHelper.initAudioStream(setAudioStream);
    const recorder = new MediaRecorder(stream);
    let chunks: Blob[] = [];
    const localStartTime = Date.now();

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      } else {
        console.error("No audio data received.");
      }
    };
    setMediaRecorder(recorder);
    recorder.start();
    setRecording(true);
    console.log("Recording started");

    const audioBlobPromise = new Promise<Blob>((resolve, reject) => {
      recorder.onstop = () => {
        console.log("stoping the recording");
        const duration = (Date.now() - localStartTime) / 1000;
        setRecording(false);
        if (duration > 5) {
          const audioBlob = new Blob(chunks, { type: "audio/wav" });
          audioHelper.stopAudioStream();
          setMediaRecorder(null);
          resolve(audioBlob); 
        } else {
          audioHelper.stopAudioStream();
          setMediaRecorder(null);
          toast.error("Recording must be longer than 5 seconds.");
          reject(new Error("Recording too short")); // Rejecting if the duration is less than 5 seconds
        }
      };
    });

    return await audioBlobPromise; 
  } catch (error) {
    console.error("Error accessing microphone:", error);
    return false;
  }
};

export const stopListening = (mediaRecorder: MediaRecorder | null) => {
  if (mediaRecorder) {
    mediaRecorder.stop();
    console.log("Recording stopped");
  }
};

export const uploadFile = async (
  audioBlob: any, 
  localSelectedEvent: any,
  provider:any,
  setIsFileUploaded: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    formData.append(
      "health_card_number",
      localSelectedEvent.healthCardNumber
    );
    formData.append("id", localSelectedEvent.id);
    formData.append("ms_booking_id", localSelectedEvent.ms_booking_id);
    formData.append("phone_number", localSelectedEvent.customerPhone);
    formData.append("email_address", localSelectedEvent.customerEmailAddress);
    const { first_name, last_name } = helper.getFirstAndLastName(
      localSelectedEvent.title
    );
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("provider_id", provider.providerID);
    formData.append("service_id", localSelectedEvent?.localServiceId);

    

    const response = await axiosInstance.post(
      `${import.meta.env.VITE_BACKEND_URL}/consults/speech-to-text`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent:any) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            if (percentCompleted === 100) {
              setIsFileUploaded(true);
            }
          } else {
            console.warn("Total size is undefined in progress event");
          }
        },
      }
    );
    console.log("returning response");
    return response;

    
  } catch (error: any) {
    if (error.response?.data.type == "external") {
      toast.error(error.response.data.message, {
        autoClose: 3000,
      });
    } else {
      console.error("Error uploading audio file:", error);
      toast.error("Error uploading audio file", {
        autoClose: 3000,
      });
    }
  }
};