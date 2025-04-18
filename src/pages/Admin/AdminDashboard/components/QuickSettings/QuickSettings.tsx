import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadPatients from "../UploadPatients/UploadPatients";
import axiosInstance from "../../../../../axios/axiosInstance";

const QuickSettings: React.FC = () => {
  const [patientCount, setPatientCount] = React.useState([]);
  const navigate = useNavigate();

  const handleAddProvider = () => {
    navigate("/admin/add-provider");
  };
  const handleManageWaitlist = () => {
    navigate("/admin/manage-waitlist");
  };
  useEffect(() => {
    const fetchPatients = async () => {
      axiosInstance
        .get(import.meta.env.VITE_BACKEND_URL + "/patients/waiting-list/count")
        .then((response) => {
          setPatientCount(response.data.data);
        });
    };
    fetchPatients();
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-center  mt-16">
        <div>
          <UploadPatients />
          <button
            onClick={handleAddProvider}
            className="mt-4 bg-[#00c532] text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <img
              src="/Icons/PersonAddIcon.svg"
              alt="icon"
              className="w-8 h-8 inline-block ml-1"
            />
            Add new provider
          </button>
        </div>

        <div className="w-72  rounded-xl  mt-10">
          <div className="px-4 py-2 bg-[#007616] rounded-t-xl h-12 text-center flex  justify-center">
            <h3 className="text-white text-[24px] font-semibold text-center tracking-[1.5px]">
              Quick settings
            </h3>
          </div>

          <div className="p-6 bg-[#e8f5fb] rounded-b-xl">
            <div className="mb-4 ">
              <div className="flex justify-between items-center">
                <div className="flex-col gap-1">
                  <p className="text-lg font-semibold text-[#005063] ">
                    Waitlist
                  </p>

                  <p className=" text-sm text-[#7599a8]">
                    {patientCount} patients
                  </p>
                </div>
                <button
                  onClick={handleManageWaitlist}
                  className="bg-[#006e9e] text-white px-4 py-2 rounded-lg text-sm"
                >
                  Manage
                </button>
              </div>
            </div>
           

            {/* Accepting Patients Switch */}
            <div className="flex justify-between items-center">
              {/* <p className="text-sm text-[#006676] font-semibold">
              Accepting patients
            </p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007b80]"></div>
            </label> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickSettings;
