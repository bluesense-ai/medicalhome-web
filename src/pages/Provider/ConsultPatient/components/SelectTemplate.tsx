import React, { useState, useEffect } from "react";
import ReactSelect from "../../../../components/Common/ReactSelect";
import { Template } from "../Template/types/template.type";

interface SelectTemplateProps {
  formValues: any;
  setFormValues: Function;
  saveRecord: Function;
  templates: Template[];
  localSelectedEvent: any
}

const SelectTemplate: React.FC<SelectTemplateProps> = ({
  setFormValues,
  saveRecord,
  templates,
  localSelectedEvent,
}) => {
  const [templateOptions, setTemplateOptions] = useState<any>([]);
  const [selectionChanged, setSelectionChanged] = useState(false);

  useEffect(() => {
    if (templates) {
      templates.forEach((template: Template) => {
        setTemplateOptions((prevOptions: any) => [
          ...prevOptions,
          {...template, value: template.id, label: template.title },
        ]);
      });
    }
  }, [templates]);

  const selectStyles = {
    container: { marginBottom: "40px" },
  };
  const parseMacros = (text: string) => {
    if (!text || !localSelectedEvent) return text;
  
    const macros: Record<string, string | undefined> = {
      "#name": localSelectedEvent.title,
      "#patient": localSelectedEvent.title,
      "#date": new Date(localSelectedEvent.start).toLocaleDateString(),
      "#time": localSelectedEvent.date_time,
      "#service": localSelectedEvent.serviceName,
      "#email": localSelectedEvent.customerEmailAddress,
      "#phone": localSelectedEvent.customerPhone,
      "#healthCard": localSelectedEvent.healthCardNumber,
      "#healthCardNumber": localSelectedEvent.healthCardNumber,
      "#healthcard": localSelectedEvent.healthCardNumber
    };
  
    return text.replace(/#\w+/g, (match) => macros[match] ?? match);
  };

  const onSelectionChange = (option: any) => {
    console.log(option, "..............");

    console.log(localSelectedEvent);
    const subjective = parseMacros(option.subjective);   
    const objective =  parseMacros(option.objective);
    const assessment =  parseMacros(option.assessment);
    const plan =  parseMacros(option.plan);
    const provider_notes =  parseMacros(option.provider_notes);

    setFormValues((prevValues: any) => ({
      ...prevValues,
      subjective: subjective,
      objective: objective,
      assessment: assessment,
      plan: plan,
      providerNotes: provider_notes
    }))
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
        Template
      </label>

      <ReactSelect
        name="template"
        label="Template"
        options={templateOptions}
        onSelectionChange={onSelectionChange}
        width="100%"
        customStyles={selectStyles}
      />
    </>
  );
};

export default SelectTemplate;
