import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";

interface AccessCodeFormProps {
  onSubmit: (data: { accessCode: string }) => void;
}

const schema = yup
  .object({
    accessCode: yup.string().required("Access Code is a Required Field"),
  })
  .required();

const AccessCodeAdminForm: React.FC<AccessCodeFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const maskValue = (value: string, type: "sms" | "email"): string => {
    if (!value) return "";

    if (type === "sms") {
      // Keep first 3 digits visible, mask the middle, and show last 2 digits
      return value.replace(
        /^(\+?\d{3})\d*(\d{2})$/,
        (_, start, end) =>
          `${start}${"*".repeat(
            value.length - start.length - end.length
          )}${end}`
      );
    } else {
      // Mask email (show first 3 letters, domain, and last letter of username)
      const [username, domain] = value.split("@");
      if (!domain) return value;

      const visiblePart = username.slice(0, 3);
      const maskedUsername =
        username.length > 4
          ? `${visiblePart}${"*".repeat(username.length - 4)}`
          : `${visiblePart}${"*".repeat(Math.max(0, username.length - 3))}`;

      return `${maskedUsername}@${domain}`;
    }
  };

  const admin = useSelector(
    (state: {
      admin: {
        methodOfVerification: string;
        email: string;
        phone_number: string;
      };
    }) => state.admin
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md p-6 bg-white rounded-lg border-2 border-[#33c213] flex flex-col justify-start items-start gap-4"
    >
      <h1 className="text-[#247401] text-xl font-semibold font-['Roboto'] leading-loose tracking-wider">
        Log in
      </h1>
      <div className="self-stretch h-auto flex flex-col justify-start items-start gap-3">
        <label className="self-stretch text-[#1e1e1e] text-sm font-normal font-['Roboto'] leading-[16.80px] tracking-wider">
          Access Code
        </label>
        <p className="self-stretch text-[#757575] text-sm font-normal font-['Roboto'] leading-tight">
          {`We sent your access code sent to: ${
            admin.methodOfVerification === "sms"
              ? maskValue(admin.phone_number, "sms")
              : maskValue(admin.email, "email")
          }`}
        </p>
        <input
          {...register("accessCode")}
          placeholder="Enter your Access Code"
          maxLength={8}
          className="self-stretch px-4 py-3 bg-white rounded-lg border border-[#b1b1b1] text-sm font-normal font-['Roboto'] leading-tight tracking-tight placeholder:text-[#757575] placeholder:text-sm placeholder:font-normal"
        />
        {errors.accessCode?.message && (
          <p className="text-red-600 text-sm mt-2">
            {errors.accessCode?.message}
          </p>
        )}
      </div>
      <button className="self-stretch p-3 bg-[#33c213] mt-auto h-[38px] rounded-lg border border-[#33c213] flex justify-center items-center cursor-pointer">
        <p className="text-[#f2f8ff] text-sm font-semibold font-['Roboto'] leading-[14px]">
          Log in
        </p>
      </button>
    </form>
  );
};

export default AccessCodeAdminForm;
