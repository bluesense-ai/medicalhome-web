import React from "react";

interface AutoSaveProgressProps {
  isSaving: boolean;
  isSaved: boolean;
}

const AutoSaveProgress: React.FC<AutoSaveProgressProps> = ({
  isSaving,
  isSaved,
}) => {
  return (
    <span className="float-right">
      {(() => {
        if (isSaving) {
          return (
            <span>
              <i className="fa-solid fa-spinner fa-spin"></i>{" "}
              <span>Saving...</span>
            </span>
          );
        }
        if (isSaved) {
          return (
            <span>
              <i className="fa-solid fa-circle-check text-green-500"></i>{" "}
              <span className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-tight tracking-wide">
                Saved
              </span>
            </span>
          );
        }
        return null;
      })()}
    </span>
  );
};

export default AutoSaveProgress;
