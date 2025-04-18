import { ReactNode } from "react";

type Dialog = {
  header: string;
  body: string;
  optionOne: ReactNode;
  optionTwo: ReactNode;
};

const Dialog = ({ header, body, optionOne, optionTwo }: Dialog) => {
  return (
    <div className="w-[400px] h-[257px] bg-[#f2fff3] rounded-[28px] flex-col justify-start items-center flex">
      <div className="p-6 h-[60%]">
        <h1 className="text-[#004f62] text-2xl font-normal font-['Roboto'] text-nowrap leading-loose tracking-wide">
          {header}
        </h1>
        <p className="text-[#102600] text-sm font-normal font-['Roboto'] leading-tight tracking-wide">
          {body}
        </p>
      </div>
      <hr className="w-full text-[#016c9d]" />
      <div className="w-full h-[40%] p-6 gap-2 flex justify-end">
        {optionOne}
        {optionTwo}
      </div>
    </div>
  );
};

export default Dialog;
