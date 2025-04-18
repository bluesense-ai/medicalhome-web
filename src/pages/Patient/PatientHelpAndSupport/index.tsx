import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

import PatientNavbar from "../../../components/PatientNavbar";
import Dialog from "../../../components/Dialog";
import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/axiosInstance";
import Loader from "../../../components/Loader";

const PatientHelpAndSupport = () => {
  const navigate = useNavigate();

  const schema = yup
    .object()
    .shape({
      typeOfIssue: yup.string(),
      concern: yup.string(),
      details: yup.string().required("Details are required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { typeOfIssue: "", concern: "", details: "" },
  });

  useEffect(() => {
    reset(); // asynchronously reset your form values
  }, [reset]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const patient = useSelector(
    (state: {
      patient: {
        patientId: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        healthCardNumber: string;
        sex: string;
        mobileNumber: string;
        emailAddress: string;
      };
    }) => state.patient
  );

  const onSubmit = async (data: any) => {
    // event.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/ticket/submit-ticket`,
        {
          typeOfConcern: data.typeOfIssue,
          concern: data.concern,
          details: data.details,
          userId: patient.patientId,
          userType: "patient",
          firstName: patient.firstName,
          lastName: patient.lastName,
          file: file,
          email: patient.emailAddress,
          phoneNumber: patient.mobileNumber,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.success) {
        reset();
        setIsDialogOpen(true);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="h-full w-full flex items-start justify-start gap-4">
        <div className="w-[25%] h-auto ml-10 mr-28 flex flex-col items-center pt-28">
          <div
            onClick={() => {
              navigate("/patient-settings");
            }}
            className="h-[58.20px] w-48 px-5 py-[15px] bg-[#f2f8ff] shadow-gray-300 shadow-sm rounded-tl-[11px] rounded-tr-[11px] border-b border-[#3499d6]/25 justify-center items-center gap-2.5 inline-flex cursor-pointer"
          >
            <p className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] capitalize leading-normal tracking-tight">
              Personal Information
            </p>
          </div>
          <div className="h-[58.20px] w-48 px-5 py-[15px] bg-[#f2f8ff] shadow-gray-300 shadow-sm rounded-bl-[11px] rounded-br-[11px] border-b border-[#3499d6]/25 justify-center items-center gap-2.5 inline-flex">
            <p className="text-[#1e1e1e] text-sm font-semibold font-['Roboto'] capitalize leading-normal tracking-tight">
              Help & Support
            </p>
          </div>
        </div>
        <PatientNavbar />
        <div className="w-[35%] h-auto flex flex-col justify-start pt-28">
          <form
            onSubmit={handleSubmit(onSubmit)}
            method="post"
            className="h-full w-full flex flex-col items-start mb-20"
          >
            <h1 className="text-black text-2xl font-medium font-['Roboto'] leading-loose tracking-wider mb-4">
              Contact Support
            </h1>
            <div className="w-full h-auto flex flex-col items-center gap-6">
              <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                  Email
                </label>
                <input
                  value={patient.emailAddress}
                  readOnly={true}
                  className="self-stretch px-4 py-3 h-[44px] bg-[#d9d9d9] text-black/40 rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight cursor-not-allowed"
                />
              </div>
              <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                  Phone number
                </label>
                <input
                  value={patient.mobileNumber}
                  readOnly={true}
                  className="self-stretch px-4 py-3 h-[44px] bg-[#d9d9d9] text-black/40 rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight cursor-not-allowed"
                />
              </div>
              <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                  Type of issue
                </label>
                <input
                  placeholder="Enter the nature of your issue"
                  className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
                  {...register("typeOfIssue")}
                />
              </div>
              <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                  Concern
                </label>
                <p className="text-[#757575] text-sm font-normal font-['Roboto'] leading-tight">
                  Write in a short sentence or subject what is the nature of
                  your problem or concern.
                </p>
                <input
                  placeholder="Enter the subject of your concern"
                  className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
                  {...register("concern")}
                />
              </div>
              <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                  Details
                </label>
                <textarea
                  id="Details"
                  {...register("details")}
                  placeholder="Enter the details of your concern"
                  className="flex w-full h-20 px-4 py-3 bg-white rounded-lg border border-[#b1b1b1] text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-tight tracking-wide justify-start items-center placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-wide"
                />
                {errors.details?.message && (
                  <p className="text-red-600 text-sm mt-2">
                    {errors.details?.message}
                  </p>
                )}
              </div>
              <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                  Attachments (PNG, JPG, JPEG, PDF):
                </label>
                <input
                  className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, .pdf, .doc"
                  onChange={(event: any) => {
                    const rawFileObject = event.target.files[0];
                    console.log("This is the file object", rawFileObject);
                    setFile(rawFileObject);
                  }}
                />
              </div>
              <button
                type="submit"
                className="self-stretch h-[38px] p-3 bg-[#33c213] rounded-lg border border-[#33c213] justify-center items-center gap-2 inline-flex"
              >
                <p className="text-[#f2fff3] text-sm font-semibold font-['Roboto'] leading-[14px]">
                  Send
                </p>
              </button>
            </div>
          </form>
        </div>
      </div>
      {isDialogOpen && (
        <div className="fixed inset-0 w-full h-full backdrop-blur-sm flex items-center justify-center z-40">
          <Dialog
            header="Ticket Submit Successfully"
            body="You have successfully submitted a ticket to support. We will contact you via email & SMS when the issue has been resolved or if we need further information. "
            optionOne={
              <button
                onClick={() => setIsDialogOpen(false)}
                className="w-auto py-[10px] px-4 gap-2 flex items-start justify-center cursor-pointer"
              >
                <img src="/Icons/BlueLeftArrow.svg" />
                <p className="text-center text-[#016c9d] text-sm font-medium font-['Roboto'] leading-tight tracking-tight">
                  Back
                </p>
              </button>
            }
            optionTwo={
              <button
                onClick={() => navigate("/patient-home")}
                className="w-auto py-[10px] px-4 gap-2 flex items-start justify-center cursor-pointer"
              >
                <img src="/Icons/House.svg" />
                <p className="text-center text-[#016c9d] text-sm font-medium font-['Roboto'] leading-tight tracking-tight">
                  Home
                </p>
              </button>
            }
          />
        </div>
      )}
    </>
  );
};

export default PatientHelpAndSupport;
