import React, { useEffect, useState } from "react";
import { ActionModal } from "../components/ActionModal";
import axiosInstance from "../../../../axios/axiosInstance";
import Icon from "@mdi/react";
import { toast } from "react-toastify";
import TaskModal from "./components/AddEditModal";
import Loader from "../../../../components/Loader";
import { mdiPencil, mdiDeleteOutline } from "@mdi/js";
import { Task } from "../../../../common/types/task.type";
import * as utils from "../../../../common/utils/utils";

interface TasksProps {
  consultId: any;
}

const Tasks: React.FC<TasksProps> = ({consultId}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<Task | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task>({
    id: "",
    consult_id: consultId,
    due_date: new Date().toISOString().split("T")[0],
    title: "",
    status: "In Progress",
    details: "",
    assigned_to: [],
  });

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };
  useEffect(() => {
    
    const fetchTasks = async () => {
      if (!consultId) return;
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BACKEND_URL}/consults/${consultId}/tasks`
        );
       console.log(response.data);
        const tasks = response.data.map((task: any) => ({
          ...task,
          assigned_to: task.providers?.map((assignedTo: any) => {
            return {
              value: assignedTo.id,
              label: assignedTo.first_name + " " + assignedTo.last_name,
            };
          }),
        }))
        setTasks(tasks);
     
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [consultId]);


  const handleEdit = (row: Task) => {
    setEditMode(true);
    setCurrentTask(row);
    setIsModalOpen(true);
  };
  const handleAdd = () => {
    setEditMode(false);
    setCurrentTask({
      id: "",
      consult_id: consultId,
      due_date: new Date().toISOString().split("T")[0],
      title: "",
      status: "In Progress",
      details: "",
      assigned_to: [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (row: Task) => {
    setShowDeleteModal(true);
    setRowToDelete(row);
  };

  const confirmDelete = async () => {
    if (rowToDelete) {
      try {
        // Assuming you have an API endpoint to delete a patient
        setLoading(true);
        await axiosInstance.delete(
          `${import.meta.env.VITE_BACKEND_URL}/tasks/${rowToDelete.id}`
        );

        const updatedTasks = tasks.filter((t) => t.id !== rowToDelete.id);
        setTasks(updatedTasks);

        toast.success("Deleted successfully ");
      } catch (error: any) {
        toast.error(error.message);
        console.error("Error deleting patient:", error);
        // Handle error (e.g., show an error message to the user)
      } finally {
        setLoading(false);
        setShowDeleteModal(false);
        setRowToDelete(null);
      }
    }
  };
  const handleViewAll = () => {
    window.location.href = `/tasks`;
  };
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-center w-full h-[40px] border border-[#D9D9D9] rounded-t-[10px] bg-[#F2F8FF]">
        <span className="text-lg font-semibold text-[#004f62]">My Tasks</span>
      </div>

      {/* Table Container */}
      <div className="px-4 mt-3">
        <div className="rounded-[10px] border border-[#016c9d]">
          <div className="max-h-max p-2">
            <table className="w-full border-collapse">
              {/* Table Header */}
              <thead className="sticky top-0 bg-[#FFFFFF] shadow">
                <tr className="text-[#004f62]">
                  <th className="p-3 text-left">Task Title</th>
                  <th className="p-3 text-left">Due Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Details</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <tr
                      key={task.id}
                      className={`${
                        index % 2 === 0 ? "bg-[#F2F8FF]" : "bg-[#E1F0FF]"
                      }`}
                    >
                      <td className="p-3">{task.title}</td>
                      <td className="p-3">{utils.formatDate(task.due_date)}</td>
                    
                      <td className="p-3">{task.status}</td>
                      <td className="p-1 break-all w-[25%]">
                        <div className="h-[45px] overflow-y-scroll  no-scrollbar">
                          {task.details}
                        </div>
                      </td>
                      <td
                        className="p-4 h-full   cursor-pointer"
                        onClick={() => toggleDropdown(task.id)}
                      >
                        <div className="flex justify-center items-center relative ml-2 ">
                          <i className="fa-solid fa-ellipsis-vertical cursor-pointer z-0"></i>

                          {dropdownOpen === task.id && (
                            <div
                              className={`absolute right-0 w-32 bg-white border border-gray-300 rounded shadow-md z-50 top-full`}
                            >
                              <button
                                onClick={() => handleEdit(task)}
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
                                onClick={() => handleDelete(task)}
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

        {/* Add Task Button */}
        <div className="flex justify-end mt-3 mb-3" style={{ alignItems: "center" }}>
          
          <span onClick={() => handleViewAll()} className="text-[#004f62] mr-4 cursor-pointer font-semibold">View All</span>
          <button
            onClick={handleAdd}
            className="bg-[#FFFF] border border-[#004f62] text-[#004f62] px-4 py-1 rounded-md hover:bg-[#004f62] hover:text-[#FFFF]"
          >
            + Add Item
          </button>

        </div>
      </div>
      <TaskModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        setTasks={setTasks}
        setIsModalOpen={setIsModalOpen}
        currentTask={currentTask}
        setCurrentTask={setCurrentTask}
        tasks={tasks}
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

export default Tasks;
