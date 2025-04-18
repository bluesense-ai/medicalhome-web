import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import ProviderNavbar from "../../../components/ProviderNavbar";
import FilterBox from "./components/FilterBox";
import { Task } from "../../../common/types/task.type";
import * as utils from "../../../common/utils/utils";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";
import { ActionModal } from "./components/ActionModal";
import TaskModal from "./components/AddEditModal";


const TaskList: React.FC = () => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<Task | null>(null);

  const [currentTask, setCurrentTask] = useState<Task>({
    id: "",
    consult_id: "",
    title: "",
    status: "",
    details: "",
    due_date: "",
    assigned_to: [],
  });
  useEffect(() => {
    let url = `${import.meta.env.VITE_BACKEND_URL}/tasks`;
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(url);
        const tasksList = response.data.map((task: any) => ({
          ...task,
          assigned_to: task.providers?.map((assignedTo: any) => {
            return {
              ...assignedTo,
              label: assignedTo.first_name + " " + assignedTo.last_name,
              value: assignedTo.id,
            };
          }),
        }))
        setTasks(tasksList);
      
        console.log(tasksList);
        setFilteredTasks(tasksList);
      } catch (err) {
        setError("Error fetching patients");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  const handleEdit = (row: Task) => {
    setEditMode(true);
    setCurrentTask(row);
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
        setFilteredTasks(updatedTasks);

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
  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <>
      <ProviderNavbar
        isSidebarOpened={isSidebarOpen}
        setIsSidebarOpened={setIsSidebarOpen}
      />
      <div
        className={`flex flex-col items-center justify-start mt-36 gap-[20px] w-full h-full ${
          isSidebarOpen ? "blur-sm ml-[25%]" : "ml-0"
        }`}
      >
        <div className="w-[80%] h-16 py-[18.50px] bg-[#004f62] rounded-lg justify-center items-center inline-flex">
          <h2 className="text-[#f2f8ff] text-2xl font-bold">All Tasks</h2>
        </div>
        <FilterBox tasks={tasks} setFilteredTasks={setFilteredTasks} />
        <div className="w-[80%] p-1 rounded-lg border-2 border-[#004f62]/70">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white-200 rounded-lg border border-[#004f62]/70 overflow-hidden">
              <thead className="text-[#004f62] text-sm font-semibold capitalize leading-normal tracking-wide">
                <tr>
                  <th className="text-left p-4">#</th>
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Due Date</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Assigned To</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks?.map((row, index) => (
                    <tr
                      key={row.id}
                      className="text-black text-sm font-normal border-t border-[#3499d6]/25 hover:bg-gray-100"
                    >
                      <td className="p-4">{index + 1}</td>

                      <td className="p-4">
                        {row.title || ""}
                      </td>
                      <td className="p-4">
                        {utils.formatDate(row.due_date)}
                      </td>
                      <td className="p-4">
                       {row.details}
                      </td>
                      <td className="p-4">
                        {row.assigned_to?.map((provider: any) => {
                          const separator = row.assigned_to.length > 1 ? ", " : "";
                          return provider.first_name + " " + provider.last_name + separator;
                        })}

                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          {/* View Button */}
                          <button
                            className="rounded cursor-pointer"
                            onClick={()=>{handleEdit(row)}}
                          > 
                          <i className="fa fa-pencil text-[#004f62]"></i>
                          </button>
                          <button
                            className="rounded cursor-pointer"
                            onClick={()=> {handleDelete(row)}}
                          > 
                          <i className="fa fa-trash text-[#004f62]"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center p-4">
                      No Patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <TaskModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        setTasks={setTasks}
        setFilteredTasks={setFilteredTasks}
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
      </div>
    </>
  );
};

export default TaskList;
