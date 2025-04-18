import React from "react";
import { Template } from "../types/template.type";
import axiosInstance from "../../../../../axios/axiosInstance";
import { toast } from "react-toastify";

interface TemplateModalProps {
  isOpen: boolean;
  closeModal: () => void;
  setIsModalOpen: Function;
  currentTemplate: Template;
  setCurrentTemplate: Function;
  templates: Template[];
  editMode: boolean;
  setTemplates: Function
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  closeModal,
  setIsModalOpen,
  currentTemplate,
  setCurrentTemplate,
  templates,
  editMode,
  setTemplates,
}) => {
  if (!isOpen) return null;
  



// Handle input changes
const handleInputChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
  setCurrentTemplate({ ...currentTemplate, [e.target.name]: e.target.value });
};
const handleAddTemplate = async () => {
  if (
    !currentTemplate.subjective ||
    !currentTemplate.title 
  ) {
    alert("Please fill all fields");
    return;
  }
  
  try{
    if(editMode){
      axiosInstance.put(`${import.meta.env.VITE_BACKEND_URL}/templates/${currentTemplate.id}`,currentTemplate);
      const updatedTasks = templates.map((task: any) => {
        if (task.id === currentTemplate.id) {
          return { ...task, ...currentTemplate };
        }
        return task;
      });
      setTemplates(updatedTasks);
    }else{
      const response = await axiosInstance.post(`${import.meta.env.VITE_BACKEND_URL}/templates`,currentTemplate);
      setTemplates((prevTemplates:any) => [...prevTemplates,  { ...currentTemplate, id: response.data.id}]);
    }

   setIsModalOpen(false);

  }catch(error){
    console.log(error);
    toast.error("Something Went Wrong");
  }

};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/3 relative">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-5 text-red-500 hover:text-red-700 text-xl"
        >
          <i className="fas fa-times"></i>
        </button>

        <h2 className="text-xl font-semibold text-[#004f62] mb-4">
          Add New Template
        </h2>
        <hr className="border-t border-gray-300 mb-4" />
        {/* Input Fields */}
        <div >
        <label className="mb-0">Title:</label>  
          <input
            type="text"
            name="title"
            value={currentTemplate.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Title"
          />

          <label className="mb-0">Subjective:</label>  
          <textarea
            name="subjective"
            value={currentTemplate.subjective}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Subjective"
          ></textarea>
          <label className="mb-0">Objective:</label>  
          <textarea
            name="objective"
            value={currentTemplate.objective}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Objective"
          ></textarea>
          <label className="mb-0">Assessment:</label>  
          <textarea
            name="assessment"
            value={currentTemplate.assessment}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Assessment"
          ></textarea>
          <label className="mb-0">Plan:</label>  
          <textarea
            name="plan"
            value={currentTemplate.plan}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Plan"
          ></textarea>
          <label className="mb-0">Notes:</label>  
          <textarea
            name="provider_notes"
            value={currentTemplate.provider_notes}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Provider Notes"
          ></textarea>

        </div>

        {/* Add Button */}
        <div className="mt-4 flex justify-end items-center">
          <span onClick={closeModal} className="mr-3 cursor-pointer text-[#004f62]">
           Discard
          </span>
          <button
            onClick={handleAddTemplate}
            className="bg-[#004f62] text-white px-6 py-1 rounded hover:bg-[#003b4d]"
          >
            {editMode ? "Update" : "Save"  }
          </button>

        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
