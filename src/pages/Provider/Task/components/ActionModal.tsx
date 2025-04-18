import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '30px',
    padding: '0',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: 'none',
    zIndex: 99999,
    },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99999,
  },
};

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onAlternativeAction?: () => void;
  modalType: 'save' | 'delete' | 'finish' | 'deleteConfirm' | 'reassignPatients';
}

export const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, onConfirm, modalType }) => {
  const getModalContent = () => {
    if (modalType === 'finish') {
      return {
        bgColor: 'bg-[#E6F8EE]',
        title: 'Profile created successfully!',
        titleColor: 'text-[#0E8549]',
        message: 'You have successfully created a new provider profile and it will now appear in the provider list. You can proceed to the provider list or add another provider. What do you want to do?',
        borderColor: 'border-[#0E8549]',
        cancelText: 'Provider list',
        cancelColor: 'text-[#0E8549]',
        confirmText: '+ Add new provider',
        confirmColor: 'text-[#0E8549]',
      };
    } else if (modalType === 'save') {
      return {
        bgColor: 'bg-[#FDF5E5]',
        title: 'Are you sure you want to save new changes?',
        titleColor: 'text-[#CC6D00]',
        message: 'When you click on yes, the changes will be saved and applied immediately.',
        borderColor: 'border-[#CC6D00]',
        cancelText: "Don't save it",
        cancelColor: 'text-[#A30E0E]',
        confirmText: 'Yes, save changes',
        confirmColor: 'text-[#004F62]',
      };
    } else if (modalType === 'deleteConfirm') {
      return {
        bgColor: 'bg-[#FEECEC]',
        title: 'Are you sure you want to delete this record?',
        titleColor: 'text-[#A30E0E]',
        message: 'When you click on yes, you will be deleting this record and it can not be undone!',
        borderColor: 'border-[#A30E0E]',
        cancelText: "Don't delete",
        cancelColor: 'text-[#016C9D]',
        confirmText: "Yes, I'm sure",
        confirmColor: 'text-[#A30E0E]',
      };
    } else if (modalType === 'reassignPatients') {
      return {
        bgColor: 'bg-[#FDF5E5]',
        title: 'You are reassigning these patients',
        titleColor: 'text-[#CC6D00]',
        message: "When you re-assign a provider, they will be permanently moved to a different provider list. Otherwise, they'll be assigned temporarily until the  provider is available again.",
        borderColor: 'border-[#CC6D00]',
        cancelText: "Re-assign provider",
        cancelColor: 'text-[#A30E0E]',
        confirmText: 'Move them temporarily',
        confirmColor: 'text-[#016C9D]',
      };
    }
    
    else {
      return {
        bgColor: 'bg-[#FEECEC]',
        title: 'Are you sure you want to delete this provider?',
        titleColor: 'text-[#A30E0E]',
        message: 'When you click on yes, you will be deleting this provider from the provider list and their clinics.',
        borderColor: 'border-[#A30E0E]',
        cancelText: "Don't delete them",
        cancelColor: 'text-[#016C9D]',
        confirmText: "Yes, I'm sure",
        confirmColor: 'text-[#A30E0E]',
      };
    }
  };

  const modalContent = getModalContent();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Action Modal"
    >
      <div className={`${modalContent.bgColor} p-6 rounded-[30px]`}>
        <h2 className={`text-xl font-bold ${modalContent.titleColor} mb-2`}>{modalContent.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{modalContent.message}</p>
        <div className={`border-t ${modalContent.borderColor} opacity-30 my-4`}></div>
        <div className="flex justify-end space-x-6">
          <button
            onClick={onClose}
            className={`${modalContent.cancelColor} cursor-pointer text-base font-medium`}
          >
            {modalContent.cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`${modalContent.confirmColor} cursor-pointer text-base font-medium`}
          >
            {modalContent.confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};