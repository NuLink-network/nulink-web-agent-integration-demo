import Axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import axiosRetry from "axios-retry";
import { API_URL } from "@/config";
import { useNotificationStore } from "@/stores/notifications";


const username = process.env.REACT_APP_SERVER_USERNAME;
const password = process.env.REACT_APP_SERVER_PASSWORD;

function authRequestInterceptor(config: AxiosRequestConfig) {
  const token = Buffer.from(`${username}:${password}`, "utf8").toString(
    "base64"
  );
  config!.headers!.authorization = `Basic ${token}`;
  return config;
}

export const axios = Axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

axiosRetry(axios, {
  retries: 5,
  retryDelay: (retryCount) => {
    return /* retryCount * */ 1000;
  },
  retryCondition: (error) => {
    try {
      return [502, 503, 504].includes(error?.response?.status as number);
    } catch (e) {
      return false;
    }
  },
});

//request interceptors
axios.interceptors.request.use(authRequestInterceptor, function (error) {
  //When the request is wrong
  console.log(error);
  return Promise.reject(error);
});
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    useNotificationStore.getState().addNotification({
      type: "error",
      title: "Error",
      message,
    });

    return Promise.reject(error);
  },
);
