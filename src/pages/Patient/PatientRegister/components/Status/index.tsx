const Status = () => {
  // Will need to work on this to make this more programmable as div's creating icons
  return (
    <div className="h-[88px] flex-col justify-start items-center gap-[7px] inline-flex">
      <div className="h-[51px] px-6 py-2.5 bg-[#102600] rounded-[10px] border border-[#102600] justify-start items-center gap-4 inline-flex">
        <div className="justify-center items-center gap-2.5 flex">
          <div className="w-5 h-5 relative">
            <div className="w-5 h-5 left-0 top-0 absolute opacity-25 mix-blend-hard-light bg-[#acfa3b] rounded-full" />
            <div className="w-[15.56px] h-[15.56px] left-[2.22px] top-[2.22px] absolute opacity-40 mix-blend-hard-light bg-[#acfa3b] rounded-full" />
            <div className="w-[11.11px] h-[11.11px] left-[4.44px] top-[4.44px] absolute bg-[#9cf200] rounded-full" />
          </div>
          <div className="w-[246px] h-[24.38px] relative">
            <div className="left-0 top-0 absolute text-[#f2fff3] text-base font-medium font-['Roboto'] leading-normal tracking-wide">
              Status:
            </div>
            <div className="h-6 left-[62px] top-[0.38px] absolute text-[#9cf200] text-base font-medium font-['Roboto'] leading-normal tracking-wide">
              Accepting patients
            </div>
          </div>
        </div>
        <div className="justify-center items-center gap-[9px] flex">
          <div className="text-[#f2fff3] text-base font-medium font-['Roboto'] leading-normal tracking-wide">
            At:
          </div>
          <div className="text-white text-xs font-normal font-['Roboto'] leading-[15px] tracking-wide">
            Walmart Clinic
            <br />
            Hope Health Centre
          </div>
        </div>
      </div>
      <div className="w-[294px] text-[#7c7c7c] text-xs font-normal font-['Roboto'] leading-[15px] tracking-wide">
        If we dont have availability when you register, you will be notified
        when we assign you a new provider.
      </div>
    </div>
  );
};

export default Status;

// Is accepting
{
  /* <div className="h-[51px] px-6 py-2.5 bg-[#102600] rounded-[10px] border border-[#102600] justify-between items-center inline-flex">
  <div className="justify-center items-center gap-2.5 flex">
    <div className="w-5 h-5 relative">
      <div className="w-5 h-5 left-0 top-0 absolute opacity-25 mix-blend-hard-light bg-[#acfa3b] rounded-full" />
      <div className="w-[15.56px] h-[15.56px] left-[2.22px] top-[2.22px] absolute opacity-40 mix-blend-hard-light bg-[#acfa3b] rounded-full" />
      <div className="w-[11.11px] h-[11.11px] left-[4.44px] top-[4.44px] absolute bg-[#9cf200] rounded-full" />
    </div>
    <div className="relative">
      <div className="left-0 top-0 absolute text-[#f2fff3] text-base font-medium font-['Roboto'] leading-normal tracking-wide">
        Status:
      </div>
      <div className="left-[62px] top-0 absolute text-[#9cf200] text-base font-medium font-['Roboto'] leading-normal tracking-wide">
        Accepting patients
      </div>
    </div>
  </div>
  <div className="justify-center items-center gap-[9px] flex">
    <div className="text-[#f2fff3] text-base font-medium font-['Roboto'] leading-normal tracking-wide">
      At:
    </div>
    <div className="text-white text-xs font-normal font-['Roboto'] leading-[15px] tracking-wide">
      Walmart Clinic
      <br />
      Hope Health Center
    </div>
  </div>
</div>; */
}

// Is not accepting
{
  /* <div className="h-[51px] px-6 py-2.5 bg-[#102600] rounded-[10px] border border-[#102600] justify-start items-center gap-[52px] inline-flex">
        <div className="justify-center items-center gap-2.5 flex">
          <div className="w-5 h-5 relative">
            <div className="w-5 h-5 left-0 top-0 absolute opacity-25 mix-blend-hard-light bg-[#e9655a] rounded-full" />
            <div className="w-[15.56px] h-[15.56px] left-[2.22px] top-[2.22px] absolute opacity-40 mix-blend-hard-light bg-[#e9655a] rounded-full" />
            <div className="w-[11.11px] h-[11.11px] left-[4.44px] top-[4.44px] absolute bg-[#cc2b29] rounded-full" />
          </div>
          <div className="w-[246px] h-[24.38px] relative">
            <div className="left-0 top-0 absolute text-[#f2fff3] text-base font-medium font-['Roboto'] leading-normal tracking-wide">
              Status:
            </div>
            <div className="w-[184px] h-6 left-[62px] top-[0.38px] absolute text-[#cc2b29] text-base font-medium font-['Roboto'] leading-normal tracking-wide">
              Not accepting patients
            </div>
          </div>
        </div>
      </div>
      <div className="w-[294px] text-[#7c7c7c] text-xs font-normal font-['Roboto'] leading-[15px] tracking-wide">
        If we dont have availability when you register, you will be notified
        when we assign you a new provider.
      </div> */
}
