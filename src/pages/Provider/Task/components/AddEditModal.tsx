import React, { useEffect } from "react";
import ReactSelect from "../../../../components/Common/ReactSelect";
import { Task } from "../../../../common/types/task.type";
import axiosInstance from "../../../../axios/axiosInstance";
import { toast } from "react-toastify";

interface TaskModalProps {
  isOpen: boolean;
  closeModal: () => void;
  setTasks: Function;
  setIsModalOpen: Function;
  currentTask: Task;
  setCurrentTask: Function;
  tasks: Task[];
  editMode: boolean;
  setFilteredTasks: Function
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  closeModal,
  setTasks,
  setIsModalOpen,
  currentTask,
  setCurrentTask,
  tasks,
  editMode,
  setFilteredTasks
}) => {
  if (!isOpen) return null;
  
const [assignedToOptions, setAssignedToOptions] = React.useState([]);
const handleSelectionChange = (selectedOptions: any) => {
console.log(selectedOptions);
setCurrentTask({ ...currentTask, assigned_to: selectedOptions });

}
useEffect(() => {
  const fetchAllStaff = async()=>{
    const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/staff/all`);
    const options = response.data.map((staff: any) => ({
      value: staff.id,
      label: staff.first_name + " " + staff.last_name
    }))
    setAssignedToOptions(options);
  }
  fetchAllStaff();
},[])



// Handle input changes
const handleInputChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
  setCurrentTask({ ...currentTask, [e.target.name]: e.target.value });
};
const handleAddTask = async () => {
  if (
    !currentTask.due_date ||
    !currentTask.title ||
    !currentTask.status ||
    !currentTask.details
  ) {
    alert("Please fill all fields");
    return;
  }
  
  try{
    if(editMode){
      axiosInstance.put(`${import.meta.env.VITE_BACKEND_URL}/tasks/${currentTask.id}`,currentTask);
      const updatedTasks = tasks.map((task: any) => {
        if (task.id === currentTask.id) {
          return { ...task, ...currentTask };
        }
        return task;
      });
      setFilteredTasks(updatedTasks);
      setTasks(updatedTasks);
    }else{
      const response = await axiosInstance.post(`${import.meta.env.VITE_BACKEND_URL}/tasks`,currentTask);
      setTasks((prevTasks:any) => [...prevTasks,  { ...currentTask, id: response.data.id}]);
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
          Add New Task
        </h2>
        <hr className="border-t border-gray-300 mb-4" />
        {/* Input Fields */}
        <div >
        <label className="mb-0">Title:</label>  
          <input
            type="text"
            name="title"
            value={currentTask.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Task Name"
          />
          <ReactSelect 
            name="assigned_to"
            label="Assigned To"
            className="my-1"
             width="100%"
            showLabel={true}
            isMulti={true}
            value={currentTask.assigned_to}
            onSelectionChange={handleSelectionChange}
            options={assignedToOptions}
          />
          <label className="mb-0">Due Date:</label>  
          <input
            type="date"
            name="due_date"
            value={new Date(currentTask.due_date).toISOString().split("T")[0]}
            onChange={handleInputChange}
            className="w-full p-2 border rounded mb-1"
            placeholder="Due Date"
          />

          <label className="mb-0">Status:</label>  

          <select
            name="status"
            value={currentTask.status}
            onChange={handleInputChange}
            className="w-full p-2 border rounded mb-1"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <label className="mb-0">Task Details:</label>  

          <textarea
            name="details"
            value={currentTask.details}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Description"
          ></textarea>
        </div>

        {/* Add Button */}
        <div className="mt-4 flex justify-end items-center">
          <span onClick={closeModal} className="mr-3 cursor-pointer text-[#004f62]">
           Discard
          </span>
          <button
            onClick={handleAddTask}
            className="bg-[#004f62] text-white px-4 py-2 rounded hover:bg-[#003b4d]"
          >
            {editMode ? "Update Task" : "Add Task"  }
          </button>

        </div>
      </div>
    </div>
  );
};

export default TaskModal;
