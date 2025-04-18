import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
// import { useHookFormMask } from "use-mask-input";
import InputMask from "react-input-mask";

import {
  useState,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import ProviderNavbar from "../../../components/ProviderNavbar";
import { useDispatch, useSelector } from "react-redux";
import { setProvider } from "../../../features/Provider/providerSlice";
import Avatar from "react-avatar-edit";
import { useNavigate } from "react-router-dom";
import ChipInput from "./components/ChipInput";
import axiosInstance from "../../../axios/axiosInstance";
import Loader from "../../../components/Loader";
import ClinicDropdown from "./components/ClinicDropdown";
import Dialog from "../../../components/Dialog";

// Define the type for the medicalGroup property
type MedicalGroup = {
  id: string;
  name: string;
  status: string | null;
  info: string;
  validity_date: string | null;
};

// Define the type for the main clinic object
type Clinic = {
  id: string;
  name: string;
  location: string;
  weekday_hours: string;
  weekend_hours: string;
  contact: string;
  status: "active" | "inactive"; // Use a union type for known statuses
  ms_calendar_id: string | null;
  createdAt: string; // You could use Date if parsing it beforehand
  updatedAt: string; // Same as above, Date type is optional
  medicalGroup: MedicalGroup; // Referencing the MedicalGroup type
};

export const ProviderClinicsContext = createContext<{
  providerClinics: Clinic[];
  setProviderClinics: Dispatch<SetStateAction<Clinic[]>>;
}>({ providerClinics: [] as Clinic[], setProviderClinics: () => {} });

const ProviderProfile = () => {
  const provider = useSelector(
    (state: {
      provider: {
        providerID: string;
        username: string;
        firstName: string;
        middleName: string;
        lastName: string;
        methodOfVerification: string;
        ms_calendar_id: string;
        emailAddress: string;
        mobileNumber: string;
        picture: string;
      };
    }) => state.provider
  );
  const providerPicture = provider.picture?.includes("http")
    ? provider.picture
    : `${import.meta.env.VITE_CDN_URL}/${import.meta.env.VITE_BUCKET_NAME}/${
        provider.picture
      }`;
  const [imageSrc, setImageSrc] = useState(providerPicture);
  const [img, setImg] = useState(providerPicture);
  const [preview, setPreview] = useState(undefined); // State for the cropped image preview
  const [showEditor, setShowEditor] = useState(false); // State to toggle avatar editor visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [providerClinics, setProviderClinics] = useState<Clinic[]>([]);

  useEffect(() => {
    const fetchProviderInfo = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_FETCH_PROVIDER_INFO_ENDPOINT}/${
            provider.providerID
          }`
        );
        if (response) {
          setProviderClinics(response.data.provider.clinics);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // alert("Profile update unsuccessful");
        console.log(error);
      }
    };
    fetchProviderInfo();
  }, [provider.providerID]);

  // const EMAIL_REGX = `^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$`;

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
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const registerWithMask = useHookFormMask(register);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      // Send form data
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_BACKEND_URL}/providers/provider-update/${
          provider.providerID
        }`,
        {
          first_name: data.firstName,
          middle_name: data.middleName,
          last_name: data.lastName,
          phone_number: data.mobileNumber,
          email_address: data.emailAddress,
          picture:
            typeof img === "string" && img.startsWith("data:image")
              ? convertBase64ToFile(img, "profile_picture.png")
              : img,
          clinics:
            providerClinics.length === 0
              ? []
              : providerClinics.map((providerClinic) => providerClinic.id),
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        setIsDialogOpen(true);
        // console.log(response.data.provider);
        dispatch(
          setProvider({
            ...provider,
            firstName: response.data.provider.first_name,
            middleName: response.data.provider.middle_name,
            lastName: response.data.provider.last_name,
            mobileNumber: response.data.provider.phone_number,
            emailAddress: response.data.provider.email_address,
            picture: response.data.provider.picture,
          })
        );
      }
      setLoading(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
    }
  };
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

  const navigate = useNavigate();

  const onClose = () => {
    setPreview(undefined);
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

  const cancelEditing = () => {
    setPreview(undefined); // Reset the preview if the user cancels
    setShowEditor(false); // Close the editor without saving
  };

  const saveCroppedImage = () => {
    if (preview) {
      setImg(preview); // Update the displayed image with the cropped version
      setShowEditor(false); // Close the editor after saving
    } else {
      alert("Please crop an image first.");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <ProviderClinicsContext.Provider
        value={{ providerClinics, setProviderClinics }}
      >
        <ProviderNavbar
          isSidebarOpened={isSidebarOpen}
          setIsSidebarOpened={setIsSidebarOpen}
        />
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
        <div
          className={`h-full w-full flex items-start justify-start gap-4 ${
            isSidebarOpen ? "blur-sm ml-[20%]" : "ml-0"
          }`}
        >
          <div className="w-[25%] h-auto ml-10 mr-28 flex flex-col items-center pt-28">
            <div className="h-[58.20px] w-48 px-5 py-[15px] bg-[#f2f8ff] shadow-gray-300 shadow-sm rounded-tl-[11px] rounded-tr-[11px] border-b border-[#3499d6]/25 justify-center items-center gap-2.5 inline-flex">
              <p className="text-[#1e1e1e] text-sm font-semibold font-['Roboto'] capitalize leading-normal tracking-tight">
                Personal Information
              </p>
            </div>
            <div
              onClick={() => {
                navigate("/provider-settings/provider-help-and-support");
              }}
              className="h-[58.20px] w-48 px-5 py-[15px] bg-[#f2f8ff] shadow-gray-300 shadow-sm border-b border-[#3499d6]/25 justify-center items-center gap-2.5 inline-flex cursor-pointer"
            >
              <p className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] capitalize leading-normal tracking-tight">
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
                      defaultValue={provider.firstName}
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
                      defaultValue={provider.middleName}
                      className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
                      {...register("middleName")}
                    />
                  </div>
                  <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                    <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                      Last name
                    </label>
                    <input
                      defaultValue={provider.lastName}
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
                      defaultValue={provider.emailAddress}
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
                      defaultValue={provider.mobileNumber}
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
                      className="h-32 w-32 rounded-full border-2 border-white-700"
                      src={img} // Display default if no image is set
                      alt="Avatar"
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
                          setShowEditor(true); // Open editor after selecting an image
                          console.log("This is the image", img);
                        }
                      }}
                      hidden
                    />
                    {/* Label for file input */}
                    <label
                      htmlFor="actual-btn"
                      className="w-auto h-10 p-2 bg-[#3499d6]/25 rounded-lg border border-[#004f62]/70 justify-center items-center gap-2 inline-flex cursor-pointer"
                    >
                      <img src="/Icons/change_circle.svg" alt="Change" />
                      <p className="text-[#004f62] text-sm font-semibold font-['Roboto'] leading-[14px]">
                        Upload image
                      </p>
                    </label>
                    {/* Avatar Editor Modal */}
                  </div>
                  <div className="self-stretch w-[65%] flex flex-col h-auto justify-center items-start mb-10 gap-2">
                    <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                      Username
                    </label>
                    <input
                      value={`@${provider.username}`}
                      className="self-stretch px-4 py-3 h-[44px] bg-[#d9d9d9] rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Provider Information block */}
              <div className="w-full h-auto flex flex-col items-start">
                <h1 className="text-black text-2xl font-medium font-['Roboto'] leading-loose tracking-wider mb-4">
                  Provider Information
                </h1>
                <div className="w-full h-auto flex flex-col items-center gap-6">
                  <div className="self-stretch flex flex-col h-auto justify-start items-start gap-2">
                    <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                      Provider type
                    </label>
                    <ChipInput />
                  </div>
                  <div className="self-stretch flex flex-row h-auto justify-between items-start gap-2">
                    <div className="w-[45%] flex  flex-col h-auto justify-start items-start gap-2">
                      <label className="text-[#b3b3b3] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                        Medical group
                      </label>
                      <input
                        readOnly={true}
                        value="PACMC"
                        className="self-stretch px-4 py-3 h-[44px] bg-[#d9d9d9] rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight cursor-not-allowed"
                      />
                    </div>
                    <div className="w-[45%] flex  flex-col h-auto justify-start items-start gap-2">
                      <label className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                        Clinic
                      </label>
                      <ClinicDropdown />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-auto flex justify-end">
                <button
                  type="submit"
                  className="w-[124px] h-[38px] p-3 bg-[#33c213] rounded-lg border border-[#33c213] justify-center items-center gap-2 inline-flex cursor-pointer"
                >
                  <p className="text-[#f2fff3] text-sm font-semibold font-['Roboto'] leading-[14px]">
                    Save changes
                  </p>
                </button>
              </div>
            </form>
          </div>
        </div>
        {loading && <Loader />}
      </ProviderClinicsContext.Provider>
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

export default ProviderProfile;
