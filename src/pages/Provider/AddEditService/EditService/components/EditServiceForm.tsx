import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { SelectField } from "../../../../../components/Common/FormFields";
import { useNavigate } from "react-router-dom";
import { ActionModal } from "../../../../../components/ProviderActionModal/ProviderActionModals";
import axiosInstance from "../../../../../axios/axiosInstance";
import { AxiosError } from "axios";
import { Service } from "../../../../../common/types/service.type";
import { convertToISO8601 } from "../../../ProviderDashboard/local/common/helper";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  default_duration: Yup.string().required("Duration is required"),
  description: Yup.string().nullable(""),
  status: Yup.string().required("Status is required"),
});

interface EditServiceFormProps {
  initialData: Service;
}

const EditProviderForm: React.FC<EditServiceFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"save" | "delete" | "deleteService">("save");
  // const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = async (values: Service) => {
    try {
      
      const formData = new FormData();
      console.log("handle submit");
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {

          formData.append(key, value.toString());

        }
      });

      const updateUrl = `${import.meta.env.VITE_BACKEND_URL}/services/${initialData.id
        }`;
      console.log("form data", formData);
      const response = await axiosInstance.put(updateUrl, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        toast.success("Provider service update successfully!", {
          autoClose: 3000,
        });
        navigate("/provider-services");
      } else {
        toast.success("Failed to update service!", {
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        toast.success("An error occurred while updating the service!", {
          autoClose: 3000,
        });
      } else {
        toast.success("An unexpected error occurred while updating the service!", {
          autoClose: 3000,
        });
      }
    }
  };

  const handleDelete = async (id: any) => {
    try {
      
      setIsLoading(true);
      console.log(isLoading);
      if (id) {
        const response = await axiosInstance.delete<Service>(
          `${import.meta.env.VITE_BACKEND_URL}/services/${id}`
        );

        if (response.status === 204) {
          toast.success("Provider service deleted successfully!", {
            autoClose: 3000,
          });
          navigate("/provider-services");
        } else {
          toast.success("Failed to delete service!", {
            autoClose: 3000,
          });
        }

      }
    } catch (error) {
      toast.success("Failed to delete service!", {
        autoClose: 3000,
      });
      navigate("/provider-services");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (type: "save" | "delete" | "deleteService") => {
    setModalType(type);
    setIsModalOpen(true);
  };
  const optionsStatus = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ];
  const closeModal = () => setIsModalOpen(false);

  return (
    <Formik
      initialValues={{
        ...initialData,
        name: initialData.name,
        default_duration: initialData.default_duration,
        description: initialData.description,
        status: initialData.status,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm, handleChange, values }) => (
        <Form className="space-y-4 p-6">
          {/* {error && (
            <div className="text-red-500 text-center p-2 bg-red-50 rounded">
              {error}
            </div>
          )} */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Field
              name="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <SelectField
            name="default_duration"
            label="Service Duration"
            options={Array.from({ length: 12 }, (_, i) => ({
              value: convertToISO8601((i + 1) * 5),  // Convert number to string
              label: `${(i + 1) * 5} min`
            }))}
          />
          <SelectField
            name="status"
            label="Service Status"
            options={optionsStatus}
          />
          <div className="grid grid-cols-1 gap-4">
            <label className="font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={values.description}
              placeholder="Type your message here..."
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-700"
              rows={4}
              onChange={handleChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => openModal("deleteService")}
              className="text-[#A30E0E] font-medium flex items-center space-x-2"
            >
              <img
                src="/Icons/delete_forever.svg"
                alt="Delete"
                className="w-5 h-5"
                style={{
                  filter:
                    "invert(30%) sepia(100%) saturate(1000%) hue-rotate(340deg) brightness(90%) contrast(110%)",
                }}
              />
              <span>Delete Service</span>
            </button>

            <button
              type="button"
              onClick={() => openModal("save")}
              className="px-6 py-2 bg-[#33C213] text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Save changes
            </button>
          </div>

          {/* Action Modal */}
          <ActionModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onAlternativeAction={closeModal}
            onConfirm={() => {
              if (modalType === "save") {
                
                console.log("submitting form");
                submitForm();
              } else {
                handleDelete(values.id);
              }
              closeModal();
            }}
            modalType={modalType}
          />
        </Form>
      )}
    </Formik>
  );
};

export default EditProviderForm;
