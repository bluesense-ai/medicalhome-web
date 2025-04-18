import React from "react";

interface TranscriptionMessageProps {
  bgColor?: string; 
  borderColor?: string;
  textColor?: string; 
  message: string; 
}

const MessageContainer: React.FC<TranscriptionMessageProps> = ({
  bgColor = "bg-[#f2fff3]",
  textColor = "text-[#004f62]",
  borderColor = "border-[#016c9d]",
  message,
}) => {
 

  return (
    <div
      className={`h-20 w-[743px] ${bgColor} mt-1 rounded-[10px] border-2 ${borderColor} flex justify-center items-center p-9`}
    >
      <span
        className={`text-xl font-semibold text-center font-['Roboto'] ${textColor}`}
        style={{ whiteSpace: "pre-wrap" }}
      >
        {message}
      </span>
    </div>
  );
};

export default MessageContainer;
