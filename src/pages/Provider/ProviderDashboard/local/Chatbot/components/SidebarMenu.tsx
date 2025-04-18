import React from 'react';
import { FiHome, FiFileText, FiClipboard, FiUsers, FiCheckSquare, FiTag, FiArchive, FiSettings, FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface SidebarMenuProps {
  activeMenu: string;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ activeMenu }) => {
  const navigate = useNavigate();
  
  const handleMenuClick = (menuId: string) => {
    if (menuId !== 'home') {
      navigate(`/provider-dashboard/${menuId}`);
    } else {
      navigate('/provider-dashboard');
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="w-[159px] h-[550px] min-h-[550px] bg-[#004F62] text-white rounded-[8px] overflow-hidden mr-5">
      <div className="p-3 flex items-center">
        <img src="/Icons/MedicalHome.svg" alt="Medical Home AI" className="w-6 h-6 mr-2" />
        <span className="text-white text-xs leading-[14px] font-semibold font-['Roboto']">Medical Home AI</span>
      </div>
      
      <div className="space-y-2 px-2 py-2">
        <div 
          className={`${activeMenu === 'home' ? 'bg-[#45B54C]' : 'bg-[rgba(255,255,255,0.05)]'} rounded-[8px] p-2 cursor-pointer`}
          onClick={() => handleMenuClick('home')}
        >
          <div className="flex items-center">
            <FiHome size={16} className="mr-2" />
            <span className="text-xs leading-[14px] font-medium font-['Roboto']">Home</span>
          </div>
        </div>
        
        <div 
          className={`${activeMenu === 'prescriptions' ? 'bg-[#45B54C]' : 'bg-[rgba(255,255,255,0.05)]'} rounded-[8px] p-2 cursor-pointer`}
          onClick={() => handleMenuClick('prescriptions')}
        >
          <div className="flex items-center">
            <FiFileText size={16} className="mr-2" />
            <span className="text-xs leading-[14px] font-medium font-['Roboto']">Prescriptions</span>
          </div>
        </div>
        
        <div 
          className={`${activeMenu === 'labresults' ? 'bg-[#45B54C]' : 'bg-[rgba(255,255,255,0.05)]'} rounded-[8px] p-2 cursor-pointer`}
          onClick={() => handleMenuClick('labresults')}
        >
          <div className="flex items-center">
            <FiClipboard size={16} className="mr-2" />
            <span className="text-xs leading-[14px] font-medium font-['Roboto']">Lab Results</span>
          </div>
        </div>
        
        <div 
          className={`${activeMenu === 'patients' ? 'bg-[#45B54C]' : 'bg-[rgba(255,255,255,0.05)]'} rounded-[8px] p-2 cursor-pointer`}
          onClick={() => handleMenuClick('patients')}
        >
          <div className="flex items-center">
            <FiUsers size={16} className="mr-2" />
            <span className="text-xs leading-[14px] font-medium font-['Roboto']">Patient List</span>
          </div>
        </div>
        
        <div 
          className={`${activeMenu === 'actions' ? 'bg-[#45B54C]' : 'bg-[rgba(255,255,255,0.05)]'} rounded-[8px] p-2 cursor-pointer`}
          onClick={() => handleMenuClick('actions')}
        >
          <div className="flex items-center">
            <FiCheckSquare size={16} className="mr-2" />
            <span className="text-xs leading-[14px] font-medium font-['Roboto']">Action Items</span>
          </div>
        </div>
        
        <div 
          className={`${activeMenu === 'tags' ? 'bg-[#45B54C]' : 'bg-[rgba(255,255,255,0.05)]'} rounded-[8px] p-2 cursor-pointer`}
          onClick={() => handleMenuClick('tags')}
        >
          <div className="flex items-center">
            <FiTag size={16} className="mr-2" />
            <span className="text-xs leading-[14px] font-medium font-['Roboto']">Tags</span>
          </div>
        </div>
      </div>
      
      <div className="px-3 py-2 text-xs leading-[14px] font-['Roboto'] text-[rgba(255,255,255,0.6)]">Workspace</div>
      
      <div className="space-y-2 px-2 py-1">
        <div 
          className={`${activeMenu === 'archived' ? 'bg-[#45B54C]' : 'bg-[rgba(255,255,255,0.05)]'} rounded-[8px] p-2 cursor-pointer`}
          onClick={() => handleMenuClick('archived')}
        >
          <div className="flex items-center">
            <FiArchive size={16} className="mr-2" />
            <span className="text-xs leading-[14px] font-medium font-['Roboto']">Archived</span>
          </div>
        </div>
        
        <div 
          className={`${activeMenu === 'integrations' ? 'bg-[#45B54C]' : 'bg-[rgba(255,255,255,0.05)]'} rounded-[8px] p-2 cursor-pointer`}
          onClick={() => handleMenuClick('integrations')}
        >
          <div className="flex items-center">
            <img src="/Icons/sync.svg" alt="Integrations" className="w-4 h-4 mr-2" />
            <span className="text-xs leading-[14px] font-medium font-['Roboto']">Integrations</span>
          </div>
        </div>
        
        <div 
          className={`${activeMenu === 'settings' ? 'bg-[#45B54C]' : 'bg-[rgba(255,255,255,0.05)]'} rounded-[8px] p-2 cursor-pointer`}
          onClick={() => handleMenuClick('settings')}
        >
          <div className="flex items-center">
            <FiSettings size={16} className="mr-2" />
            <span className="text-xs leading-[14px] font-medium font-['Roboto']">Settings</span>
          </div>
        </div>
      </div>
      
      <div className="p-3 mt-2">
        <button className="p-2 bg-[rgba(255,255,255,0.05)] rounded-full" onClick={handleBackClick}>
          <FiChevronLeft size={16} />
        </button>
      </div>
    </div>
  );
};

export default SidebarMenu; 