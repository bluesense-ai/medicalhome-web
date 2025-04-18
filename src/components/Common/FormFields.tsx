import React from 'react';
import { Field, ErrorMessage } from 'formik';

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  disabled?: boolean
}

export const InputField: React.FC<InputFieldProps> = ({disabled, name, label, type = 'text',value, placeholder,className="w-full" }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <Field
      name={name}
      type={type}
      className={`px-3 py-2 border border-gray-300 rounded-md shadow-sm ${className}`}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
    />
    <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
  </div>
);

interface SelectFieldProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({ name, label, options }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <Field
      name={name}
      as="select"
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer"
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Field>
    <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
  </div>
);