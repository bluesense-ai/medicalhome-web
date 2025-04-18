import axiosInstance from "../../axios/axiosInstance";
import { Client } from "@microsoft/microsoft-graph-client";

const isTokenExpired = (expirationTime: any) => {
  return new Date() >= new Date(expirationTime);
};

const getExpirationTime = (expires_in: number) => {
  const issuedAt = new Date();
  const expiresIn = expires_in - 10;
  const expirationTime = new Date(issuedAt.getTime() + expiresIn * 1000);
  return expirationTime;
};

export const fetchToken = async () => {
  try {
    let token = sessionStorage.getItem("msAccessToken"); // We get token here
    let tokenExpireTime = sessionStorage.getItem("tokenExpireTime"); //We get the token expire time here
    if (!token || !tokenExpireTime || isTokenExpired(tokenExpireTime)) {
      // All the conditions to check if the token doesn't exist or if it's expired this block fetches a new one
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/bookings/get-ms-token`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        token = response.data.msAccessToken;

        if (token) {
          const expirationTime = getExpirationTime(response.data.expires_in);
          sessionStorage.setItem("msAccessToken", token);
          sessionStorage.setItem(
            "tokenExpireTime",
            expirationTime.toISOString()
          );
        }
      } else {
        console.error(
          "Failed to fetch token from backend:",
          response.statusText
        );
      }
    }
    if (token) {
      return token;
    }
  } catch (error) {
    console.error("Error fetching token:", error);
  }
};

export const getMSClient = () => {
  const msAccessToken = fetchToken();
  if (msAccessToken) {
    const client = Client.init({
      authProvider: (done: any) => {
        done(null, msAccessToken);
      },
    });
    return client;
  }
};
