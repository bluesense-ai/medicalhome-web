import React, { useState, useEffect } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { InputField,SelectField } from "../../../../../components/Common/FormFields";

import ImageUploadDisplay from "./ImageUploadDisplay";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../../axios/axiosInstance";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import ReactSelect from "../../../../../components/Common/ReactSelect";
import { Option } from "../../../../../common/types/option.type";
import useAccount from "../../../../../components/Common/Hooks/useAccount";
interface FormValues {
  mnc_number: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  roles: string[];
  medical_group: string;
  clinics: string[];
  username: string;
  picture: File | null;
  provider_status: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  provider?: {
    id: string;
    // Add other provider properties if needed
  };
}

const providerStatusOptions = [
  { value: "available", label: "Available" },
  { value: "vacation", label: "Vacation" },
  { value: "out-of-office", label: "Out of Office" },
  { value: "on-call", label: "On Call" },
];

const AddProviderForm: React.FC = () => {
  const navigate = useNavigate();

  const [selectedClinics, setSelectedClinics] = useState<Option[]>([]);
  const [clinicsOptions, setClinicsOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState<Option[]>([]);
  const account = useAccount();
  const initialValues: FormValues = {
    mnc_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    phone_number: "",
    email_address: "",
    roles: [],
    medical_group: "",
    clinics: [],
    username: "",
    picture: null,
    provider_status: "available",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    phone_number: Yup.string().required("Phone number is required"),
    email_address: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    username: Yup.string().required("Username is required"),
    provider_status: Yup.string().required("Provider status is required"),
    picture: Yup.mixed().nullable(),
  });

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
    console.log(providerStatusOptions);
  }, []);
  const onClinicChange = (clinics: any) => {
    console.log(clinics);
    setSelectedClinics(clinics);
  };
  const onRoleChange = (roles: any) => {
    console.log(roles);
    setSelectedRoles(roles);
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "picture" && value instanceof File) {
          formData.append(key, value);
        } else if (key === "clinics") {
          formData.append(key, JSON.stringify(selectedClinics));
        } else if (key === "roles") {
          formData.append(key, JSON.stringify(selectedRoles));
        } else {
          formData.append(key, value);
        }
        console.log(key, value);
      });

      const response = await axiosInstance.post<ApiResponse>(
        import.meta.env.VITE_BACKEND_URL + "/providers",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast.success("Provider created successfully!", {
          autoClose: 3000,
        });
        if (response.data.provider && response.data.provider.id) {
          navigate(
            `/admin/manage-waitlist?providerId=${response.data.provider.id}`
          );
        } else {
          navigate("/admin/manage-waitlist");
        }
      } else {
        toast.error(
          response.data.message ||
            "An error occurred while creating the provider",
          {
            autoClose: 3000,
          }
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ||
            "An error occurred while sending the request. Please try again.",
          {
            autoClose: 3000,
          }
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          autoClose: 3000,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="w-full p-2 bg-white rounded-lg">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            <InputField
              name="mnc_number"
              label="MINC #"
              placeholder="Enter Medical Identification Number of Canada"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="first_name"
                label="First name(s)"
                placeholder="Enter your first name(s)"
              />
              <InputField
                name="middle_name"
                label="Middle name(s)"
                placeholder="Enter your middle name(s)"
              />

              {/* <InputField name="middle_name" label="Middle name(s)" placeholder="Enter your middle name(s)" /> */}
            </div>
            <InputField
              name="last_name"
              label="Last name(s)"
              placeholder="Enter your last name(s)"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <InputField
                name="phone_number"
                label="Phone number"
                type="tel"
                placeholder="Enter your phone number"
              /> */}
              <InputField
                name="phone_number"
                label="Phone number"
                type="tel"
                placeholder="Enter your phone number"
              />
              <InputField
                name="email_address"
                label="Email address"
                type="email"
                placeholder="Enter your email address"
              />
              {/* <SelectField
                name="provider_status"
                label="Provider status"
                options={providerStatusOptions}
              /> */}
            </div>
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
              <InputField
                name="medical_group"
                label="Medical Group"
                type="text"
                className="w-full bg-[#D9D9D9] text-[#B3B3B3] cursor-not-allowed"
                placeholder="Medical Group"
                value={account.name}
              />
              <ReactSelect
                name="clinics"
                label="clinics"
                options={clinicsOptions}
                onSelectionChange={onClinicChange}
                width="100%"
                isMulti={true}
                value={selectedClinics}
                showLabel={true}
              />
            </div>
            <InputField
              name="ms_calendar_id"
              label="Microsoft Calendar ID"
              type="text"
              placeholder="Enter Microsoft Calendar ID"
            />

            {/* <SelectField
              name="provider_type"
              label="Provider type"
              options={providerTypeOptions}
            /> */}

            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8 w-full">
              <ImageUploadDisplay
                onImageUpload={(file: File) => setFieldValue("picture", file)}
              />
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:space-x-5 w-full">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Profile picture
                    </p>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs">
                      Recommended picture size: 96 x 96 px or Full HD 1080 x
                      1920.
                    </p>
                  </div>
                  <div className="w-full md:w-2/3 mt-4 md:mt-0">
                    <InputField
                      name="username"
                      label="Username"
                      placeholder="dr.maya"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#33C213] hover:bg-green-500 text-white font-medium py-2 px-6 rounded-md flex items-center space-x-2 disabled:opacity-50"
              >
                <span>
                  {isSubmitting ? "Submitting..." : "Assign Patients"}
                </span>
                {!isSubmitting && (
                  <img
                    src="/Icons/arrow_forward.svg"
                    alt="Forward"
                    className="w-5 h-5"
                  />
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProviderForm;
