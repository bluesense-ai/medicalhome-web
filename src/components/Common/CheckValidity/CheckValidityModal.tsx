import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { useLocation } from 'react-router-dom';
import { isValid } from '../../../common/globalVariables';

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
    maxWidth: '500px',
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


interface CheckValidityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onAlternativeAction?: () => void;
  packages?: any
  isRegistered?: boolean
  handlePay?: (packageItem: any) => void,
  adminAccount?: any
}

export const CheckValidityModal: React.FC<CheckValidityModalProps> = ({ isOpen, onClose,isRegistered,adminAccount }) => {
  
  const location = useLocation();
  const hasConsultHistory = location.pathname.includes('consult-history');

  useEffect(() => {
    if(hasConsultHistory && !isValid){
      document.location.href = "/provider-dashboard";
    }
  
  }, [isValid]);


  const pay = () => {
    document.location.href = "/admin/payments";
  };
  


  const getModalContent = () => {

      const title = 'Your Account is expired.';
      const message = 'Please pay to continue using our services.'
      return {
        bgColor: 'bg-[#FDF5E5]',
        title: title,
        titleColor: 'text-[#A30E0E]',
        message: message,
        borderColor: 'border-[#CC6D00]',
        cancelText: "Ignore",
        cancelColor: 'text-[#A30E0E]',
        confirmText: 'Pay',
        confirmColor: 'text-[#004F62]',
      };
  };

  const modalContent = getModalContent();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Action Modal"
      shouldCloseOnOverlayClick={false}
    >
      <div className={`${modalContent.bgColor} p-6 rounded-[30px]`}>
        <h2 className={`text-xl font-bold ${modalContent.titleColor} mb-2`}>{modalContent.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{modalContent.message}</p>            
    {
      (isRegistered || 1) && (
        <>
        <div className={`border-t ${modalContent.borderColor} opacity-30 my-4`}></div>
        <div  className="flex justify-end space-x-6">
          <button
            onClick={onClose}
            className={`${modalContent.cancelColor} cursor-pointer text-base font-medium`}
          >
            {modalContent.cancelText}
          </button>
          <button
            onClick={pay}
            className={`${modalContent.confirmColor} cursor-pointer text-base font-medium`}
          >
            {(adminAccount?.package_id) ? "Pay" : modalContent.confirmText}
          </button>
        </div>
        </>
       
      )
    }
        
      </div>
    </Modal>
  );
};