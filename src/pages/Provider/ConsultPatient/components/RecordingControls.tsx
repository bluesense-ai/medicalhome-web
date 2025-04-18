import React, { useRef,useState,useEffect } from "react";
import MicProgressBar from "./MicProgressBar";

interface RecordingControlsProps {
  recording: boolean;
  startListening: () => void;
  stopListening: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  audioStream: MediaStream | null;
  setMicInactive: React.Dispatch<React.SetStateAction<boolean>>;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  recording,
  startListening,
  stopListening,
  handleFileChange,
  audioStream,
  setMicInactive,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [recordBtnClicked, setRecordBtnClicked] = useState(false);
  const startRecording = () => {
    setRecordBtnClicked(true);
    startListening();
  }
  useEffect(() => {
    if (recording) {
      setRecordBtnClicked(false);
    }
  }, [recording]);
  return (
    <div className="flex float-left items-center justify-center text-center mb-4 w-[93%]">
    {!recording ? (
      <>
        <button
          onClick={startRecording}
          disabled={recordBtnClicked}
          className="h-10 p-3 bg-[#cc2b29] rounded-lg border border-[#a30e0e] justify-center items-center gap-2 inline-flex py-1 px-4
          text-[#fff6f2] text-sm font-semibold font-['Roboto'] leading-[14px]
          disabled:opacity-50  disabled:cursor-not-allowed ">
          
           {recordBtnClicked ? (
            <i className="fa-solid fa-spinner fa-spin"></i> 
           ):(
            <img src="/Icons/MicrophoneIcon.svg" />
           )} 
          <p className="text-[#fff6f2] text-sm font-semibold font-['Roboto'] leading-[14px]">
            Start Recording
          </p>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <span
          className="ml-5"
          onClick={() => {
            fileInputRef.current && fileInputRef.current.click();
          }}
        >
          <i className="fa-solid fa-arrow-up-from-bracket cursor-pointer text-[#004f62]"></i>
        </span>
      </>
    ) : (
      <div>
        <MicProgressBar
          audioStream={audioStream}
          setMicInactive={setMicInactive}
        />
        <button
          onClick={stopListening}
          className="h-10 mt-2 p-3 bg-[#cc2b29] rounded-lg border border-[#a30e0e] justify-center items-center gap-2 inline-flex py-1 px-4"
        >
          <img src="/Icons/MicrophoneIcon.svg" />
          <p className="text-[#fff6f2] text-sm font-semibold font-['Roboto'] leading-[14px]">
            Stop Recording
          </p>
        </button>
      </div>
    )}
  </div>
  );
};

export default RecordingControls;
