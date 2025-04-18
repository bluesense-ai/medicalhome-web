import React, { useEffect, useState, useRef } from "react";

/**
 * Props for the MicProgressBar component
 */
interface MicProgressBarProps {
  audioStream: MediaStream | null;
  setMicInactive?: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Component to display a progress bar that visualizes microphone input levels
 */
const MicProgressBar: React.FC<MicProgressBarProps> = ({ audioStream, setMicInactive }) => {
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [isMicActive, setIsMicActive] = useState<boolean>(true);
  const micTest = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;
    let dataArray: Uint8Array | null = null;

    if (audioStream) {
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(audioStream);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      microphone.connect(analyser);

      // Update volume level based on microphone input
      const updateVolume = () => {
        analyser?.getByteFrequencyData(dataArray!);

        // Get the average volume level from the frequency data
        const sum = dataArray!.reduce((acc, value) => acc + value, 0);
        const averageVolume = sum / dataArray!.length;

        setVolumeLevel(averageVolume);

        // Check for microphone activity
        if (averageVolume < 3) {
          setIsMicActive(false); // No significant audio detected
        } else {
          setIsMicActive(true); // Audio is being detected
        }

        requestAnimationFrame(updateVolume); // Continue updating volume
      };

      updateVolume(); // Start volume updates
    }

    return () => {
      if (audioContext) {
        audioContext.close(); // Close the audio context to release resources
      }
    };
  }, [audioStream]);

  useEffect(() => {
    if (!isMicActive && setMicInactive) {
      micTest.current = setTimeout(() => {
        setMicInactive(true);
      }, 3000);
    } else if (setMicInactive) {
      if (micTest.current) {
        clearTimeout(micTest.current);
      }
      setMicInactive(false);
    }
  }, [isMicActive, setMicInactive]);

  return (
    <div className="flex flex-col items-center">
      <progress
        className="mic-progress-bar mt-2"
        value={volumeLevel * 5} // Multiply to make the visual more noticeable
        max="255"
      >
        {volumeLevel}
      </progress>

      <style>{`
        .mic-progress-bar {
          width: 180px;
          height: 15px;
          border-radius: 23px;
          background-color: #e0e0e0;
          overflow: hidden;
          appearance: none;
        }

        .mic-progress-bar::-webkit-progress-bar {
          background-color: #e0e0e0;
        }

        .mic-progress-bar::-webkit-progress-value {
          background-color: #4caf50;
        }

        .mic-progress-bar::-moz-progress-bar {
          background-color: #4caf50;
        }
      `}</style>
    </div>
  );
};

export default MicProgressBar; 