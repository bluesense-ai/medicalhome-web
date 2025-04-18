import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiBell, FiCalendar, FiUpload, FiMic, FiMaximize2, FiMoreVertical, FiEdit, FiMessageSquare, FiClock, FiTag, FiHome, FiFileText, FiClipboard, FiUsers, FiCheckSquare, FiArchive, FiSettings, FiChevronLeft } from 'react-icons/fi';
import '../ChatPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { queryChatbot } from '../../common/Services/chatbotService';
import ProviderNavbar from '../../../../../../components/ProviderNavbar';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../../../../axios/axiosInstance";

// Component imports
import SidebarMenu from './SidebarMenu';
import ChatInterface from './ChatInterface';
import TodayPanel from './TodayPanel';

// Helpers import
import * as transcriptionHandlers from '../helpers/transcriptionHandlers';
import * as audioHelper from '../helpers/audioHelpers';

// Message interface
interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

// Conversation Pair interface
interface ConversationPair {
  id: string;
  userMessage: Message;
  botMessage: Message | null;
}

// Tag component
interface TagProps {
  id: number;
  color: string;
}

const Tag: React.FC<TagProps> = ({ id, color }) => {
  return (
    <div className="conversation-tag" style={{ backgroundColor: color }}>
      <FiTag size={10} /> Tag #{id}
    </div>
  );
};

// API communication function
const sendMessageToApi = async (message: string) => {
  try {
    console.log("Sending message to Hugging Face API");
    const response = await queryChatbot(message);
    return { 
      response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    console.error('Chatbot API error:', error);
    throw error;
  }
};

// Main Chat Page Component
const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [activeMenu, setActiveMenu] = useState('home');
  
  // Audio recording states
  const [recording, setRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [micInactive, setMicInactive] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isTranscriptionDone, setIsTranscriptionDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Add state to store available services
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [defaultServiceId, setDefaultServiceId] = useState<string>("");

  // Provider data from Redux store
  const provider = useSelector(
    (state: {
      provider: {
        username: string;
        picture: string;
        providerID?: string;
      };
    }) => state.provider
  );

  // Initialize state with potential data from navigation
  const initialQuery = location.state?.initialQuery as string | null;
  const initialResponse = location.state?.initialResponse as string | null;

  const [conversationPairs, setConversationPairs] = useState<ConversationPair[]>(() => {
     // Initialize with passed state if available
     if (initialQuery && initialResponse) {
         const initialUserMessage: Message = {
             id: 'user-init',
             content: initialQuery,
             isUser: true,
             timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
         };
         const initialBotMessage: Message = {
             id: 'bot-init',
             content: initialResponse,
             isUser: false,
             timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
         };
         return [{ id: 'init', userMessage: initialUserMessage, botMessage: initialBotMessage }];
     }
     return []; // Start empty if no initial data
  });
  
  // Set initial result display if only response was passed
  const [latestResult, setLatestResult] = useState<Message | null>(() => {
      if (!initialQuery && initialResponse) { // Should not happen often with current logic
          return {
              id: 'bot-init',
              content: initialResponse,
              isUser: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
      } else if (initialQuery && initialResponse) {
          return {
             id: 'bot-init',
             content: initialResponse,
             isUser: false,
             timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
         };
      }
      return null;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [nextId, setNextId] = useState(1); 

  // Fetch available services when component mounts
  useEffect(() => {
    const fetchServices = async () => {
      if (provider.providerID) {
        try {
          console.log("[ChatPage] Fetching services for provider:", provider.providerID);
          const response = await axiosInstance.get(
            `${import.meta.env.VITE_BACKEND_URL}/providers/${provider.providerID}/services`
          );
          
          console.log("[ChatPage] Available services:", response.data);
          setAvailableServices(response.data);
          
          // Set default service ID (first service)
          if (response.data && response.data.length > 0) {
            setDefaultServiceId(response.data[0].id);
            console.log("[ChatPage] Using default service ID:", response.data[0].id);
          }
        } catch (error) {
          console.error("[ChatPage] Error fetching services:", error);
        }
      }
    };
    
    fetchServices();
  }, [provider.providerID]);

  // Cleanup audio resources when component unmounts
  useEffect(() => {
    return () => {
      audioHelper.stopAudioStream();
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  // Send message if only initialQuery was passed via navigation
  useEffect(() => {
    if (initialQuery && !initialResponse) {
      console.log("ChatPage: Received initial query from navigation, sending to API:", initialQuery);
      handleSendMessage(initialQuery);
    }
    // Clear location state after processing to avoid re-triggering
    window.history.replaceState({}, document.title);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, initialResponse]); // Run only when these specific state values change initially

  // Function to handle sending a message to the API
  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;
    
    setIsLoading(true);
    setLatestResult(null);
    setInput('');
    
    const currentId = nextId.toString();
    setNextId(prev => prev + 1);

    const userMessage: Message = {
      id: `user-${currentId}`,
      content: messageContent,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user message first, even if it's the initial one
    const newPair: ConversationPair = {
        id: currentId, 
        userMessage: userMessage, 
        botMessage: null 
    };
    setConversationPairs(prevPairs => [newPair, ...prevPairs.filter(p => p.id !== 'init')]); // Add new, remove potential init placeholder

    try {
      const response = await sendMessageToApi(messageContent);
      
      const botMessage: Message = {
        id: `bot-${currentId}`,
        content: response.response,
        isUser: false,
        timestamp: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setConversationPairs(prevPairs => 
        prevPairs.map(pair => 
          pair.id === currentId ? { ...pair, botMessage: botMessage } : pair
        )
      );
      setLatestResult(botMessage);

    } catch (error) {
       const errorMessage: Message = {
        id: `error-${currentId}`,
        content: "Sorry, an error occurred. Please try again.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
       setConversationPairs(prevPairs => 
        prevPairs.map(pair => 
          pair.id === currentId ? { ...pair, botMessage: errorMessage } : pair
        )
      );
       setLatestResult(errorMessage); 
    } finally {
      setIsLoading(false);
    }
  };

  // Input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  // Voice recording handlers
  const startListening = async () => {
    console.log("[ChatPage] Starting listening...");
    setIsFileUploaded(false);
    setIsTranscriptionDone(false);
    
    try {
      // Create a new audio context and get the stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      // Set stream to state explicitly as MediaStream
      setAudioStream(stream);
      
      // Create and configure recorder with audio/wav format
      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(stream);
      const localStartTime = Date.now();
      
      // Configure data collection
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          console.log(`[ChatPage] Audio data chunk received: ${e.data.size} bytes`);
        }
      };
      
      // Configure stop handler
      recorder.onstop = async () => {
        console.log("[ChatPage] Recording stopped, processing audio...");
        setRecording(false);
        
        // Check duration - similar to ConsultPatient
        const duration = (Date.now() - localStartTime) / 1000;
        console.log(`[ChatPage] Recording duration: ${duration.toFixed(2)} seconds`);
        
        if (duration < 2) {
          toast.error("Recording must be longer than 2 seconds");
          // Clean up stream tracks
          stream.getTracks().forEach((track) => track.stop());
          setAudioStream(null);
          return;
        }
        
        if (chunks.length > 0) {
          // Create blob with wav format like in ConsultPatient
          const audioBlob = new Blob(chunks, { type: "audio/wav" });
          console.log("[ChatPage] Audio blob created, size:", audioBlob.size, "type:", audioBlob.type);
          
          // Process the transcription
          await processAudioTranscription(audioBlob);
        } else {
          console.error("[ChatPage] No audio data collected");
          toast.error("No audio data recorded. Please check microphone permissions.");
        }
        
        // Clean up stream tracks
        stream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      };
      
      // Start recording
      recorder.start(1000); // Collect data every 1 second
      setMediaRecorder(recorder);
      setRecording(true);
      console.log("[ChatPage] Recording started successfully");
      
    } catch (error) {
      console.error("[ChatPage] Error in startListening:", error);
      toast.error("Could not access microphone. Please check permissions.");
      setRecording(false);
      setIsLoading(false);
    }
  };

  const stopListening = () => {
    console.log("[ChatPage] Stopping listening...");
    if (mediaRecorder) {
      // Check if in recording state and stop it
      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        console.log("[ChatPage] MediaRecorder stopped");
      } else {
        console.warn(`[ChatPage] MediaRecorder state is not 'recording'. Current state: ${mediaRecorder.state}`);
        toast.warning("Recording is not active.");
      }
      setMediaRecorder(null);
    } else {
      console.warn("[ChatPage] stopListening called but mediaRecorder is null");
      toast.warning("Recording already stopped.");
      setRecording(false);
    }
    
    // Always make sure to clean up the audio stream
    if (audioStream) {
      const stream = audioStream;
      stream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
    }
  };

  // Process audio transcription and send to chat
  const processAudioTranscription = async (audioBlob: Blob) => {
    console.log("[ChatPage] Processing audio transcription, blob size:", audioBlob.size, "type:", audioBlob.type);
    try {
      // Create a new FormData instance for the file upload
      const formData = new FormData();
      
      // Use .wav extension as in ConsultPatient
      formData.append("file", audioBlob, "recording.wav");
      
      // Add required parameters with correct data types
      formData.append("health_card_number", "123456789"); // Use a numeric string for health card
      // Use proper UUID format for ID fields
      formData.append("id", "00000000-0000-0000-0000-000000000000");
      formData.append("ms_booking_id", "00000000-0000-0000-0000-000000000000");
      formData.append("booking_id", "00000000-0000-0000-0000-000000000000");
      formData.append("phone_number", "0000000000");
      formData.append("email_address", "chatbot@example.com");
      formData.append("first_name", "Chat");
      formData.append("last_name", "User");
      formData.append("provider_id", provider.providerID || "00000000-0000-0000-0000-000000000000");
      
      // Use a real service ID from our fetched services
      if (defaultServiceId) {
        formData.append("service_id", defaultServiceId);
        console.log("[ChatPage] Using service_id:", defaultServiceId);
      } else {
        console.warn("[ChatPage] No default service ID available, service_id not sent");
      }
      
      // Add additional logging for debugging
      console.log("[ChatPage] FormData created with file: recording.wav");
      
      setIsLoading(true);
      console.log("[ChatPage] Sending request to transcription API...");
      
      // Use the correct endpoint from ConsultPatient
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/consults/speech-to-text`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: any) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              console.log(`Upload progress: ${percentCompleted}%`);
              if (percentCompleted === 100) {
                setIsFileUploaded(true);
              }
            }
          },
        }
      );
      
      console.log("[ChatPage] API response status:", response.status);
      
      if (response.status === 200) {
        console.log("[ChatPage] Transcription response:", response.data);
        
        // If we got a transcription, send it as a message
        if (response.data.transcription) {
          setIsTranscriptionDone(true);
          handleSendMessage(response.data.transcription);
          toast.success("Audio successfully transcribed!");
        } else {
          toast.error("No transcription returned. Please try again.");
        }
      }
    } catch (error: any) {
      console.error("[ChatPage] Error processing audio transcription:", error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to process audio. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log("[ChatPage] File selected:", file.name, "type:", file.type, "size:", file.size);
    
    if (!file.type.includes('audio')) {
      toast.error("Please upload an audio file");
      return;
    }
    
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      
      // Add required parameters with correct data types
      formData.append("health_card_number", "123456789"); // Use a numeric string for health card
      // Use proper UUID format for ID fields
      formData.append("id", "00000000-0000-0000-0000-000000000000");
      formData.append("ms_booking_id", "00000000-0000-0000-0000-000000000000");
      formData.append("booking_id", "00000000-0000-0000-0000-000000000000");
      formData.append("phone_number", "0000000000");
      formData.append("email_address", "chatbot@example.com");
      formData.append("first_name", "Chat");
      formData.append("last_name", "User");
      formData.append("provider_id", provider.providerID || "00000000-0000-0000-0000-000000000000");
      
      // Use a real service ID from our fetched services
      if (defaultServiceId) {
        formData.append("service_id", defaultServiceId);
        console.log("[ChatPage] Using service_id:", defaultServiceId);
      } else {
        console.warn("[ChatPage] No default service ID available, service_id not sent");
      }
      
      console.log("[ChatPage] Uploading audio file for transcription...");
      
      // Use the correct endpoint from ConsultPatient
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/consults/speech-to-text`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: any) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              console.log(`Upload progress: ${percentCompleted}%`);
            }
          },
        }
      );
      
      console.log("[ChatPage] Upload response status:", response.status);
      
      if (response.status === 200) {
        console.log("[ChatPage] Transcription result:", response.data);
        
        if (response.data.transcription) {
          handleSendMessage(response.data.transcription);
          toast.success("Audio file successfully transcribed!");
        } else {
          toast.error("No transcription returned. Please try a different file.");
        }
      }
    } catch (error: any) {
      console.error("[ChatPage] Error processing audio file:", error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to process audio file. Please try again.");
      }
    } finally {
      setIsLoading(false);
      // Reset the file input
      if (e.target) e.target.value = '';
    }
  };

  // Handle upload button click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <ProviderNavbar
        isSidebarOpened={isSidebarOpen}
        setIsSidebarOpened={setIsSidebarOpen}
      />
      
      <div className={`flex flex-col items-center justify-start mt-28 gap-[16px] w-full h-full ${isSidebarOpen ? "blur-sm ml-[25%]" : "ml-0"} font-['Roboto']`}>
        {/* Content area */}
        <div className="w-[95%] h-full flex">
          {/* Left sidebar */}
          <SidebarMenu activeMenu={activeMenu} />
          
          {/* Center content - Chat interface */}
          <ChatInterface
            input={input}
            isLoading={isLoading}
            latestResult={latestResult}
            conversationPairs={conversationPairs}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
            handleMicClick={startListening}
            handleUploadClick={handleUploadClick}
            stopListening={stopListening}
            recording={recording} 
            audioStream={audioStream}
          />
          
          {/* Right sidebar - Today panel */}
          <TodayPanel />
        </div>
      </div>
      
      {/* Hidden file upload input */}
      <input 
        id="fileUpload"
        type="file"
        accept="audio/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </>
  );
};

export default ChatPage; 