import React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { InputField, SelectField } from "../../../../../components/Common/FormFields";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../../axios/axiosInstance";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { convertToISO8601 } from "../../../ProviderDashboard/local/common/helper";
interface FormValues {
  name: string, default_duration: string, description: string
}

const AddServiceForm: React.FC = () => {
  const provider = useSelector(
    (state: {
      provider: {
        providerID: string;
      };
    }) => state.provider
  );
  const navigate = useNavigate();
  const initialValues: FormValues = {
    name: "", default_duration: "", description: ""
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    default_duration: Yup.string().required("Duration is required"),
    description: Yup.string().nullable("")
  });

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      const formData = new FormData();
      
      Object.entries(values).forEach(([key, value]) => {

        formData.append(key, value);

        console.log(key, value);
      });

      formData.append("provider_id", provider.providerID);
      console.log(formData);
      const response = await axiosInstance.post<any>(
        import.meta.env.VITE_BACKEND_URL + "/services/with-provider",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Service created successfully!", {
          autoClose: 3000,
        });
        if (response.data && response.data.id) {
          navigate(
            `/provider-services`
          );
        } else {
          navigate("/");
        }
      } else {
        toast.error(
          response.statusText ||
          "An error occurred while creating the service",
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
        {({ handleChange, isSubmitting }) => (
          <Form className="space-y-6">
            <InputField
              name="name"
              label="Service Name"
              placeholder="Enter Service Name"
            />
            <SelectField
              name="default_duration"
              label="Service Duration"
              options={Array.from({ length: 12 }, (_, i) => ({
                value: convertToISO8601((i + 1) * 5),  // Convert number to string
                label: `${(i + 1) * 5} min`
              }))}
            />
            <div className="grid grid-cols-1 gap-4">
              <label className="font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Type your message here..."
                className="border border-gray-300 rounded-lg p-3 w-full text-gray-700"
                rows={4}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#33C213] hover:bg-green-500 text-white font-medium py-2 px-6 rounded-md flex items-center space-x-2 disabled:opacity-50"
              >
                <span>
                  {isSubmitting ? "Saving..." : "Save Service"}
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

export default AddServiceForm;
