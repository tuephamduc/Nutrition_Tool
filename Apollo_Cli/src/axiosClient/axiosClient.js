import axios from "axios";
import Cookies from "js-cookie";
import dotenv from 'dotenv'
import queryString from "query-string";

dotenv.config();

const url = process.env.REACT_APP_SERVER

const axiosClient = axios.create({
  baseURL: url,
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...

  const userCookie = Cookies.getJSON("userCookie");
  const token = userCookie ? userCookie.token : "";

  config.headers = {
    Authorization: `Bearer ${token}`,
  };

  return config;
});


export default axiosClient;
