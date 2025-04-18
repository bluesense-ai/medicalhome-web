const CustomDayEvent = ({ event, services }: { event: any; services: any }) => {
  const serviceName =
    services?.find((service: any) => service.id === event.serviceId)?.name ||
    "Unknown Service";
  if (serviceName === "Unknown Service") {
    
  }
  const addZero = (i: any) => {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  };
  return (
    <div className={`flex flex-col items-start justify-start`}>
      <p className="text-[#f2f8ff]  text-sm font-semibold font-['Roboto'] leading-[14px]">
        {event.customerNotes ? event.customerNotes : serviceName}
      </p>
      <div className="flex flex-col items-center">
        <div className="flex flex-col">
          <p className="text-[#f2f8ff] text-xs font-medium font-['Roboto'] leading-[18.84px] tracking-tight">
            {event.title}
          </p>
          <p className="text-[#f2f8ff] text-xs font-medium font-['Roboto'] leading-[18.84px] tracking-tight">
            {event.healthCardNumber} 
          </p>
        </div>
        <p className="text-[#f2f8ff] text-[9px] font-medium font-['Roboto'] capitalize leading-relaxed tracking-wide">
          {`${addZero(event.start.getHours())} : ${addZero(
            event.start.getMinutes()
          )}
          - ${addZero(event.end.getHours())} : ${addZero(
            event.end.getMinutes()
          )}`}{" "}
        </p>
      </div>
    </div>
  );
};
export default CustomDayEvent;
