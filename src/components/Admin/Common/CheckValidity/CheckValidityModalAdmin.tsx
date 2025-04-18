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

const calculateBillingCycle = (period : any) => {
  const periodMapping:any = {
    0.5: "SEMIMONTHLY", 
    1: "MONTHLY",       
    2: "BIMONTHLY",     
    3: "QUARTERLY",    
    6: "SEMESTER",     
    12: "ANNUALLY"     
  };

  return periodMapping[period] || false; 
};

interface CheckValidityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onAlternativeAction?: () => void;
  packages?: any
  isRegistered?: boolean
  handlePay: (packageItem: any) => void,
  adminAccount?: any
}

export const CheckValidityModalAdmin: React.FC<CheckValidityModalProps> = ({ isOpen, onClose,onConfirm,packages,isRegistered,handlePay,adminAccount }) => {
  
  const getModalContent = () => {

      const title = isRegistered ? 'Your Account is expired.' : 'Not Registered.';
      const message = isRegistered ? 'Please pay to continue using our services.' : 'Please select desired package.'
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
        {packages && (
  <>
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Packages</h3>
      <ul className="mt-4 space-y-4">
        {packages.map((packageItem: any) => (
          <li
            key={packageItem.id}
            className={`flex items-center justify-between bg-[#f6eddb] shadow-md 
            rounded-lg p-4 hover:shadow-lg transition-shadow 
              ${packageItem.id == adminAccount?.package_id ? "border border-green-800 bg-green-100" : ""}
               `}
            >
            <div>
              <span className="text-lg font-medium text-gray-900">{packageItem.name}</span>
              <span className="block text-gray-600 text-sm mr-6"> {packageItem.max_members } {packageItem.max_members > 1 ? "Providers" : "Provider"}  </span>
            </div>
            <span className="block text-gray-600 text-sm">${packageItem.price}</span>
            <span className="block text-gray-600 text-sm">{ calculateBillingCycle(packageItem.period)}</span>
            
            {!(packageItem.id == adminAccount?.package_id) ? (
              <button
               className="px-4 py-2 btn-primary text-white font-medium text-sm rounded-lg hover:bg-blue-600 transition-colors"
               onClick={() => handlePay(packageItem)}
             >
               Pay
             </button>
            ):( <span></span>)}
          </li>
        ))}
      </ul>
    </div>
  </>
)}

            
    {
      isRegistered && (
        <>
        <div className={`border-t ${modalContent.borderColor} opacity-30 my-4`}></div>
        <div  className="flex justify-end space-x-6">
          {/* <button
            onClick={onClose}
            className={`${modalContent.cancelColor} cursor-pointer text-base font-medium`}
          >
            {modalContent.cancelText}
          </button> */}
          <button
            onClick={onConfirm}
            className={`${modalContent.confirmColor} cursor-pointer text-base font-medium`}
          >
            {(adminAccount?.package_id) ? "Continue With Selected" : modalContent.confirmText}
          </button>
        </div>
        </>
       
      )
    }
        
      </div>
    </Modal>
  );
};