let recognition: any;
import * as audioHelper from "./audioHelpers";

export const initializeRecognition = (
  setFormValues: Function,
  setRecording: Function,
  fieldForTranscription: any,
  setAudioStream: Function
) => {
  if (!('webkitSpeechRecognition' in window)) {
    console.error("Speech Recognition API not supported in this browser.");
    return null;
  }

  recognition = new (window as any).webkitSpeechRecognition();
  recognition.continuous = true; // Keep listening continuously
  recognition.interimResults = true; // Capture intermediate results
  recognition.lang = "en-US"; // Set the language for recognition

  recognition.onstart = () => {
    setRecording(true);
    audioHelper.initAudioStream(setAudioStream);
  };

  recognition.onresult = (event: any) => {
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      }
    }

    // Update form values with the final transcript
    setFormValues((prevValues: any) => {
      const existingText = prevValues[fieldForTranscription] || '';
      const trimmedText = existingText.trim();
      
      // Append the new transcript with a single space if necessary
      const updatedText = trimmedText
        ? `${trimmedText} ${finalTranscript.trim()}`.replace(/\s+/g, ' ')
        : finalTranscript.trim();
      
      return {
        ...prevValues,
        [fieldForTranscription]: updatedText,
      };
    });
    
  };

  recognition.onend = () => {
    setRecording(false);
  };

  recognition.onerror = (event: any) => {
    console.error("Speech Recognition Error: ", event.error);
    setRecording(false);
  };

  return recognition;
};

export const startRecognition = () => {
  if (recognition) {
    recognition.start();
    console.log("Speech recognition started.");
  }
};

export const stopRecognition = () => {
  if (recognition) {
    recognition.stop();
    audioHelper.stopAudioStream();
    console.log("Speech recognition stopped.");
  }
};
