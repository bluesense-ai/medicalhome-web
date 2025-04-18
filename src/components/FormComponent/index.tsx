type FormBlock = {
  label: string;
  placeholder: string;
};

type Props = {
  data: FormBlock[];
};

const FormComponent = ({ data }: Props) => {
  return (
    <div className="lg:w-[503px] lg:h-auto lg:p-6 lg:bg-white lg:rounded-lg lg:border-2 lg:border-solid lg:border-[#3499d6] lg:flex-col lg:justify-start lg:items-start lg:gap-[18px] z-10 lg:flex">
      {data.map((item, index) => (
        <div
          key={index}
          className="self-stretch h-auto flex-col justify-start items-start gap-2 flex"
        >
          <label className="self-stretch text-[#1e1e1e] h-[17px] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
            {item.label}
          </label>
          <input
            placeholder={item.placeholder}
            className="self-stretch px-4 py-3 h-[44px] bg-white rounded-lg border border-[#b1b1b1] justify-start items-center inline-flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
          />
        </div>
      ))}
    </div>
  );
};

export default FormComponent;
