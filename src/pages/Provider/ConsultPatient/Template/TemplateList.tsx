import React, {  useRef, useState } from "react";
import { ActionModal } from "../components/ActionModal";
import axiosInstance from "../../../../axios/axiosInstance";
import Icon from "@mdi/react";
import { toast } from "react-toastify";
import Loader from "../../../../components/Loader";
import { mdiPencil, mdiDeleteOutline } from "@mdi/js";
import { Template } from "./types/template.type";
import TemplateModal from "./components/AddEditModal";

interface TemplateListProps {
 templates:Template[];
 setTemplates:Function
}

const TemplateList: React.FC<TemplateListProps> = ({templates,setTemplates}) => {
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<Template | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template>({
    id: "",
    title: "",
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    provider_notes: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  


  const handleEdit = (row: Template) => {
    setEditMode(true);
    setCurrentTemplate(row);
    setIsModalOpen(true);
  };
  const handleAdd = () => {
    setEditMode(false);
    setCurrentTemplate({
      id: "",
      title: "",
      subjective: "",
      objective: "",
      assessment: "",
      plan: "",
      provider_notes: "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (row: Template) => {
    setShowDeleteModal(true);
    setRowToDelete(row);
  };

  const confirmDelete = async () => {
    if (rowToDelete) {
      try {
        // Assuming you have an API endpoint to delete a patient
        setLoading(true);
        console.log(rowToDelete);
        await axiosInstance.delete(
          `${import.meta.env.VITE_BACKEND_URL}/templates/${rowToDelete.id}`
        );

        const updatedTasks = templates.filter((t) => t.id !== rowToDelete.id);
        setTemplates(updatedTasks);

        toast.success("Deleted successfully ");
      } catch (error: any) {
        toast.error(error.message);
        console.error("Error deleting:", error);
        // Handle error (e.g., show an error message to the user)
      } finally {
        setLoading(false);
        setShowDeleteModal(false);
        setRowToDelete(null);
      }
    }
  };
  const toggleDropdown = (id: string, index: number) => {
    setDropdownOpen(dropdownOpen === id ? null : id);

    // Check if the row is one of the last two
    if (rowRefs.current[index] && templates.length - index <= 2) {
      const tableContainer = document.getElementById("table-container");
      if (tableContainer) {        
        setTimeout(() => {
        tableContainer.scrollTop = tableContainer.scrollHeight;
        console.log( tableContainer.scrollHeight);
        },50)
      }
    }
  };

  
 
  
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-center w-full h-[40px] border border-[#D9D9D9] rounded-t-[10px] bg-[#F2F8FF]">
        <span className="text-lg font-semibold text-[#004f62]">Templates</span>
      </div>

      <div className="px-4 mt-3">
       
        <div className="rounded-[10px] border mb-2 border-[#016c9d]">
          <div id="table-container" className="relative max-h-[300px] overflow-y-auto p-2 pt-0">
            <table className="w-full border-collapse">
              {/* Table Header */}
              <thead className="sticky top-0 bg-[#FFFFFF] shadow z-10">
                <tr className="text-[#004f62]">
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left w-[50%]">Subjective</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {templates.length > 0 ? (
                  templates.map((row, index) => (
                    <tr
                      key={row.id}
                      ref={(el) => (rowRefs.current[index] = el)}
                      className={`${
                        index % 2 === 0 ? "bg-[#F2F8FF]" : "bg-[#E1F0FF]"
                      }`}
                    >
                      <td className="p-3">{row.title}</td>
                      <td className="p-1 break-all w-[25%]">
                        <div className="h-[45px] overflow-y-scroll  no-scrollbar">
                          {row.subjective}
                        </div>
                      </td>
                      <td
                        className="p-4 h-full relative  cursor-pointer"
                        onClick={() => toggleDropdown(row.id, index)}
                      >
                        <div className="flex justify-center items-center relative ml-2 ">
                          <i className="fa-solid fa-ellipsis-vertical cursor-pointer"></i>

                          {dropdownOpen === row.id && (
                            <div
                              className={`absolute right-0 w-32 bg-white border border-gray-300 rounded shadow-md z-50 top-full`}
                            >
                              <button
                                onClick={() => handleEdit(row)}
                                className="text-[#004f62] flex items-center gap-1 w-full text-left px-4 py-2 hover:bg-gray-100"
                              >
                                <Icon
                                  path={mdiPencil}
                                  color={"#004f62"}
                                  size={0.8}
                                  title="Edit"
                                />{" "}
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(row)}
                                className="text-[#004f62] flex items-center gap-1 w-full text-left px-4 py-2 hover:bg-gray-100"
                              >
                                <Icon
                                  path={mdiDeleteOutline}
                                  size={0.8}
                                  title="Delete"
                                />{" "}
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-3 text-center">
                      No Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
          </div>
          
        </div>
        <div className="flex justify-end  mt-3 mb-2">
          <button
            onClick={handleAdd}
            className="bg-[#FFFF] border border-[#004f62] text-[#004f62] px-4 py-1 rounded-md hover:bg-[#004f62] hover:text-[#FFFF]"
          >
            + Add Item
          </button>
        </div>
      </div>
      <TemplateModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        setTemplates={setTemplates}
        setIsModalOpen={setIsModalOpen}
        currentTemplate={currentTemplate}
        setCurrentTemplate={setCurrentTemplate}
        templates={templates}
        editMode={editMode}
      />
      <ActionModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        modalType="deleteConfirm"
      />
      {loading && <Loader showOverlay={true} />}
    </>
  );
};

export default TemplateList;
