import { useEffect, useState } from "react";
import ProviderNavbar from "../../../components/ProviderNavbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

import Dialog from "../../../components/Dialog";
import Loader from "../../../components/Loader";
import axiosInstance from "../../../axios/axiosInstance";
import { matrixService } from "../../../services/matrixService";
import axios, { AxiosError } from "axios";

const ProviderHelpAndSupport = () => {

  const [initialValues, setInitialValues] = useState({
    matrix_id: "",
    matrix_token: "",
    matrix_room_id: "",
  });
  const provider = useSelector(
    (state: {
      provider: {
        providerID: string;
        username: string;
        firstName: string;
        lastName: string;
        methodOfVerification: string;
        ms_calendar_id: string;
        emailAddress: string;
        mobileNumber: string;
      };
    }) => state.provider
  );

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
    reset();
    fetchElementCredentails();// asynchronously reset your form values
  }, [reset]);


  const fetchElementCredentails = async () => {
    try {
      
      setLoading(true)
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_SUPERADMIN_API}/global-variables`
      );
      
      const data = response.data;
      const values = {
        matrix_id: data.find((item: any) => item.key === "matrix_id")?.value || "",
        matrix_token: data.find((item: any) => item.key === "matrix_token")?.value || "",
        matrix_room_id: data.find((item: any) => item.key === "matrix_room_id")?.value || "",
      };
      setInitialValues(values);
     
      setLoading(false);
    } catch (error) {

      console.error("Error fetching element credentails:", error);

      setLoading(false);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {

        }
      }
    }
  };

  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();
  const supportMessage = `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Support Ticket Created – Provider Issue</h2>
  
      <p><strong>Email:</strong> {providerEmail}</p>
      <p><strong>Phone Number:</strong> {providerPhone}</p>
  
      <h3>Issue Details</h3>
      <p><strong>Type of Issue:</strong> {issueType}</p>
      <p><strong>Concern:</strong> {concern}</p>
      <p><strong>Details:</strong> {details}</p>
  
      <p>Please review the ticket and provide assistance as soon as possible.</p>
  </body>
  </html>
  `;




  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_SUPERADMIN_API}/ticket/submit-ticket`,
        {
          typeOfConcern: data.typeOfIssue,
          concern: data.concern,
          details: data.details,
          userId: provider.providerID,
          userType: "Provider",
          firstName: provider.firstName,
          lastName: provider.lastName,
          file: file,
          email: provider.emailAddress,
          phoneNumber: provider.mobileNumber,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.success) {
        reset();
        setIsDialogOpen(true);
        // Example usage with dynamic values
        const filledMessage = supportMessage
          .replace("{issueType}", data.typeOfIssue)
          .replace("{concern}", data.concern)
          .replace("{details}", data.details)
          .replace("{userName}", provider.firstName + " " + provider.lastName)
          .replace("{providerEmail}", provider.emailAddress)
          .replace("{providerPhone}", provider.mobileNumber)

        console.log(filledMessage);
        await matrixService.sendMessage(filledMessage, initialValues?.matrix_id, initialValues?.matrix_token, initialValues?.matrix_room_id);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("Ticket submission unsuccessful");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className={`h-full w-full flex items-start justify-start gap-4`}>
        <div
          className={`w-[25%] h-auto ml-10 mr-28 flex flex-col items-center pt-28 ${isSidebarOpen ? "blur-sm ml-[25%]" : "ml-0"
            }`}
        >
          <div
            onClick={() => {
              navigate("/provider-settings");
            }}
            className="h-[58.20px] w-48 px-5 py-[15px] bg-[#f2f8ff] shadow-gray-300 shadow-sm rounded-tl-[11px] rounded-tr-[11px] border-b border-[#3499d6]/25 justify-center items-center gap-2.5 inline-flex cursor-pointer"
          >
            <p className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] capitalize leading-normal tracking-tight">
              Personal Information
            </p>
          </div>
          <div className="h-[58.20px] w-48 px-5 py-[15px] bg-[#f2f8ff] shadow-gray-300 shadow-sm border-b border-[#3499d6]/25 justify-center items-center gap-2.5 inline-flex">
            <p className="text-[#1e1e1e] text-sm font-semibold font-['Roboto'] capitalize leading-normal tracking-tight">
              Help & Support
            </p>
          </div>
          <div
            onClick={() => {
              navigate("/provider-settings/provider-business-hours");
            }}
            className="h-[58.20px] w-48 px-5 py-[15px] bg-[#f2f8ff] shadow-gray-300 shadow-sm rounded-bl-[11px] rounded-br-[11px] border-b border-[#3499d6]/25 justify-center items-center gap-2.5 inline-flex cursor-pointer"
          >
            <p className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] capitalize leading-normal tracking-tight">
              Business Hours
            </p>
          </div>
        </div>
        <ProviderNavbar
          isSidebarOpened={isSidebarOpen}
          setIsSidebarOpened={setIsSidebarOpen}
        />
        <div
          className={`w-[35%] h-auto flex flex-col justify-start pt-28 ${isSidebarOpen ? "blur-sm" : "ml-0"
            }`}
        >
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
                <p className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                  {provider.emailAddress}
                </p>
              </div>
              <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                  Phone number
                </label>
                <p className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                  {provider.mobileNumber}
                </p>
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
                onClick={() => navigate("/provider-dashboard")}
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

export default ProviderHelpAndSupport;
