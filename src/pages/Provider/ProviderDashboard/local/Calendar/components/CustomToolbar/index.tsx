import moment from "moment";
import { useState } from "react";
import { Navigate, ToolbarProps } from "react-big-calendar";

const CustomToolbar = (props: ToolbarProps) => {
  const [viewState, setViewState] = useState("day");

  // console.log(props);

  const goToDayView = () => {
    props.onView("day");
    setViewState("day");
  };
  const goToWeekView = () => {
    props.onView("week");
    setViewState("week");
  };
  const goToMonthView = () => {
    props.onView("month");
    setViewState("month");
  };
  const goToBack = () => {
    props.onNavigate(Navigate.PREVIOUS);
  };
  const goToNext = () => {
    props.onNavigate(Navigate.NEXT);
  };
  const goToToday = () => {
    props.onNavigate(Navigate.TODAY);
  };

  return (
    <div className="rbc-toolbar h-20 bg-[#004f62] rounded-lg flex items-center">
      <a
        onClick={goToToday}
        className="today-label lg:h-12 my-auto ml-10 mr-auto w-32 items-center gap-4 flex border-none lg:rounded-lg lg:border-solid border-0 lg:cursor-pointer"
      >
        <img src="/Icons/Calendar.svg" />
        <p className="lg:text-[#f2fff3] lg:text-sm lg:font-semibold lg:font-['Roboto'] lg:leading-[14px]">
          Today
        </p>
      </a>
      <div className="m-auto flex items-center">
        <a
          className="border-none border-0 bg-none p-0 cursor-pointer"
          onClick={goToBack}
        >
          <img src="/Icons/NavigateBefore.svg" />
        </a>
        {viewState === "day" || props.view === "day" ? (
          <label className="text-[#f2f8ff] text-2xl font-bold font-['Roboto'] leading-7">
            {`${moment(props.date).format("dddd")}, ${moment(props.date).format(
              "MMM"
            )} ${moment(props.date).format("D")}`}
          </label>
        ) : (
          ""
        )}
        {viewState === "week" && props.view !== "day" ? (
          <label className="text-[#f2f8ff] text-2xl font-bold font-['Roboto'] leading-7">
            {/* Check if start and end month are the same */}
            {`${moment(props.date).startOf("week").format("MMM")} ${moment(
              props.date
            )
              .startOf("week")
              .format("D")} - ${
              moment(props.date).startOf("week").month() ===
              moment(props.date).endOf("week").month()
                ? moment(props.date).endOf("week").format("D")
                : `${moment(props.date).endOf("week").format("MMM")} ${moment(
                    props.date
                  )
                    .endOf("week")
                    .format("D")}`
            }`}
          </label>
        ) : (
          ""
        )}
        {viewState === "month" && props.view !== "day" ? (
          <label className="text-[#f2f8ff] text-2xl text-center font-bold font-['Roboto'] leading-7">
            {moment(props.date).format("MMMM")}
            <br />
            <span className="text-[#f2f8ff] text-sm font-semibold font-['Roboto'] capitalize leading-normal tracking-tight">
              {moment(props.date).format("YYYY")}
            </span>
          </label>
        ) : (
          ""
        )}
        <a
          className="border-none border-0 bg-none p-0 cursor-pointer"
          onClick={goToNext}
        >
          <img src="/Icons/NavigateNext.svg" />
        </a>
      </div>
      <div className="my-auto ml-auto mr-[45px] flex items-center">
        <a
          className={`${
            viewState === "day" ? "text-[#9cf200]" : "text-[#f2f8ff]"
          } p-3 text-sm font-semibold font-['Roboto'] leading-[14px] cursor-pointer`}
          onClick={goToDayView}
        >
          Day
        </a>
        <a
          className={`${
            viewState === "week" ? "text-[#9cf200]" : "text-[#f2f8ff]"
          } p-3 text-sm font-semibold font-['Roboto'] leading-[14px] cursor-pointer`}
          onClick={goToWeekView}
        >
          Week
        </a>
        <a
          className={`${
            viewState === "month" ? "text-[#9cf200]" : "text-[#f2f8ff]"
          } p-3 text-sm font-semibold font-['Roboto'] leading-[14px] cursor-pointer`}
          onClick={goToMonthView}
        >
          Month
        </a>
      </div>
    </div>
  );
};

export default CustomToolbar;
