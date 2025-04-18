const Chip = ({ value }: { value: string }) => {
  return (
    <span className="h-8 p-1 px-2 bg-[#3499d6]/10 rounded-2xl justify-center items-center inline-flex">
      <p className="text-[#004f62] text-sm font-normal font-['Roboto'] leading-tight tracking-tight text-nowrap">
        {value}
      </p>
    </span>
  );
};

export default Chip;
