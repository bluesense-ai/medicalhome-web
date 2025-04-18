import { useState, useEffect } from "react";
import axiosInstance from "../../../axios/axiosInstance";

interface Account {
  email: string;
  validity_date: string | null;
  name: string;
}

const useAccount = () => {
  const [account, setAccount] = useState<Account>({
    email: "",
    validity_date: null,
    name: "",
  });

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await axiosInstance.get(
          import.meta.env.VITE_BACKEND_URL + "/med-groups/account"
        );
        setAccount(response.data);
      } catch (error) {
        console.error("Error fetching account:", error);
      }
    };
    fetchAccount();
  }, []);

  return account;
};

export default useAccount;
