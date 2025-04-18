// axiosInstance.js
import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create();

// Add a request interceptor to append the token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token"); // Get token from localStorage
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // If the response is successful, just return the response
    return response;
  },
  (error) => {
    // Check if the error response status is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // Redirect to login page
      const currentUrl = location.href; 
      if (currentUrl.includes("/consult?id=")) {
          const redirectUrl = encodeURIComponent(currentUrl);
          window.location.href = `${import.meta.env.VITE_APP_URL}/onboarding/provider-login?redirect=${redirectUrl}`;
        }else{
          window.location.href= "/";
        }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
