import { useEffect, useState, createContext, useRef } from "react";

import { useSelector } from "react-redux";
import BookingCalendar from "./components/BookingCalendar";
import axiosInstance from "../../../axios/axiosInstance";
import PatientNavbar from "../../../components/PatientNavbar";
import { useLocation } from "react-router-dom";

export interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  picture?: string;
  phone_number: string;
  ms_calendar_id?: string; // Optional if it might not always be present
  username: string;
}

export const PatientHomeContext = createContext<{
  scrollToClinicHoursSection: () => void;
  scrollToOurPhysiciansRef: () => void;
  scrollToContactUsRef: () => void;
  bookAppointment: () => void;
  isPatientRegistered: boolean;
}>({
  scrollToClinicHoursSection: () => {},
  scrollToOurPhysiciansRef: () => {},
  scrollToContactUsRef: () => {},
  bookAppointment: () => {},
  isPatientRegistered: false,
});

const PatientHome = () => {
  const [isBookingPageLoaded, setIsBookingPageLoaded] = useState(false);
  const [openMicrosoftBookings, setOpenMicrosoftBookings] = useState(false);
  const [mapImage, setMapImage] = useState("HopeHealthMap");
  const [timetable, setTimetable] = useState("HopeHealthTimetable");
  const [providerCalendarId, setProviderCalendarId] = useState("");
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [clinic, setClinic] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<
    "walkIn" | "selectProvider"
  >("walkIn");

  const [currentImage, setCurrentImage] = useState(0);
  const location = useLocation();

  const images = [
    "/images/LandingScreenImageOne.svg", // Image 1
    "/images/LandingScreenImageTwo.svg", // Image 2
  ];

  const clinicHoursRef = useRef<HTMLDivElement>(null);
  const ourPhysiciansRef = useRef<HTMLDivElement>(null);
  const contactUsRef = useRef<HTMLDivElement>(null);
  const bookingsRef = useRef<HTMLDivElement>(null);

  const scrollToClinicHoursSection = () => {
    clinicHoursRef.current!.scrollIntoView({ behavior: "smooth" });
    console.log(isPatientRegistered);
  };

  const scrollToOurPhysiciansRef = () => {
    ourPhysiciansRef.current!.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContactUsRef = () => {
    contactUsRef.current!.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (location.state?.scrollToClinicHoursSection) {
      console.log("Clinic hours");
      scrollToClinicHoursSection();
    } else if (location.state?.scrollToOurPhysiciansRef) {
      console.log("Physician");
      scrollToOurPhysiciansRef();
    } else if (location.state?.scrollToContactUsRef) {
      console.log("Contact");
      scrollToContactUsRef();
    } else if (location.state?.bookAppointment) {
      bookAppointment();
    }
  }, [location.state]);

  const patient = useSelector(
    (state: {
      patient: {
        providerId: string;
        providerEmail: string;
        providerPicture: string;
        providerFirstName: string;
        providerLastName: string;
        providerCalendarId: string;
        preferred_clinic_id: string;
        provider: any;
      };
    }) => state.patient
  );
  useEffect(() => {
    console.log(patient);

    if (patient.provider) {
      setProviderCalendarId(patient.provider.ms_calendar_id);
      setSelectedOption("selectProvider");
      setProviders([patient.provider]);
      setSelectedProvider(patient.provider);
      axiosInstance
        .get(
          import.meta.env.VITE_BACKEND_URL +
            "/clinics/" +
            patient.preferred_clinic_id
        )
        .then((response) => {
          const { clinic } = response.data.data;
          setClinic(clinic);
        })
        .catch((error) => {
          console.error("Error fetching providers:", error);
        });
    } else {
      axiosInstance
        .get(
          import.meta.env.VITE_BACKEND_URL +
            "/clinics/" +
            patient.preferred_clinic_id +
            "/providers"
        )
        .then((response) => {
          const { clinic, providers } = response.data.data;
          setProviders(providers);
          setClinic(clinic);
          setSelectedProvider(providers[0]);
          setProviderCalendarId(clinic.ms_calendar_id);
        })
        .catch((error) => {
          console.error("Error fetching providers:", error);
        });
    }
  }, []);

  const isPatientRegistered = patient.provider?.id ? true : false;

  const handleIframeLoad = () => {
    console.log("Iframe loaded");
    setIsBookingPageLoaded(true);
    console.log(patient);
    console.log(isBookingPageLoaded);
  };

  useEffect(() => {
    // Function to switch image every 5 seconds
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage === 0 ? 1 : 0));
    }, 5000); // 5000ms = 5 seconds

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hasReloaded = localStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      // Mark as reloaded
      localStorage.setItem("hasReloaded", "true");
      // Reload the page once
      window.location.reload();
    }

    // Clean up the reload flag on unmount, if needed
    return () => {
      localStorage.removeItem("hasReloaded");
    };
  }, []);

  const handleClick = () => {
    setOpenMicrosoftBookings(true);
    bookingsRef.current!.scrollIntoView({ behavior: "smooth" });
  };
  const bookAppointment = () => {
    handleClick();
  };
  const handleProviderChange = (e: any) => {
    const selectedId = e.target.value;
    const provider = providers.find((prov: any) => prov.id === selectedId);
    if (provider) {
      setSelectedProvider(provider);
      setProviderCalendarId(provider.ms_calendar_id);
    }
  };
  const handleOptionChange = (option: "walkIn" | "selectProvider") => {
    setSelectedOption(option);
    if (option === "walkIn") {
      setProviderCalendarId(clinic.ms_calendar_id); // Set to clinic's calendar ID
    } else {
      setSelectedProvider(providers[0]);
      setProviderCalendarId(providers[0].ms_calendar_id);
    }
  };

  return (
    <PatientHomeContext.Provider
      value={{
        scrollToClinicHoursSection,
        scrollToOurPhysiciansRef,
        scrollToContactUsRef,
        isPatientRegistered,
        bookAppointment,
      }}
    >
      <div className="h-auto w-full flex flex-col overflow-hidden">
        <PatientNavbar />
        {/* <VectorAnimation /> */}
        <section className="w-full h-[688px] flex items-center pl-[125px] justify-center">
          {/* Animation block */}
          <div className="animate-vector-animation absolute -top-[200px] -left-[340px]">
            <img src="/Vector.svg" />
          </div>
          {/* Text block */}
          <div className="flex-col space-y-[15px]">
            <p className="text-[#004f62] text-[34px] m-0 font-medium font-['Roboto'] leading-[42px] tracking-tight">
              Welcome to
              <br />
              <p className="text-[#004f62] text-6xl m-0 font-medium font-['Roboto'] leading-[61px]">
                Your Medical <br /> Home
              </p>
            </p>
            {patient.providerId ? (
              <button
                onClick={handleClick}
                className="lg:h-[38px] lg:p-3 lg:bg-[#33c213]  lg:rounded-lg lg:border-solid lg:border lg:border-[#33c213] lg:justify-center lg:items-center lg:gap-2 lg:inline-flex lg:cursor-pointer"
              >
                <p className="lg:text-[#f2fff3] lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
                  Book appointment
                </p>
              </button>
            ) : (
              <button
                onClick={scrollToOurPhysiciansRef}
                className="lg:h-[38px] lg:p-3 lg:bg-[#33c213]  lg:rounded-lg lg:border-solid lg:border lg:border-[#33c213] lg:justify-center lg:items-center lg:gap-2 lg:inline-flex lg:cursor-pointer"
              >
                <p className="lg:text-[#f2fff3] lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
                  See our providers
                </p>
              </button>
            )}
          </div>
          {/* Image Block */}
          <div className="animate-scale-animation">
            <img
              src={images[currentImage]}
              className="transition-all duration-1000 ease-in-out h-[700px] w-[650px]"
            />
          </div>
        </section>
        <section className="w-full h-auto flex justify-center items-center flex-col bg-[#f4f4f4]">
          <div
            ref={bookingsRef}
            className="flex flex-col w-full items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center rounded-lg p-6 w-80 mt-4">
              <h1 className="text-[#016c9d] text-5xl mb-10 text-nowrap font-medium font-['Roboto'] leading-[56px]">
                Book an Appointment
              </h1>
              <div className="flex mb-4">
                <button
                  onClick={() => handleOptionChange("walkIn")}
                  className={`flex h-12 w-[237px] text-nowrap rounded-l-2xl border border-black/40 justify-center items-center p-1 transition duration-200 ${
                    selectedOption === "walkIn"
                      ? "bg-[#3499d6]/25 text-white"
                      : "bg-white"
                  }`}
                >
                  <p className="text-[#004f62] text-sm font-medium font-['Roboto'] leading-tight tracking-tight">
                    Walk In
                  </p>
                </button>
                <button
                  onClick={() => handleOptionChange("selectProvider")}
                  className={`flex h-12 w-[237px] text-nowrap rounded-r-2xl border border-black/40 justify-center items-center p-2 transition duration-200 ${
                    selectedOption === "selectProvider"
                      ? "bg-[#3499d6]/25 text-white"
                      : "bg-white"
                  }`}
                >
                  <p className="text-[#004f62] text-sm font-medium font-['Roboto'] leading-tight tracking-tight">
                    Select Provider
                  </p>
                </button>
              </div>

              {selectedOption === "selectProvider" && (
                <>
                  {/* <label
                  htmlFor="provider-select"
                  className="block text-lg font-semibold mb-2 text-gray-700"
                >
                  Select Provider:
                </label> */}
                  <select
                    id="provider-select"
                    value={selectedProvider ? selectedProvider.id : ""}
                    onChange={handleProviderChange}
                    className="block w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-sm font-normal font-['Roboto'] leading-tight tracking-tight focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
                  >
                    <option
                      value=""
                      disabled
                      className="text-[#757575] text-sm font-normal font-['Roboto'] leading-tight tracking-tight"
                      selected
                    >
                      Select a provider
                    </option>
                    {providers.map((provider: any) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.first_name} {provider.last_name}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
          {openMicrosoftBookings && (
            <BookingCalendar
              providerCalendarId={providerCalendarId}
              onIframeLoad={handleIframeLoad}
            />
          )}
        </section>
        <section
          ref={clinicHoursRef}
          className={`w-full h-[781px] ${
            timetable === "HopeHealthTimetable"
              ? "bg-hope-health-center"
              : "bg-walmart-clinic"
          } bg-no-repeat bg-cover flex justify-start items-start flex-col space-y-[38px]`}
        >
          <div className="w-full ml-16 justify-start items-start -top-10 mt-16 mb-4">
            {timetable === "HopeHealthTimetable" ? (
              <button
                onClick={() => setTimetable("WalmartClinicTimetable")}
                className="lg:h-auto lg:p-3 bg-[#016c9d] rounded-lg border border-[#016c9d] lg:justify-center lg:items-center lg:gap-2 lg:inline-flex lg:cursor-pointer"
              >
                <img src="/Icons/sync.svg" />
                <p className="lg:text-[#f2fff3] lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
                  Other Clinic Timetable
                </p>
              </button>
            ) : (
              <button
                onClick={() => setTimetable("HopeHealthTimetable")}
                className="lg:h-auto lg:p-3 bg-[#016c9d] rounded-lg border border-[#016c9d] lg:justify-center lg:items-center lg:gap-2 lg:inline-flex lg:cursor-pointer"
              >
                <img src="/Icons/sync.svg" />
                <p className="lg:text-[#f2fff3] lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
                  Other Clinic Timetable
                </p>
              </button>
            )}
          </div>

          {timetable === "HopeHealthTimetable" ? (
            <>
              <h1 className="text-[#f2f8ff] text-5xl flex self-center font-medium font-['Roboto'] leading-[56px]">
                {patient.provider ? (
                  <span className="text-center text-[#f2f8ff] text-5xl font-medium font-['Roboto'] leading-[56px]">
                    <span className="text-[#33c213] text-3xl font-medium font-['Roboto'] leading-loose tracking-wider">
                      Your
                    </span>
                    <br /> Physician's schedule
                  </span>
                ) : (
                  "Hope Health Centre"
                )}
              </h1>
              <div className="w-[379px] place-self-center h-auto space-y-[15px] bg-white/75 rounded-[10px] py-[15px] px-[35px]">
                {/* Use map function for this */}
                <h1 className="flex justify-center m-auto self-center w-full text-[#004f62] text-[34px] font-medium font-['Roboto'] leading-[42px] tracking-tight">
                  {patient.provider ? "Hope Health Centre" : "Hours"}
                </h1>
                <div className="flex flex-col space-y-2 m-auto">
                  <div className="flex justify-between">
                    <p className="text-[#004f62] text-base font-semibold m-0 font-['Roboto'] capitalize leading-normal tracking-tight">
                      Monday
                    </p>
                    <p className="text-[#004f62] text-base font-medium  m-0 font-['Roboto'] leading-tight tracking-wide">
                      9am - 5pm
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#004f62] text-base font-semibold m-0 font-['Roboto'] capitalize leading-normal tracking-tight">
                      Tuesday
                    </p>
                    <p className="text-[#004f62] text-base font-medium m-0 font-['Roboto'] leading-tight tracking-wide">
                      9am - 5pm
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#004f62] text-base font-semibold m-0 font-['Roboto'] capitalize leading-normal tracking-tight">
                      Wednesday
                    </p>
                    <p className="text-[#004f62] text-base font-medium m-0 font-['Roboto'] leading-tight tracking-wide">
                      9am - 5pm
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#004f62] text-base font-semibold m-0 font-['Roboto'] capitalize leading-normal tracking-tight">
                      Thursday
                    </p>
                    <p className="text-[#004f62] text-base font-medium m-0 font-['Roboto'] leading-tight tracking-wide">
                      9am - 5pm
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#004f62] text-base font-semibold m-0 font-['Roboto'] capitalize leading-normal tracking-tight">
                      Friday
                    </p>
                    <p className="text-[#004f62] text-base font-medium m-0 font-['Roboto'] leading-tight tracking-wide">
                      9am - 5pm
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-[#f2f8ff] text-5xl flex self-center font-medium font-['Roboto'] leading-[56px]">
                {patient.provider ? (
                  <span className="text-center text-[#f2f8ff] text-5xl font-medium font-['Roboto'] leading-[56px]">
                    <span className="text-[#33c213] text-3xl font-medium font-['Roboto'] leading-loose tracking-wider">
                      Your
                    </span>
                    <br /> Physician's schedule
                  </span>
                ) : (
                  "Walmart Clinic"
                )}
              </h1>
              <div className="w-[379px] place-self-center h-auto bg-white/75 rounded-[10px] py-[15px] px-[35px]">
                {/* Use map function for this */}
                <h1 className="flex justify-center m-auto self-center w-full text-[#004f62] text-[34px] font-medium font-['Roboto'] leading-[42px] tracking-tight mb-[15px]">
                  {patient.provider ? "Walmart Clinic" : "Hours"}
                </h1>
                <div className="flex flex-col space-y-2 m-auto">
                  <div className="flex justify-between">
                    <p className="text-[#004f62] text-base font-semibold m-0 font-['Roboto'] capitalize leading-normal tracking-tight">
                      Monday
                    </p>
                    <p className="text-[#004f62] text-base font-medium  m-0 font-['Roboto'] leading-tight tracking-wide">
                      9am - 5pm
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#004f62] text-base font-semibold m-0 font-['Roboto'] capitalize leading-normal tracking-tight">
                      Tuesday
                    </p>
                    <p className="text-[#004f62] text-base font-medium m-0 font-['Roboto'] leading-tight tracking-wide">
                      9am - 5pm
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#004f62] text-base font-semibold m-0 font-['Roboto'] capitalize leading-normal tracking-tight">
                      Wednesday
                    </p>
                    <p className="text-[#004f62] text-base font-medium m-0 font-['Roboto'] leading-tight tracking-wide">
                      9am - 5pm
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#004f62] text-base font-semibold m-0 font-['Roboto'] capitalize leading-normal tracking-tight">
                      Thursday
                    </p>
                    <p className="text-[#004f62] text-base font-medium m-0 font-['Roboto'] leading-tight tracking-wide">
                      9am - 5pm
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#004f62] text-base font-semibold m-0 font-['Roboto'] capitalize leading-normal tracking-tight">
                      Friday
                    </p>
                    <p className="text-[#004f62] text-base font-medium m-0 font-['Roboto'] leading-tight tracking-wide">
                      9am - 5pm
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          <button
            onClick={handleClick}
            className="lg:h-[38px] lg:p-3 lg:bg-[#33c213] place-self-center  lg:rounded-lg lg:border-solid lg:border lg:border-[#33c213] lg:justify-center lg:items-center lg:gap-2 lg:inline-flex lg:cursor-pointer"
          >
            <img src="/Icons/Calendar.svg" />
            <p className="lg:text-[#f2fff3] lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
              Book appointment
            </p>
          </button>
        </section>
        <section
          ref={ourPhysiciansRef}
          className="w-full h-[781px] flex justify-center items-center flex-col"
        >
          <h1 className="text-[#016c9d] text-5xl mb-[12px] font-medium font-['Roboto'] leading-[56px]">
            {patient.providerId ? "Your Providers" : "Our Providers"}
          </h1>
          {/* <p className="text-[#102600] text-base font-normal font-['Roboto'] leading-7 mb-[58px] tracking-tight">
          Description
        </p> */}
          <div className="w-auto flex space-x-[35px]">
            {/* Setup map function here and a way so eg if doctor wanted to add physicans so it's not hardcoded */}
            {/* First card */}
            {patient.providerId && (
              <div className="w-auto flex flex-col gap-2">
                <div className="flex h-[300px] gap-4 items-stretch">
                  <div className="h-full w-64 bg-gray-white rounded-[10px] overflow-hidden">
                    <img
                      className="h-full w-full object-contain"
                      src={`${patient.providerPicture}`}
                      // src="/images/DrEgbeyemiPhoto.svg" // works, can be checked by uncommenting this src line
                      alt="Provider"
                    />
                  </div>
                  <div className="h-auto w-[257px] flex items-center justify-center px-[45px] py-[5px] bg-[#004f62] rounded-[10px]">
                    <p className="text-[#f2f8ff] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-tight">
                      {`A brief description about Dr. ${patient.provider.last_name} listing their
                      degrees, accomplishments, their role in the PACMC group.
                      More things about, for example, their values and approach
                      when it comes to medicine as well as what they wants to
                      accomplish for their patients in this clinic.`}
                    </p>
                  </div>
                </div>

                <div className="w-auto h-14 px-[45px] py-[5px] bg-[#004f62] rounded-[10px] flex justify-between items-center">
                  <h1 className="text-[#f2f8ff] m-0 text-lg font-medium font-['Roboto'] leading-normal tracking-wide">
                    {`Dr. ${patient.provider.last_name}`}
                  </h1>
                  <p className="text-[#f2f8ff] text-base font-medium font-['Roboto'] leading-tight tracking-wide">
                    Family Physician
                  </p>
                </div>
              </div>
            )}
            {!patient.providerId && (
              <>
                <div className="w-auto flex flex-col gap-0">
                  <img
                    className="rounded-tl-[10px] rounded-tr-[10px]"
                    src="/images/DrEgbeyemiPhoto.svg"
                  />
                  <div className="w-auto h-14 px-[45px] py-[5px] bg-[#004f62] rounded-bl-[10px] rounded-br-[10px] flex-col justify-center items-center inline-flex">
                    <h1 className="text-[#f2f8ff] m-0 text-lg font-medium font-['Roboto'] leading-normal tracking-wide">
                      Dr. Egbeyemi
                    </h1>
                    <p className="text-[#f7f7f7] m-0 text-[9.04px] font-medium font-['Roboto'] leading-[14.19px] tracking-tight">
                      Family Physician
                    </p>
                  </div>
                </div>
                <div className="w-auto flex flex-col gap-0">
                  <img
                    className="rounded-tl-[10px] rounded-tr-[10px]"
                    src="/images/DrMayaPhoto.svg"
                  />
                  <div className="w-auto h-14 px-[45px] py-[5px] bg-[#004f62] rounded-bl-[10px] rounded-br-[10px] flex-col justify-center items-center inline-flex">
                    <h1 className="text-[#f2f8ff] m-0 text-lg font-medium font-['Roboto'] leading-normal tracking-wide">
                      Dr. Maya
                    </h1>
                    <p className="text-[#f7f7f7] m-0 text-[9.04px] font-medium font-['Roboto'] leading-[14.19px] tracking-tight">
                      Family Physician
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
        <section
          ref={contactUsRef}
          className="w-full h-[781px] flex justify-center items-center flex-col bg-[#004f62]"
        >
          <div className="flex w-full">
            {/* Text block */}
            <div className="flex flex-col m-auto space-y-[40px]">
              {/* Contact subblock */}
              <div className="w-[481px] flex flex-col gap-[18px]">
                <h1 className="text-[#f2f8ff] text-[44px] font-medium m-0 font-['Roboto'] leading-[42px] tracking-tight">
                  Contact
                </h1>
                <div className="flex justify-between">
                  <p className="text-[#f2f8ff] m-0 text-[19px] font-medium font-['Roboto'] leading-tight tracking-wide">
                    Email:{" "}
                    <a
                      className="text-[#9a8dfb] text-[19px] font-normal font-['Roboto'] underline leading-[21px] tracking-tight cursor-pointer z-20"
                      href="mailto:reception@pacmc.com"
                    >
                      reception@pacmc.com
                    </a>
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[#f2f8ff] m-0 text-[19px] font-medium font-['Roboto'] leading-tight tracking-wide">
                      Landline:{" "}
                      <a
                        href="callto:+306-400-9440"
                        className="text-[#9a8dfb] text-[19px] font-normal font-['Roboto'] underline leading-[21px] tracking-tight cursor-pointer z-20"
                      >
                        306-400-9440
                      </a>
                    </p>
                    <p className="text-[#f2f8ff] m-0 text-[19px] font-medium font-['Roboto'] leading-tight tracking-wide">
                      Fax:{" "}
                      <a
                        // href="fax:+1306922003"
                        className="text-[#9a8dfb] text-[19px] font-normal font-['Roboto'] underline leading-[21px] tracking-tight cursor-pointer z-20"
                      >
                        306-922-2003
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              {/* Locations subblock */}
              <div className="w-[481px] flex flex-col gap-[18px]">
                <h1 className="text-[#f2f8ff] text-[44px] font-medium m-0 font-['Roboto'] leading-[42px] tracking-tight">
                  Locations
                </h1>
                <div className="flex w-auto justify-between">
                  <p className="text-[#f2f8ff] text-[19px] font-medium m-0 font-['Roboto'] leading-tight tracking-wider">
                    Hope Health Centre <br />
                    <a
                      className="text-[#9a8dfb] text-[19px] font-normal font-['Roboto'] underline leading-[21px] tracking-tight cursor-pointer"
                      onClick={() => setMapImage("HopeHealthMap")}
                    >
                      1135 Central Avenue <br />
                      Prince Albert, SK S6V 4V7
                    </a>
                  </p>
                  <p className="text-[#f2f8ff] text-[19px] font-medium m-0 font-['Roboto'] leading-tight tracking-wider">
                    Walmart Clinic <br />
                    <a
                      className="text-[#9a8dfb] text-[19px] font-normal font-['Roboto'] underline leading-[21px] tracking-tight cursor-pointer"
                      onClick={() => setMapImage("WalmartClinicMap")}
                    >
                      100 - 800 15th Street East
                      <br />
                      Prince Albert, SK S6V 8E3
                    </a>
                  </p>
                </div>
              </div>
              {/* Socials subblock */}
              <div className="w-[481px] flex justify-between">
                <div className="flex flex-col space-y-[7px]">
                  <h1 className="text-[#f2f8ff] text-[44px] font-medium m-0 font-['Roboto'] leading-[42px] tracking-tight">
                    Socials
                  </h1>
                  <div className="flex w-auto space-x-[24px]">
                    <img src="/Icons/LinkedinIcon.svg" alt="LinkedIn Icon" />
                    <img src="/Icons/XIcon.svg" alt="X Icon" />
                    <img src="/Icons/InstagramIcon.svg" alt="Instagram Icon" />
                    <img src="/Icons/FacebookIcon.svg" alt="Facebook Icon" />
                  </div>
                </div>
                <div className="flex flex-col space-y-[9px]">
                  <h1 className="text-[#f2f8ff] text-[44px] font-medium m-0 font-['Roboto'] leading-[42px] tracking-tight">
                    Attribution
                  </h1>
                  <div className="inline-flex space-x-1">
                    <span className="text-white text-base font-semibold font-['Roboto'] leading-7 tracking-tight">
                      Stock photos from
                    </span>
                    <span className="text-[#9a8dfb] text-base font-semibold font-['Roboto'] leading-7 tracking-tight">
                      Freepik
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Map block */}
            <div className="m-auto">
              <div className="w-[481px] flex flex-col gap-[18px]">
                <h1 className="text-[#f2f8ff] text-[44px] font-medium m-0 font-['Roboto'] leading-[42px] tracking-tight">
                  How to find us
                </h1>
                <div className="flex w-auto">
                  {mapImage === "HopeHealthMap" ? (
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2389.8652288986705!2d-105.7571949228593!3d53.20233318548864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53017a87de0b7e23%3A0xf9622cdafdc3bdff!2s1135%20Central%20Ave%2C%20Prince%20Albert%2C%20SK%20S6V%204V7%2C%20Canada!5e0!3m2!1sen!2suk!4v1726235281837!5m2!1sen!2suk"
                      width="600"
                      height="450"
                      className="border-0"
                      // allowfullscreen=""
                      loading="lazy"
                      // referrerpolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2389.8968619949947!2d-105.73658502285932!3d53.2017658855311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53017a6f2a47366f%3A0xad7b72a0e4dd398d!2s800%2015%20St%20E%2C%20Prince%20Albert%2C%20SK%20S6V%208E3%2C%20Canada!5e0!3m2!1sen!2suk!4v1724772660937!5m2!1sen!2suk"
                      width="600"
                      height="450"
                      className="border-0"
                      //   allowfullscreen=""
                      loading="lazy"
                      //   referrerpolicy="no-referrer-when-downgrade"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="w-full h-[100px] border-t-2 border-t-white border-solid flex justify-between p-3 items-center px-[70px] bg-[#004f62] ">
          <div className=" flex text-[#f2f8ff] text-sm font-semibold space-x- font-['Roboto'] leading-[14px]">
            <a>About this site</a>
            <div className="mx-[12px]">{`\u2022`}</div>
            <a>Privacy</a>
            <div className="mx-[12px]">{`\u2022`}</div>
            <a>Terms and conditions </a>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[#f2f8ff] place-self-end text-sm font-semibold font-['Roboto'] leading-[14px]">
              Copyright © 2024 Medical Home
            </p>
            <div className="flex w-auto text-nowrap items-center">
              <p className="text-white text-xl font-semibold font-['Roboto'] leading-loose tracking-wider">
                Powered by
              </p>
              <img src="/Icons/PolymathLogo.svg" />
              <p className="text-white text-[21px] font-medium font-['Roboto']">
                Polymath
              </p>
              <p className="text-white text-[21px] font-light font-['Roboto']">
                Global
              </p>
            </div>
          </div>
        </footer>
      </div>
    </PatientHomeContext.Provider>
  );
};

export default PatientHome;
