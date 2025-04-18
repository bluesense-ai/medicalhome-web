
import { toast } from "react-toastify"; 

export const validateEvent = (
  localSelectedEvent: any,
  consultId: string | null,
  navigate: (path: string, options?: { replace?: boolean }) => void
) => {
  let parsedNumber =localSelectedEvent?.healthCardNumber?.replace(/\D/g, "");
  console.log(parsedNumber);

  // Check if the health card number is invalid
  if (
    (!localSelectedEvent?.healthCardNumber || isNaN(parsedNumber) || !parsedNumber) && 
    !consultId
  ) {
    toast.error("Health Card Not Provided Or Invalid", { autoClose: 3000 });
    toast.error("Redirecting to Provider Dashboard in 5 seconds", {
      autoClose: 5000,
    });
    setTimeout(() => {
      navigate("/provider-dashboard", { replace: true });
    }, 5000);
    return;
  }

  if (/\D/.test(localSelectedEvent?.healthCardNumber)) {
    toast.warning(`User Health Card Number contains non-numeric characters ${parsedNumber}`, {
      autoClose: 5000,
    });
    localSelectedEvent.healthCardNumber = parsedNumber;
  }
};
