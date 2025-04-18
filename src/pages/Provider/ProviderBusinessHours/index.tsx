import { useEffect, useState } from "react";
import ProviderNavbar from "../../../components/ProviderNavbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import axiosInstance from "../../../axios/axiosInstance";
import { toast } from "react-toastify";
const ProviderBusinessHours = () => {
    const [businessHours, setBusinessHours] = useState<{ day: string; day_of_week: number; slots: any[] }[]>([
        { day: "Monday", day_of_week: 1, slots: [] },
        { day: "Tuesday", day_of_week: 2, slots: [] },
        { day: "Wednesday", day_of_week: 3, slots: [] },
        { day: "Thursday", day_of_week: 4, slots: [] },
        { day: "Friday", day_of_week: 5, slots: [] },
        { day: "Saturday", day_of_week: 6, slots: [] },
        { day: "Sunday", day_of_week: 7, slots: [] },
    ]);
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    useEffect(() => {
        const fetchBusinessHours = async () => {
            try {

                setLoading(true);
                const response = await axiosInstance.get(
                    `${import.meta.env.VITE_BACKEND_URL}/business-hours/getBusinessHoursByMemberId/${provider.providerID}`
                );

                const data = response.data || []; // Ensure data exists

                const mappedHours = daysOfWeek.map((day, index) => {
                    const businessDaySlots = data.filter((item: any) => item.day_of_week === index + 1);

                    return {
                        day,
                        day_of_week: index + 1
                        ,
                        slots: businessDaySlots.map((slot: any) => ({
                            id: slot.id,
                            start_time: slot.start_time?.slice(0, 5), // HH:MM format
                            end_time: slot.end_time?.slice(0, 5),
                        })),
                    };
                });
                setLoading(false);
                setBusinessHours(mappedHours);
            } catch (error) {
                setLoading(false);
                // toast.error("Error fetching business hours:");
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessHours();
    }, []);

    // Add a new time slot
    const handleAddSlot = (dayIndex: any) => {

        const newHours = [...businessHours];
        newHours[dayIndex].slots.push({ start_time: "01:00:00", end_time: "01:00:00" });
        setBusinessHours(newHours);


    };

    // Delete a slot
    const handleDeleteSlot = async (dayIndex: any, slotIndex: any) => {

        try {
            const slot = businessHours[dayIndex].slots[slotIndex];

            if (!slot.id) {

                // Remove the slot from the array
                businessHours[dayIndex].slots.splice(slotIndex, 1);

                // Update state if using React state
                setBusinessHours([...businessHours]);
            }
            else {


                // Call API to delete the slot
                await axiosInstance.delete(
                    `${import.meta.env.VITE_BACKEND_URL}/business-hours/deleteBusinessHours/${slot.id}`
                );

                // Update UI after successful deletion
                setBusinessHours((prevHours) => {
                    const updatedHours = [...prevHours];
                    updatedHours[dayIndex].slots = updatedHours[dayIndex].slots.filter(
                        (_, index) => index !== slotIndex
                    );
                    return updatedHours;
                });

                toast.success("Slot deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting slot:", error);
            toast.error("Failed to delete slot. Please try again.");
        }
    };


    // Handle input change
    const handleInputChange = (dayIndex: any, slotIndex: any, field: any, value: any) => {

        const newHours = [...businessHours];
        newHours[dayIndex].slots[slotIndex][field] = value;
        setBusinessHours(newHours);
    };

    // Handle form submission
    const handleSubmit = async (event: any) => {
        event.preventDefault();


        try {
            setLoading(true);
            for (const day of businessHours) {
                for (const slot of day.slots) {
                    let response: any;
                    if (slot.start_time && slot.end_time) {
                        const existingSlot = slot.id; // If slot has an ID, it's an update

                        if (existingSlot) {
                            // Update existing business hour
                            const updatePayload = {
                                start_time: slot.start_time
                                    ? slot.start_time.slice(0, 5) + ":00"
                                    : "00:00:00",
                                end_time: slot.end_time
                                    ? slot.end_time.slice(0, 5) + ":00"
                                    : "00:00:00",
                            };

                            response = await axiosInstance.put(
                                `${import.meta.env.VITE_BACKEND_URL}/business-hours/updateBusinessHours/${existingSlot}`,
                                updatePayload
                            );
                        } else {
                            // Add new business hour
                            const addPayload = {
                                member_id: provider.providerID,
                                member_type: "provider",
                                day_of_week: day.day_of_week,
                                start_time: slot.start_time
                                    ? slot.start_time.slice(0, 5) + ":00"
                                    : "00:00:00",
                                end_time: slot.end_time
                                    ? slot.end_time.slice(0, 5) + ":00"
                                    : "00:00:00",
                            };

                            response = await axiosInstance.post(
                                `${import.meta.env.VITE_BACKEND_URL}/business-hours/addBusinessHours`,
                                addPayload
                            );
                        }

                        if (response.status === 200 || response.status === 201) {

                            setBusinessHours((prev: any) => {
                                const updatedHours = [...prev];
                                if (!slot.id) {
                                    updatedHours[day.day_of_week - 1].slots = updatedHours[day.day_of_week - 1].slots.map((s: any) =>

                                        s.id ? s : { ...s, id: response.data.data.id }

                                    );
                                }
                                return updatedHours;
                            });
                        }
                    }
                }
            }
            setLoading(false);
            // alert("Business hours saved successfully!");
            toast.success("Business hours saved successfully");
            // Reset form
        } catch (error: any) {

            setLoading(false);
            toast.error(error.response.data.message);
        }
    };

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



    // Convert "HH:MM:SS" 24-hour time format to "1 AM", "2 PM" etc.
    const formatTime = (time: any) => {
        if (!time) return "";
        const [hour] = time.split(":");
        const h = Number(hour);
        const period = h >= 12 ? "PM" : "AM";
        const formattedHour = h % 12 || 12; // Convert 0 or 12 to 12 AM/PM
        return `${formattedHour} ${period}`;
    };

    // Convert "1 AM" or "2 PM" to "HH:MM:SS" in 24-hour format
    const convertTo24Hour = (time: any) => {
        const [hour, period] = time.split(" ");
        let h = Number(hour);
        if (period === "PM" && h !== 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        return `${String(h).padStart(2, "0")}:00:00`;
    };


    const generateTimeOptions = () => {
        const options = [];
        for (let i = 1; i <= 12; i++) {
            options.push({ value: `${i} AM`, label: `${i} AM` });
        }
        for (let i = 1; i <= 12; i++) {
            options.push({ value: `${i} PM`, label: `${i} PM` });
        }
        return options;
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
                    <div className="h-[58.20px] w-48 px-5 py-[15px] bg-[#f2f8ff] shadow-gray-300 shadow-sm rounded-bl-[11px] rounded-br-[11px] border-b border-[#3499d6]/25 justify-center items-center gap-2.5 inline-flex">
                        <p className="text-[#1e1e1e] text-sm font-semibold font-['Roboto'] capitalize leading-normal tracking-tight">
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
                    <h5 className="text-2xl font-bold mb-2">Business Hours</h5>
                    <p className="left-[369px] top-[219px] w-[422px] h-[21px] text-black text-[14px] font-['Roboto'] font-normal leading-[120%] tracking-[1.3px]">
                        Enter information about your business hours availability.
                    </p>


                    <form onSubmit={handleSubmit} method="post" className="absolute top-[215px] w-[594px] h-[434px]">
                        <div className="space-y-3">
                            {businessHours.map((row, dayIndex) => (
                                <div key={dayIndex} className="flex items-center">
                                    <span className="w-36 font-medium text-black">{row.day}</span>

                                    {row.slots.length == 0 ? (
                                        <div className="flex items-center w-full">
                                            {/* "Day Off" Box */}
                                            <div className="flex items-center border-2 border-dashed p-2 rounded-md w-full justify-center">
                                                <span className="text-gray-500">Day off</span>
                                            </div>

                                            {/* Plus Button (Outside the "Day Off" div) */}
                                            <button
                                                type="button"
                                                className="border rounded-lg p-2 flex items-center justify-center w-10 h-10 ml-2"
                                                onClick={() => handleAddSlot(dayIndex)}
                                            >
                                                <img src="/Icons/plus_icon.svg" alt="Add" className="w-5 h-5" />
                                            </button>
                                        </div>

                                    ) : (
                                        <div className="flex flex-col w-full">
                                            {row.slots.map((slot, slotIndex) => {

                                                const formattedStart = formatTime(slot.start_time);
                                                const formattedEnd = formatTime(slot.end_time);

                                                return (
                                                    <div key={slotIndex} className="flex items-center space-x-2 mb-2">
                                                        {/* Start Time Dropdown */}
                                                        <select
                                                            value={formattedStart}
                                                            onChange={(e) => handleInputChange(dayIndex, slotIndex, "start_time", convertTo24Hour(e.target.value))}
                                                            className="border p-2 rounded w-1/2"
                                                        >
                                                            {generateTimeOptions().map((option) => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        {/* End Time Dropdown */}
                                                        <select
                                                            value={formattedEnd}
                                                            onChange={(e) => handleInputChange(dayIndex, slotIndex, "end_time", convertTo24Hour(e.target.value))}
                                                            className="border p-2 rounded w-1/2"
                                                        >
                                                            {generateTimeOptions().map((option) => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        {/* Delete Slot Button */}
                                                        {row.slots.length > 0 && (
                                                            <button
                                                                type="button"
                                                                className="border rounded-lg p-2 flex items-center justify-center w-10 h-10"
                                                                onClick={() => handleDeleteSlot(dayIndex, slotIndex)}
                                                            >
                                                                <img src="/Icons/delete_icon.svg" alt="Edit" className="w-5 h-5 text-red-500" />
                                                            </button>
                                                        )}

                                                        {/* Add Slot Button */}
                                                        {slotIndex === 0 && (
                                                            <button
                                                                type="button"
                                                                className="border rounded-lg p-2 flex items-center justify-center w-10 h-10"
                                                                onClick={() => handleAddSlot(dayIndex)}
                                                            >
                                                                {/* <Plus className="w-5 h-5 text-green-600" /> */}
                                                                <img src="/Icons/plus_icon.svg" alt="Edit" className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProviderBusinessHours;
