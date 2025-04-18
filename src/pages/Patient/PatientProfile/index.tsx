import { createContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "react-avatar-edit";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
// import { useHookFormMask } from "use-mask-input";
import InputMask from "react-input-mask";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

import { setPatient } from "../../../features/Patient/patientSlice";

import PatientNavbar from "../../../components/PatientNavbar";
import axiosInstance from "../../../axios/axiosInstance";
import ProfileSexDropdown from "./components/ProfileSexDropdown";
import Dialog from "../../../components/Dialog";
import Loader from "../../../components/Loader";

export const UserSexContext = createContext<{
  selectedSex: string;
  setSelectedSex: React.Dispatch<React.SetStateAction<string>>;
}>({
  selectedSex: "",
  setSelectedSex: () => {},
});

const PatientProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const patient = useSelector(
    (state: {
      patient: {
        firstName: string;
        middleName: string;
        lastName: string;
        dateOfBirth: string;
        healthCardNumber: string;
        sex: string;
        mobileNumber: string;
        emailAddress: string;
        picture: string;
        pronouns: string;
        address: string;
      };
    }) => state.patient
  );

  const [isVisible, setIsVisible] = useState(false);
  const [maskedValue, setMaskedValue] = useState(
    "*".repeat(patient.healthCardNumber.length)
  );

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;

    // Update maskedValue with stars and reflect visible characters when not in visible mode
    setMaskedValue(isVisible ? value : "*".repeat(value.length));

    // Update the actual value in the patient object (or manage in state)
    patient.healthCardNumber = value; // Ensure this aligns with your app's state management
  };

  const dispatch = useDispatch();

  const schema = yup
    .object()
    .shape({
      firstName: yup.string().required("First name is required"),
      middleName: yup.string(),
      lastName: yup.string().required("Last name is required"),
      emailAddress: yup
        .string()
        .email("Email address must be a valid email")
        .required("Email address is required"),
      mobileNumber: yup.string().required("Mobile Number is required"),
      pronouns: yup.string(),
      address: yup.string().required("Address is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Send form data
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_BACKEND_URL}/patients/patient-update/${
          patient.healthCardNumber
        }`,
        {
          first_name: data.firstName,
          last_name: data.lastName,
          middle_name: data.middleName,
          phone_number: data.mobileNumber,
          email_address: data.emailAddress,
          sex: selectedSex,
          pronouns: data.pronouns,
          address: data.address,
          picture:
            typeof img === "string" && img.startsWith("data:image")
              ? convertBase64ToFile(img, "profile_picture.png")
              : img,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        console.log(response.data.patient);
        dispatch(
          setPatient({
            ...patient,
            firstName: response.data.patient.first_name,
            middleName: response.data.patient.middle_name,
            lastName: response.data.patient.last_name,
            mobileNumber: response.data.patient.phone_number,
            emailAddress: response.data.patient.email_address,
            picture: response.data.patient.picture,
            sex: response.data.patient.sex,
            pronouns: response.data.patient.pronouns,
            address: response.data.patient.address,
          })
        );
        setIsDialogOpen(true);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
      alert("Profile update unsuccessful");
    }
  };

  const [imageSrc, setImageSrc] = useState(
    patient.picture
      ? `${import.meta.env.VITE_CDN_URL}/${import.meta.env.VITE_BUCKET_NAME}/${
          patient.picture
        }`
      : "/images/FileUploadImage.svg"
  );
  const [img, setImg] = useState(
    patient.picture
      ? `${import.meta.env.VITE_CDN_URL}/${import.meta.env.VITE_BUCKET_NAME}/${
          patient.picture
        }`
      : "/images/FileUploadImage.svg"
  );
  const [preview, setPreview] = useState(null); // State for the cropped image preview
  const [showEditor, setShowEditor] = useState(false); // State to toggle avatar editor visibility
  const [selectedSex, setSelectedSex] = useState(patient.sex);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const convertBase64ToFile = (base64String: string, fileName: string) => {
    const [meta, base64Data] = base64String.split(",");
    const mimeType = meta.split(":")[1].split(";")[0];
    const byteString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    // setLoading(true);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    // setLoading(false);
    return new File([uint8Array], fileName, { type: mimeType });
  };

  const onClose = () => {
    setPreview(null);
  };

  const onCrop = (view: any) => {
    setPreview(view);
  };

  const onBeforeFileLoad = (elem: any) => {
    if (elem.target.files[0].size > 2000000) {
      alert("File is too big!");
      elem.target.value = "";
    }
  };

  const formatDate = (inputDate: any) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
      throw new Error("Invalid date format. Expected format: yyyy-mm-dd");
    }
    const [year, month, day] = inputDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const cancelEditing = () => {
    setPreview(null); // Reset the preview if the user cancels
    setShowEditor(false); // Close the editor without saving
  };

  const saveCroppedImage = () => {
    if (preview) {
      // console.log("This is the preview", preview);
      setImg(preview); // Update the displayed image with the cropped version
      setShowEditor(false); // Close the editor after saving
    } else {
      alert("Please crop an image first.");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <UserSexContext.Provider
        value={{
          selectedSex,
          setSelectedSex,
        }}
      >
        <PatientNavbar />
        {/* Avatar Editor modal */}
        {showEditor && (
          <div className="fixed z-30 w-full h-screen flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <Avatar
                width={390}
                height={295}
                onCrop={onCrop}
                onClose={onClose}
                onBeforeFileLoad={onBeforeFileLoad}
                src={imageSrc}
              />
              <div className="w-full mt-2 p-2 flex justify-center items-center gap-4">
                <button
                  className="h-[38px] p-3 bg-[#33c213] rounded-lg border border-[#33c213] justify-center items-center gap-2 inline-flex"
                  onClick={saveCroppedImage}
                >
                  <p className="text-[#f2fff3] text-sm font-semibold font-['Roboto'] leading-[14px]">
                    Save Image
                  </p>
                </button>
                <button
                  className="h-[38px] p-3 bg-gray-500 rounded-lg border border-[#33c213] justify-center items-center gap-2 inline-flex"
                  // onClick={() => setShowEditor(false)}
                  onClick={cancelEditing}
                >
                  <p className="text-[#f2fff3] text-sm font-semibold font-['Roboto'] leading-[14px]">
                    Cancel
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="h-full w-full flex items-start justify-start gap-4">
          <div className="w-[25%] h-auto ml-10 mr-28 flex flex-col items-center pt-28">
            <div className="h-[58.20px] w-48 px-5 py-[15px] bg-[#f2f8ff] shadow-gray-300 shadow-sm rounded-tl-[11px] rounded-tr-[11px] border-b border-[#3499d6]/25 justify-center items-center gap-2.5 inline-flex">
              <p className="text-[#1e1e1e] text-sm font-semibold font-['Roboto'] capitalize leading-normal tracking-tight">
                Personal Information
              </p>
            </div>
            <div
              onClick={() => {
                navigate("/patient-settings/patient-help-and-support");
              }}
              className="h-[58.20px] w-48 px-5 py-[15px] bg-[#f2f8ff] shadow-gray-300 shadow-sm rounded-bl-[11px] rounded-br-[11px] border-b border-[#3499d6]/25 justify-center items-center gap-2.5 inline-flex cursor-pointer"
            >
              <p className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] capitalize leading-normal tracking-tight">
                Help & Support
              </p>
            </div>
          </div>
          <div className="w-[35%] h-auto flex flex-col justify-start pt-28">
            <form // @ts-ignore
              onSubmit={handleSubmit(onSubmit)}
              method="post"
              className="h-full w-full flex flex-col items-start gap-10 mb-20"
            >
              {/* Personal Information block */}
              <div className="w-full h-auto flex flex-col items-start">
                <h1 className="text-black text-2xl font-medium font-['Roboto'] leading-loose tracking-wider mb-4">
                  Personal Information
                </h1>
                <div className="w-full h-auto flex flex-col items-center gap-6">
                  <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                    <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                      First name
                    </label>
                    <input
                      defaultValue={patient.firstName}
                      className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
                      {...register("firstName")}
                    />
                    {errors.firstName?.message && (
                      <p className="text-red-600 text-sm mt-2">
                        {errors.firstName?.message}
                      </p>
                    )}
                  </div>
                  <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                    <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                      Middle name (optional)
                    </label>
                    <input
                      defaultValue={patient.middleName}
                      className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
                      {...register("middleName")}
                    />
                  </div>
                  <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                    <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                      Last name
                    </label>
                    <input
                      defaultValue={patient.lastName}
                      className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
                      {...register("lastName")}
                    />
                    {errors.lastName?.message && (
                      <p className="text-red-600 text-sm mt-2">
                        {errors.lastName?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information block */}

              <div className="w-full h-auto flex flex-col items-center gap-6">
                <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                  <label className="text-[#b3b3b3] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                    Date of Birth
                  </label>
                  <input
                    value={formatDate(patient.dateOfBirth)}
                    className="self-stretch px-4 py-3 h-[44px] bg-[#d9d9d9] text-black/40 rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
                  />
                </div>
                <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                  <label className="text-[#b3b3b3] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                    Health card number
                  </label>
                  <div className="relative w-full">
                    {" "}
                    {/* Wrapper for input and eye icon */}
                    <input
                      type="text" // Always text to allow custom masking
                      value={isVisible ? patient.healthCardNumber : maskedValue}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 h-[44px] bg-[#d9d9d9] text-black/40 rounded-lg border border-[#b1b1b1] text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight pr-10" // Add padding-right for icon space
                    />
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-black"
                    >
                      <img src="/Icons/EyeIcon.svg" alt="Toggle visibility" />
                    </button>
                  </div>
                </div>
                <div className="flex w-full justify-between">
                  <div className="flex flex-col w-[45%] gap-2 justify-start">
                    <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                      Sex
                    </label>
                    {/* <input
                    value={patient.sex}
                    className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
                  /> */}
                    <ProfileSexDropdown />
                  </div>
                  <div className="flex flex-col w-[45%] gap-2 justify-start">
                    <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                      Pronouns
                    </label>
                    <input
                      defaultValue={patient.pronouns}
                      {...register("pronouns")}
                      placeholder="Enter your pronouns"
                      className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
                    />
                  </div>
                </div>
                <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                  <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                    Address
                  </label>
                  <input
                    defaultValue={patient.address}
                    className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
                    {...register("address")}
                  />
                  <p className="text-xs text-[#757575] font-roboto">
                    *123 Maple Street, Toronto, ON M5H 2N2, Canada
                  </p>
                  {errors.address?.message && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.address?.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Information block */}
              <div className="w-full h-auto flex flex-col items-start">
                <h1 className="text-black text-2xl font-medium font-['Roboto'] leading-loose tracking-wider mb-4">
                  Contact Information
                </h1>
                <div className="w-full h-auto flex flex-col items-center gap-6">
                  <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                    <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                      Email
                    </label>
                    <input
                      defaultValue={patient.emailAddress}
                      {...register("emailAddress")}
                      className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
                    />
                    {errors.emailAddress?.message && (
                      <p className="text-red-600 text-sm mt-2">
                        {errors.emailAddress?.message}
                      </p>
                    )}
                  </div>
                  <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                    <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                      Phone number
                    </label>
                    <InputMask
                      mask="+19999999999"
                      defaultValue={patient.mobileNumber}
                      {...register("mobileNumber")}
                      className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
                    />
                    {errors.mobileNumber?.message && (
                      <p className="text-red-600 text-sm mt-2">
                        {errors.mobileNumber?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* User profile block */}
              <div className="w-full h-auto flex flex-col items-start">
                <h1 className="text-black text-2xl font-medium font-['Roboto'] leading-loose tracking-wider mb-4">
                  User profile
                </h1>
                <div className="w-full h-auto flex flex-row items-center gap-6">
                  <div className="self-stretch w-[35%] flex flex-col h-auto justify-start items-center gap-2">
                    {/* Displaying the avatar */}
                    <img
                      className="h-32 w-32 rounded-full border-2 border-black"
                      src={img} // Display default if no image is set
                      // alt="Avatar"
                    />
                    {/* Input file for selecting an image */}
                    <input
                      type="file"
                      accept="image/*"
                      id="actual-btn"
                      onChange={(event) => {
                        if (
                          event.target.files &&
                          event.target.files.length > 0
                        ) {
                          const file = event.target.files[0];
                          setImageSrc(URL.createObjectURL(file));
                          console.log("This is the file", file);
                          setShowEditor(true); // Open editor after selecting an image
                        }
                      }}
                      hidden
                    />
                    {/* Label for file input */}
                    <label
                      htmlFor="actual-btn"
                      className="w-auto h-10 p-2 bg-[#3499d6]/25 rounded-lg border border-[#004f62]/70 justify-center items-center gap-2 inline-flex cursor-pointer"
                    >
                      <img src="/Icons/upload_file.svg" alt="Change" />
                      <p className="text-[#004f62] text-sm font-semibold font-['Roboto'] leading-[14px]">
                        Upload image
                      </p>
                    </label>
                    {/* Avatar Editor Modal */}
                  </div>
                  <div className="self-stretch w-[65%] flex flex-col h-auto justify-center items-start mb-10 gap-2">
                    <h1 className="text-[#016c9d] text-xl font-semibold font-['Roboto'] leading-loose tracking-wider">
                      Profile picture
                    </h1>
                    <p className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                      Uploading a photo of your face to your Medical Home
                      account will help providers when it comes to appointments
                      and appointment scheduling.
                      {/* Some describing text about
                      recommendation of a picture size & format such as: 96 x 96
                      px or Full HD 1080 x 1920 in size. */}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full h-auto flex justify-end">
                <button
                  type="submit"
                  className="w-[124px] h-[38px] p-3 bg-[#33c213] rounded-lg border border-[#33c213] justify-center items-center gap-2 inline-flex"
                >
                  <p className="text-[#f2fff3] text-sm font-semibold font-['Roboto'] leading-[14px]">
                    Save changes
                  </p>
                </button>
              </div>
            </form>
          </div>
        </div>
      </UserSexContext.Provider>
      {isDialogOpen && (
        <div className="fixed inset-0 w-full h-full backdrop-blur-sm flex items-center justify-center z-40">
          <Dialog
            header="Changes saved successfully"
            body="You have successfully made changes to your personal information in your Medical Home account. You can change these again at anytime."
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

export default PatientProfile;
