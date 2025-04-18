let audioStream: MediaStream | null = null;

/**
 * Initialize audio stream for recording
 * @param setAudioStream Function to set the audio stream state
 * @returns The initialized audio stream
 */
export const initAudioStream = async (setAudioStream: Function) => {
  audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  setAudioStream(audioStream);
  return audioStream;
};

/**
 * Stop the audio stream and release resources
 */
export const stopAudioStream = () => {
  if (audioStream) {
    audioStream.getTracks().forEach((track) => track.stop()); // Stop all tracks in the stream
    audioStream = null;
  }
}; 