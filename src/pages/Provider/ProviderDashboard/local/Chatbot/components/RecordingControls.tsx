import React, { useRef, useState, useEffect } from "react";
import { FiMic, FiUpload } from "react-icons/fi";
import MicProgressBar from "./MicProgressBar";

/**
 * Props for the RecordingControls component
 */
interface RecordingControlsProps {
  recording: boolean;
  startListening: () => void;
  stopListening: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  audioStream: MediaStream | null;
  setMicInactive: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

/**
 * Component to control audio recording with start/stop buttons and file upload
 */
const RecordingControls: React.FC<RecordingControlsProps> = ({
  recording,
  startListening,
  stopListening,
  handleFileChange,
  audioStream,
  setMicInactive,
  isLoading
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [recordBtnClicked, setRecordBtnClicked] = useState(false);
  
  const startRecording = () => {
    setRecordBtnClicked(true);
    startListening();
  };
  
  useEffect(() => {
    if (recording) {
      setRecordBtnClicked(false);
    }
  }, [recording]);
  
  return (
    <div className="flex">
      {!recording ? (
        <>
          <button 
            className="action-button speak-button bg-[#45B54C] text-white p-2 rounded-[8px] flex items-center mx-1"
            onClick={startRecording}
            disabled={isLoading || recordBtnClicked}
          >
            {recordBtnClicked ? (
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
            ) : (
              <FiMic className="mr-2" />
            )}
            <span className="text-xs font-['Roboto']">Speak</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="audio/*"
          />
          <button 
            className="action-button upload-button bg-[#45B54C] text-white p-2 rounded-[8px] flex items-center mx-1"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <FiUpload className="mr-2" />
            <span className="text-xs font-['Roboto']">Upload</span>
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <MicProgressBar
            audioStream={audioStream}
            setMicInactive={setMicInactive}
          />
          <button
            onClick={stopListening}
            className="action-button bg-[#cc2b29] text-white p-2 rounded-[8px] flex items-center mx-1 mt-2"
            disabled={isLoading}
          >
            <FiMic className="mr-2" />
            <span className="text-xs font-['Roboto']">Stop</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RecordingControls; 