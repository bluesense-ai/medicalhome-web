import React from 'react';
import { FiCalendar, FiSearch } from 'react-icons/fi';

const TodayPanel: React.FC = () => {
  return (
    <div className="w-[215px] h-[550px] min-h-[550px] bg-[#004F62] text-white rounded-[8px] p-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[15px] font-semibold font-['Roboto']">Today</h2>
        <button className="p-2 rounded-[8px] bg-[rgba(255,255,255,0.1)]">
          <FiCalendar size={16} />
        </button>
      </div>
      
      {/* Appointments section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs leading-[14px] font-medium text-[rgba(255,255,255,0.8)] font-['Roboto']">Appointments</h3>
          <div className="flex items-center bg-[rgba(255,255,255,0.1)] rounded-[8px] px-1.5 py-1">
            <FiSearch size={12} className="mr-1" />
            <span className="text-[10px] font-['Roboto']">Filter</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="bg-[rgba(255,255,255,0.05)] rounded-[8px] p-3 border-l-4 border-[#00be5f]">
            <div className="text-[#00be5f] text-xs font-semibold font-['Roboto']">09:00</div>
            <div className="font-medium text-xs font-['Roboto']">Dr. Michael Johnson</div>
            <div className="text-xs text-[rgba(255,255,255,0.7)] font-['Roboto']">Cardiology Check-up</div>
          </div>
          
          <div className="bg-[rgba(255,255,255,0.05)] rounded-[8px] p-3">
            <div className="text-[#00be5f] text-xs font-semibold font-['Roboto']">11:30</div>
            <div className="font-medium text-xs font-['Roboto']">Medication Reminder</div>
            <div className="text-xs text-[rgba(255,255,255,0.7)] font-['Roboto']">Blood pressure medicine - 1 tablet</div>
          </div>
          
          <div className="bg-[rgba(255,255,255,0.05)] rounded-[8px] p-3">
            <div className="text-[#00be5f] text-xs font-semibold font-['Roboto']">14:00</div>
            <div className="font-medium text-xs font-['Roboto']">Laboratory</div>
            <div className="text-xs text-[rgba(255,255,255,0.7)] font-['Roboto']">Blood Test</div>
          </div>
        </div>
      </div>
      
      {/* Tasks section */}
      <div>
        <h3 className="text-xs leading-[14px] font-medium text-[rgba(255,255,255,0.8)] mb-3 font-['Roboto']">Tasks to do</h3>
        <div className="space-y-3">
          <div className="bg-[rgba(255,255,255,0.05)] rounded-[8px] p-3">
            <p className="text-xs font-['Roboto']">Review lab results for patient John Doe</p>
          </div>
          <div className="bg-[rgba(255,255,255,0.05)] rounded-[8px] p-3">
            <p className="text-xs font-['Roboto']">Call pharmacy about prescription refill</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayPanel; 