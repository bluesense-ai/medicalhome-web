import { SetStateAction, useState } from "react";
import Chip from "../Chip";

const ChipInput = () => {
  const [inputValue, setInputValue] = useState("");

  const [chipsData, setChipsData] = useState(["Family Physician"]);

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setChipsData([...chipsData, inputValue]);
      setInputValue("");
    }
  };

  return (
    <div className="self-stretch px-4 py-1 gap-2 h-auto flex-wrap bg-[#d9d9d9] rounded-lg border border-[#b1b1b1] justify-start items-center flex text-sm font-normal font-['Roboto'] leading-tight tracking-tight cursor-not-allowed">
      {chipsData.map((ChipData) => (
        <Chip value={ChipData} />
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        readOnly={true}
        className="self-stretch bg-[#d9d9d9] outline-none placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal placeholder:font-['Roboto'] placeholder:leading-tight placeholder:tracking-tight"
      />
    </div>
  );
};

export default ChipInput;
