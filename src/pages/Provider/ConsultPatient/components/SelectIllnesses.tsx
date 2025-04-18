import React, { useState, useEffect } from "react";
import ReactSelect from "../../../../components/Common/ReactSelect";
import axiosInstance from "../../../../axios/axiosInstance";

interface SelectIllnessesProps {
  formValues: any;
  setFormValues: Function;
  saveRecord: Function;
}

const SelectIllnesses: React.FC<SelectIllnessesProps> = ({
  formValues,
  setFormValues,
  saveRecord,
}) => {
  const [illnessOptions, setIllnessOptions] = useState<any>([]);
  const [selectionChanged, setSelectionChanged] = useState(false);

  const selectStyles = {
    container: { marginBottom: "40px" },
  };

  useEffect(() => {
    const fetchIllnesses = async () => {
      try {
        const response = await axiosInstance.get(
          import.meta.env.VITE_BACKEND_URL + "/illnesses"
        );
        const options = response.data.map((illness: any) => ({
          value: illness.id,
          label: illness.name,
        }));
        setIllnessOptions((prevOptions: any) => [...prevOptions, ...options]);
        console.log(formValues.illnesses);
      } catch (error) {
        console.error("Error fetching illnesses:", error);
      }
    };
    fetchIllnesses();
  }, []);

  useEffect(() => {
    if (formValues.illnesses?.length > 0) {
      formValues.illnesses.forEach((illness: any) => {
        if (
          !illnessOptions.find((option: any) => option.label === illness.label)
        ) {
          setIllnessOptions((prevOptions: any) => [...prevOptions, illness]);
        }
      });
    }
  }, [formValues.illnesses, illnessOptions]);

  const onSelectionChange = (options: any) => {
    console.log(options, "..............");
    setFormValues((prevValues: any) => ({
      ...prevValues,
      illnesses: options,
    }));
    setSelectionChanged(!selectionChanged);
  };

  useEffect(() => {
    saveRecord();
  }, [selectionChanged]);

  return (
    <>
      <label
        htmlFor="subjective"
        className="text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider"
      >
        Illness
      </label>

      <ReactSelect
        name="illness"
        label="Illness"
        options={illnessOptions}
        onSelectionChange={onSelectionChange}
        value={formValues.illnesses}
        width="100%"
        customStyles={selectStyles}
        isMulti={true}
        allowCustomData={true}
      />
    </>
  );
};

export default SelectIllnesses;
