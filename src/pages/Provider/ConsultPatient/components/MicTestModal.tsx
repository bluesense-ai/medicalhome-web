import React, { useEffect, useState } from "react";
import MicProgressBar from "./MicProgressBar";

interface MicTestModalProps {
  show: boolean;
  onClose: () => void;
}

const MicTestModal: React.FC<MicTestModalProps> = ({ show, onClose }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayBackCompleted, setIsPlayBackCompleted] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let recorder: MediaRecorder | null = null;
    let audioChunks: Blob[] = [];

    if (show) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        setAudioStream(stream);
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        recorder.start();
        setIsRecording(true);

        setTimeout(() => {
          if (recorder && recorder.state === "recording") {
            recorder.stop();
          }
        }, 4000);

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const audioURL = URL.createObjectURL(audioBlob);
          setIsRecording(false);
          playRecording(audioURL); // Play the recorded audio
          audioChunks = [];
          if (recorder && recorder.stream) {
            recorder.stream.getTracks().forEach((track) => track.stop());
          }
        };
      });
    }

    return () => {
      if (recorder && recorder.state !== "inactive") {
        recorder.stop(); // Stop the recorder if modal closes early
      }
    };
  }, [show]);

  const playRecording = async (audioURL: any) => {
    const audio = new Audio(audioURL);
    audio.play();
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
      setIsPlayBackCompleted(true);
    };
  };
  const handleClose = () => {
    // Reset the playback state when modal is closed
    setIsPlayBackCompleted(false);
    onClose();
  };

  if (!show) return null; // Do not render if modal is not shown

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
      <div
        className="p-6 rounded text-center bg-primary text-white"
        style={{ width: "300px" }}
      >
        <h3 className="text-xl mb-4">Microphone Test</h3>
        <i className="fa-solid fa-microphone text-5xl text-red-500 "></i>
        {isRecording ? (
          <>
            <p className="mt-5 mb-3">Recording...</p>
            {/* Pass the audioStream to the MicProgressBar */}
            <MicProgressBar audioStream={audioStream} />
          </>
        ) : (
          <div className="mt-5">
            {isPlaying ? (
              <p>Playing Audio...</p>
            ) : isPlayBackCompleted ? (
              <p>Playback Complete</p>
            ) : (
              <p>
                <i className="fa-solid fa-spinner fa-spin"></i>
              </p>
            )}
          </div>
        )}
        <button
          className="mt-6 bg-primary text-white py-2 px-4 rounded"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MicTestModal;
