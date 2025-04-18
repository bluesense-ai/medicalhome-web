const TimeGutterHeader = (props:any) => {
  return (
    <div className="  h-full flex justify-center items-center w-full font-bold text-center">
      <p className="text-[#004f62] text-xs font-semibold font-['Roboto'] leading-tight tracking-tight">
        {props.label || "All day"}
      </p>
    </div>
  );
};

export default TimeGutterHeader;
