import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

// Define validation schema
const schema = yup.object().shape({
  username: yup.string().required('Username is Required'),
});

const OnboardingAdminForm: React.FC<{
  onSubmit: (data: { username: string; verificationMethod: 'sms' | 'email' }) => Promise<void>;
}> = ({ onSubmit }) => {
  const [verificationMethod, setVerificationMethod] = useState<'sms' | 'email'>('sms');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const handleFormSubmit = async (data: { username: string }) => {
    setIsLoading(true);
    try {
      await onSubmit({ ...data, verificationMethod });
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error submitting form. Please try again.'); // User-friendly alert
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      method="post"
      className="w-full h-auto p-4 bg-white rounded-lg border-2 border-[#33c213] flex-col justify-start items-start gap-4 inline-flex"
    >
      <h1 className="text-[#247401] text-xl font-semibold leading-loose tracking-wider">Log in</h1>

      {/* Verification Method Selection */}
      <div className="w-full">
        <p className="font-roboto text-[#1e1e1e] text-sm font-normal mb-5 leading-[16.80px] tracking-wide">
          Where would you like to get your access code?
        </p>
        <div className="flex w-[70%] justify-between">
          {['sms', 'email'].map((method) => (
            <div key={method} className="flex w-[50%] space-x-3 h-[10%]">
              <input
                type="radio"
                checked={verificationMethod === method}
                onChange={() => setVerificationMethod(method as 'sms' | 'email')}
              />
              <p className="text-[#004f62] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
                {method === 'sms' ? 'Phone Number' : 'Email Address'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Username Input */}
      <div className="w-full flex-col justify-start items-start gap-2 flex">
        <label className="w-full text-[#1e1e1e] text-sm mt-2">Username</label>
        <input
          placeholder="Enter your Username"
          className="w-full px-4 py-3 bg-white rounded-lg border border-[#b1b1b1] text-sm placeholder:text-[#757575]"
          {...register('username')}
        />
        {errors.username && (
          <p className="text-red-600 text-sm mt-2">{errors.username.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="w-full flex justify-between items-center mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full h-[38px] p-3 bg-[#33c213] rounded-lg text-white font-semibold flex justify-center items-center gap-2 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Loading...' : 'Next'}
          {!isLoading && (
            <img
              src="/Icons/WhiteRightArrow.svg"
              alt="Next"
              className="w-4 h-4 md:w-6 md:h-6"
            />
          )}
        </button>
      </div>
    </form>
  );
};

export default OnboardingAdminForm;
