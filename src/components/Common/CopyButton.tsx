import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CopyButtonProps {
  data: any;
  size?: string;
  color?: string;
  triggerCopy?: boolean;
  setTriggerCopy?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CopyButton: React.FC<CopyButtonProps> = ({ data, size ="text-xl", color="text-[#016c9d]",triggerCopy=false,setTriggerCopy }) => {
  const [, setIsCopied] = useState(false);
  const [isClicked] = useState(false);

  useEffect(() => {
    if (triggerCopy) {
      handleCopyClick();
    }
  }, [triggerCopy]);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(data)
      .then(() => {
        setIsCopied(true);
        toast.success("Data copied to clipboard");
        if(setTriggerCopy)
        {
          setTriggerCopy(false);

        }
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  return (
    <div className="flex  h-auto items-center justify-end ">
      {isClicked && (
        <div className="h-auto flex z-30 justify-center items-center w-auto p-1 text-xs bg-black text-white font-roboto">
          Copied!
        </div>
      )}
      <button
        className="rounded cursor-pointer mr-2 float-right"
        type="button"
        onClick={handleCopyClick}
       >
        <i className={`fa-regular fa-clipboard ${size} ${color} group-hover:text-[#a9a9a9]`}></i>
      </button>
    </div>
  );
};

export default CopyButton;
