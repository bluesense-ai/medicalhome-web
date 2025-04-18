import React, { useRef } from "react";
import Papa from "papaparse";
import axios from "axios";
import { toast } from "react-toastify";
const UploadPatients: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // const handleUploadClick = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };

  const sendDataToBackend = async (data: any) => {
    // setLoading(true);

    try {
     await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/patients/upload`,
        data
      );
      
    } catch (error) {
      console.error("Error sending data to backend:", error);
    } finally {
      //setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;

    if (selectedFile) {
      Papa.parse(selectedFile, {
        header: true,
        complete: (result: any) => {
          if ("health_card_number" in result.data[0]) {
            sendDataToBackend(result.data);
            console.log("CSV data:", result.data);
          } else {
            toast.error(
              "Invalid CSV format. Please upload a CSV file with the correct headers."
            );
          }
        },
        error: (error: any) => {
          console.error("Error parsing CSV:", error);
        },
      });
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {/* <button
        onClick={handleUploadClick}
        className="mt-4 bg-[#00c532] text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <img
          src="/Icons/upload_file.svg"
          alt="icon"
          className="w-8 h-8 inline-block ml-1"
        />
        Upload CSV Data
      </button> */}
    </>
  );
};

export default UploadPatients;
