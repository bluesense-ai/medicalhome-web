import { toast } from "react-toastify";
import * as audioHelper from "./audioHelpers";
import axiosInstance from "../../../../../../axios/axiosInstance";

/**
 * Start audio recording for transcription
 * @param setAudioStream Function to set audio stream state
 * @param setRecording Function to set recording state
 * @param setMediaRecorder Function to set media recorder state
 * @returns Promise with audio blob or false if error
 */
export const startListening = async (
  setAudioStream: React.Dispatch<React.SetStateAction<MediaStream | null>>,
  setRecording: React.Dispatch<React.SetStateAction<boolean>>,
  setMediaRecorder: React.Dispatch<React.SetStateAction<MediaRecorder | null>>,
) => {
  try {
    console.log("[Handler] Starting listening...");
    const stream = await audioHelper.initAudioStream(setAudioStream);
    const recorder = new MediaRecorder(stream);
    let chunks: Blob[] = [];
    const localStartTime = Date.now();

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      } else {
        console.log("[Handler] No audio data received in ondataavailable.");
      }
    };
    
    setMediaRecorder(recorder);
    recorder.start();
    setRecording(true);
    console.log("[Handler] Recording started");

    const audioBlobPromise = new Promise<Blob>((resolve, reject) => {
      recorder.onstop = () => {
        console.log("[Handler] onstop event fired.");
        const duration = (Date.now() - localStartTime) / 1000;
        console.log(`[Handler] Recording duration: ${duration.toFixed(2)} seconds.`);
        setRecording(false);
        
        if (chunks.length > 0) {
          const audioBlob = new Blob(chunks, { type: "audio/webm" });
          audioHelper.stopAudioStream();
          setMediaRecorder(null);
          resolve(audioBlob); 
        } else {
          audioHelper.stopAudioStream();
          setMediaRecorder(null);
          toast.error("No audio data recorded. Please check microphone permissions.");
          reject(new Error("No audio data recorded"));
        }
      };
    });

    return await audioBlobPromise; 
  } catch (error) {
    console.error("[Handler] Error accessing microphone:", error);
    toast.error("Cannot access microphone. Please check permissions.");
    throw error;
  }
};

/**
 * Stop the current recording
 * @param mediaRecorder The current MediaRecorder instance
 */
export const stopListening = (mediaRecorder: MediaRecorder | null) => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    console.log("[Handler] stopListening called. Stopping recorder.");
    mediaRecorder.stop();
  } else {
    console.warn(`[Handler] stopListening called but recorder state is not 'recording'. State: ${mediaRecorder?.state || 'null'}`);
  }
};

/**
 * Upload the recorded audio file for transcription
 * @param audioBlob The recorded audio blob
 * @param setIsLoading Function to set loading state
 * @returns The transcription response
 */
export const uploadAudioForTranscription = async (
  audioBlob: Blob, 
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_BACKEND_URL}/chatbot/transcribe-audio`,
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
            console.log(`Upload progress: ${percentCompleted}%`);
          } else {
            console.warn("Total size is undefined in progress event");
          }
        },
      }
    );
    
    console.log("Transcription response:", response.data);
    return response.data.transcription;
  } catch (error: any) {
    console.error("Error transcribing audio:", error);
    if (error.response?.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Error transcribing audio. Please try again.");
    }
    throw error;
  } finally {
    setIsLoading(false);
  }
}; 