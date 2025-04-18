import React, { useState, useEffect } from "react";
import { CheckValidityModalAdmin } from "../../Admin/Common/CheckValidity/CheckValidityModalAdmin";
import { CheckValidityModal } from "./CheckValidityModal";
import axiosInstance from "../../../axios/axiosInstance";
import Loader from "../../Loader";
import { toast } from "react-toastify";
import useAccount from "../Hooks/useAccount";
import {  setIsValid } from "../../../common/globalVariables";

interface Account {
  id: string;
  email: string;
  validity_date: string | null;
  package_id: string | null;
}
interface CheckValidityProps {
  isAdmin?: boolean;
}

const CheckValidity: React.FC<CheckValidityProps> = ({ isAdmin = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);
  const [packages, setSetPackages] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const account = useAccount();
  const [adminAccount, setAdminAccount] = useState<Account>({
    id: "",
    email: "",
    validity_date: null,
    package_id: "",
  });

  const redirectToPayment = (paymentId: string, medicalGroupId: string) => {
    const callbackUrl = `${import.meta.env.VITE_APP_URL}/admin/payments`;
    const queryString = new URLSearchParams();
    queryString.append("callbackUrl", callbackUrl);
    queryString.append("payment_id", paymentId);
    queryString.append("medical_group_id", medicalGroupId);

    location.href = `${
      import.meta.env.VITE_SUPERADMIN_SITE
    }/med-groups/validate?${queryString.toString()}`;
  };

  const createAccount = async (packageItem: any = null) => {
    const data = {
      account,
      package_id: packageItem.id,
    };
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        import.meta.env.VITE_SUPERADMIN_API + "/public/med-groups/create",
        data
      );
      redirectToPayment(
        response.data.payment_id,
        response.data.medicalGroup.id
      );
    } catch (err: any) {
      toast.error(err.response.data.message);
      console.log(err);
    } finally {
      setIsModalOpen(false);
      setLoading(false);
    }
  };

  const createPaymentAndPay = async (packageItem: any = null) => {
    const package_id = packageItem ? packageItem.id : adminAccount.package_id;
    const data = {
      medical_group_id: adminAccount.id,
      package_id,
    };
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        import.meta.env.VITE_SUPERADMIN_API + "/public/payments/create",
        data
      );
      redirectToPayment(response.data.id, adminAccount.id);
    } catch (err: any) {
      toast.error(err.response.data.message);
      console.log(err);
    } finally {
      setIsModalOpen(false);
      setLoading(false);
    }
  };

  const checkValidity = async () => {
    try {
      const response = await axiosInstance.get(
        import.meta.env.VITE_SUPERADMIN_API +
          `/public/med-groups/${account.email}`
      );

      setAdminAccount(response.data.medicalGroup);
      setSetPackages(response.data.packages);
      const adminAccount = response.data.medicalGroup;
      if (adminAccount.validity_date) {
        const validityDate = new Date(adminAccount.validity_date);
        validityDate.setDate(validityDate.getDate() + 1); // adding 1 days buffer

        const currentDate = new Date();
        validityDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        console.log(validityDate, currentDate);
        if (validityDate < currentDate) {
          setIsModalOpen(true);
          setIsValid(false);
        }
      } else {
        setIsValid(false);
        setIsModalOpen(true);

      }
    } catch (err: any) {
      if (err.response.status === 404) {
        setIsRegistered(false);
        setIsModalOpen(true);
        setIsValid(false);
        setSetPackages(err.response.data.packages);
        console.log(err);
      } else {
        setIsModalOpen(false);
      }
    }
  };

  useEffect(() => {
    if (account.email) {
      checkValidity();
    }
  }, [account]);

  const handleSubmit = async () => {
    try {
      if (adminAccount.package_id) {
        createPaymentAndPay();
      } else {
        console.log("no package selected");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const openModal = () => {
  //   setIsModalOpen(true);
  // };
  const handlePay = (packageItem: any) => {
    if (!isRegistered) {
      createAccount(packageItem);
    } else {
      createPaymentAndPay(packageItem);
    }
  };
  const closeModal = () => setIsModalOpen(false);
  return (
    <>
      <div>
        {isAdmin ? (
          <CheckValidityModalAdmin
            isOpen={isModalOpen}
            isRegistered={isRegistered}
            packages={packages}
            onClose={closeModal}
            onAlternativeAction={closeModal}
            onConfirm={handleSubmit}
            handlePay={handlePay}
            adminAccount={adminAccount}
          />
        ) : (
          <CheckValidityModal
            isOpen={isModalOpen}
            isRegistered={isRegistered}
            packages={packages}
            onClose={closeModal}
            adminAccount={adminAccount}
          />
        )}
      </div>
      {loading && <Loader />}
    </>
  );
};

export default CheckValidity;
