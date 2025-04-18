import React from 'react';

type ProgressModalProps = {
  show: boolean;
  isFileUploaded: boolean;
  isTranscriptionDone: boolean;
  isSoapNotesGenerated: boolean;
  dataExist: boolean;
  fieldForTranscription: string;
};

const ProgressModal: React.FC<ProgressModalProps> = ({ show, isFileUploaded, isTranscriptionDone, isSoapNotesGenerated, dataExist,fieldForTranscription }) => {
  if (!show) return null;
  const renderStatus = (isCompleted: boolean, isInProgress: boolean, completedText: string, progressText: string, preparingText: string) => {
    if (isCompleted) {
      return (
        <>
          <i className="fas fa-check-circle text-green-500"></i>
          <span className="ml-2">{completedText}</span>
        </>
      );
    } else if (isInProgress) {
      return (
        <>
          <img src="/img/general/loader.gif" alt={progressText} className="w-6 h-6" />
          <span className="ml-2">{progressText}</span>
        </>
      );
    } else {
      return <span className="ml-2">{preparingText}</span>;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <div className="text-lg font-semibold mb-4">
          {dataExist? 'Generating SOAP Notes' : 'Updating Provider Notes'}
        </div>
        
        <div className="mt-3 flex items-center">
          {renderStatus(isFileUploaded, isFileUploaded, 'File Uploaded Successfully', 'Uploading The File', 'Preparing to Upload File')}
        </div>

        <div className="mt-3 flex items-center">
          {renderStatus(isTranscriptionDone, isFileUploaded, 'Transcription completed', 'Getting Transcription', 'Preparing to Get Transcription')}
        </div>

        <div className={`mt-3 flex items-center ${(dataExist || fieldForTranscription)  ? 'hidden' : ''}`}>
          {renderStatus(isSoapNotesGenerated, isTranscriptionDone, 'SOAP Notes generated', 'Generating SOAP Notes', 'Preparing to generate SOAP Notes')}
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;
