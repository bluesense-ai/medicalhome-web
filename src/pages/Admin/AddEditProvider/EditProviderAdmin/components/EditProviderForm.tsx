import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { SelectField } from "../../../../../components/Common/FormFields";
import { useNavigate } from "react-router-dom";
import { ActionModal } from "../../../../../components/ProviderActionModal/ProviderActionModals";
import axiosInstance from "../../../../../axios/axiosInstance";
import { AxiosError } from "axios";
import ReactSelect from "../../../../../components/Common/ReactSelect";
import { Option } from "../../../../../common/types/option.type";

const validationSchema = Yup.object().shape({
  last_name: Yup.string().required("Required"),
  first_name: Yup.string().required("Required"),
  username: Yup.string().required("Required"),
  provider_status: Yup.string().required("Required"),
  phone_number: Yup.string().required("Required"),
  email_address: Yup.string().email("Invalid email").required("Required"),
});

interface Provider {
  id: string;
  picture: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  user_name: string;
  mnc_number: string;
  phone_number: string;
  email_address: string;
  roles: string[];
  provider_status: string;
  patient_count: number;
  medical_group?: string;
  clinics: string[];
  sex: string;
}

interface EditProviderFormProps {
  initialData: Provider;
}

const EditProviderForm: React.FC<EditProviderFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"save" | "delete">("save");
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedClinics, setSelectedClinics] = useState<Option[]>([]);
  const [clinicsOptions, setClinicsOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState<Option[]>([]);

  useEffect(() => {
    if (initialData) {
      setSelectedClinics(
        initialData.clinics.map((clinic: any) => ({
          value: clinic.id,
          label: clinic.name,
        }))
      );
      setSelectedRoles(
        initialData.roles.map((role: any) => ({
          value: role.id,
          label: role.name,
        }))
      );
    }
  }, [initialData]);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axiosInstance.get(
          import.meta.env.VITE_BACKEND_URL + "/clinics/get-all-clinics"
        );
        setClinicsOptions(
          response.data.map((clinic: any) => ({
            value: clinic.id,
            label: clinic.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get(
          import.meta.env.VITE_BACKEND_URL + "/roles"
        );
        setRoleOptions(
          response.data
            .filter((role: any) => role.type !== "system-created")
            .map((role: any) => ({ value: role.id, label: role.name }))
        );
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };
    fetchClinics();
    fetchRoles();
  }, []);
  const onClinicChange = (clinics: any) => {
    console.log(clinics);
    setSelectedClinics(clinics);
  };
  const onRoleChange = (roles: any) => {
    console.log(roles);
    setSelectedRoles(roles);
  };
  const handleSubmit = async (values: Provider) => {
    try {
      const formData = new FormData();
      console.log("handle submit");
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "picture" && value instanceof File) {
            formData.append(key, value);
          } else if (key === "clinics") {
            formData.append(key, JSON.stringify(selectedClinics));
          } else if (key === "roles") {
            formData.append(key, JSON.stringify(selectedRoles));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const updateUrl = `${import.meta.env.VITE_BACKEND_URL}/providers/${
        initialData.id
      }`;
      console.log("form data", formData);
      const response = await axiosInstance.put(updateUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        navigate("/admin/provider-list");
      } else {
        throw new Error(response.data.message || "Failed to update provider");
      }
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ||
            "An error occurred while updating the provider"
        );
      } else {
        setError("An unexpected error occurred while updating the provider");
      }
    }
  };

  const handleDelete = () => {
    // Implement delete functionality if needed
    alert("Delete functionality not implemented yet.");
  };

  const openModal = (type: "save" | "delete") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <Formik
      initialValues={{
        ...initialData,
        username: initialData.user_name,
        roles: initialData.roles,
        provider_status: initialData.provider_status
          .toLowerCase()
          .replace(/ /g, "-"),
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm, setFieldValue }) => (
        <Form className="space-y-4 p-6">
          {error && (
            <div className="text-red-500 text-center p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          {/* Image Upload and Username Section */}
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center md:flex-row md:items-center md:justify-center space-x-0 md:space-x-4 mb-6">
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={previewImage || initialData.picture}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover"
                />
                <label className="flex items-center text-black border bg-[#c4e6f5] hover:bg-[#004F62B2] px-2 py-1.5 rounded-md cursor-pointer">
                  <img
                    src="/Icons/change_circle.svg"
                    alt="Change"
                    className="w-5 h-5 mr-2"
                  />
                  <span>Change image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      if (file) {
                        setFieldValue("picture", file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPreviewImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <div className="flex-grow pt-1 mt-4 md:mt-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Field
                  name="username"
                  type="text"
                  className="w-[280px] max-w-[320px] px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First name
              </label>
              <Field
                name="first_name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <ErrorMessage
                name="first_name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Middle Name
              </label>
              <Field
                name="middle_name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <ErrorMessage
                name="middle_name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last name
            </label>
            <Field
              name="last_name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <ErrorMessage
              name="last_name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MINC Number
            </label>
            <Field
              name="mnc_number"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <ErrorMessage
              name="mnc_number"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Middle name
              </label>
              <Field
                name="middle_name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div> */}
        <div className="grid grid-cols-4 md:grid-cols-4 gap-2">
              <SelectField
                name="sex"
                label="Sex"
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
              />
              <ReactSelect
                name="Type"
                label="Provider Type"
                options={roleOptions}
                onSelectionChange={onRoleChange}
                width="100%"
                className="col-span-3"
                isMulti={true}
                value={selectedRoles}
                showLabel={true}
              />
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone number
              </label>
              <Field
                name="phone_number"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <ErrorMessage
                name="phone_number"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <Field
                name="email_address"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <ErrorMessage
                name="email_address"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider Status
              </label>
              <div className="relative">
                <Field
                  name="provider_status"
                  as="select"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 "
                >
                  <option value="available">Available</option>
                  <option value="vacation">Vacation</option>
                  <option value="out-of-office">Out of Office</option>
                  <option value="on-call">On Call</option>
                </Field>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <img
                    src="/Icons/Chevron down.svg"
                    alt="Dropdown arrow"
                    className="w-4 h-4"
                  />
                </div>
              </div>
              <ErrorMessage
                name="provider_status"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Microsoft Calendar ID
              </label>
              <Field
                name="ms_calendar_id"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <ErrorMessage
                name="ms_calendar_id"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clinic
            </label>
            <ReactSelect
              name="clinics"
              label="clinics"
              options={clinicsOptions}
              onSelectionChange={onClinicChange}
              width="100%"
              isMulti={true}
              value={selectedClinics}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => openModal("delete")}
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
              <span>Delete provider</span>
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
                handleDelete();
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
