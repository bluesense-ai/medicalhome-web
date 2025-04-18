const CustomMonthEvent = (event: any) => {
  const addZero = (i: string) => {
    if (Number(i) < 10) {
      i = "0" + i;
    }
    return i;
  };
  const formatName = (patientName: string) => {
    const seperatedPatientName = patientName.split(" ");
    if (
      seperatedPatientName.length === 1 ||
      (seperatedPatientName.length === 2 && seperatedPatientName[1] === "")
    ) {
      return patientName;
    } else {
      const formattedName = `${seperatedPatientName[0][0]}.${
        seperatedPatientName[seperatedPatientName.length - 1]
      }`;
      return formattedName;
    }
  };
  return (
    <div className="flex flex-row items-center justify-between h-full w-full">
      <p className="text-[#f2f8ff] text-xs font-medium font-['Roboto'] capitalize leading-[18.84px] tracking-tight">
        {formatName(event.event.title)}
      </p>
      <p className="text-[#f2f8ff] text-[9px] font-medium font-['Roboto'] capitalize leading-relaxed tracking-wide">
        {`${addZero(event.event.start.getHours())} : ${addZero(
          event.event.start.getMinutes()
        )}
          - ${addZero(event.event.end.getHours())} : ${addZero(
          event.event.end.getMinutes()
        )}`}{" "}
      </p>
    </div>
  );
};

export default CustomMonthEvent;
