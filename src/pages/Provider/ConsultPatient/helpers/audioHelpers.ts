let audioStream: MediaStream | null = null;

export const initAudioStream = async (setAudioStream: Function) => {
  audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  setAudioStream(audioStream);
  return audioStream;
};

export const stopAudioStream = () => {
  if (audioStream) {
    audioStream.getTracks().forEach((track) => track.stop()); // Stop all tracks in the stream
    audioStream = null;
  }
};
