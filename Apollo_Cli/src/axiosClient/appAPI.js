import axiosClient from "axiosClient/axiosClient";
import axios from 'axios'
import Cookies from "js-cookie";
import dotenv from 'dotenv'
import { useHistory } from 'react-router-dom';

dotenv.config();
const server = process.env.REACT_APP_SERVER
// export const getWorkerInfo = async () => {
//   return await axiosClient.get(`/worker-info/edit`)
// }

// export const uploadFile = async (id, data) => {
//   const userCookie = Cookies.getJSON("userCookie");
//   const token = userCookie ? userCookie.token : "";
//   return await axios({
//     method: "POST",
//     url: `${getApiUrl()}/admin/upload/${id}`,
//     headers: {
//       "Content-Type": "multipart/form-data",
//       Authorization: `Bearer ${token}`,
//     },
//     data: data,
//   });
// };


export const exportSample = async () => {
  const userCookie = Cookies.getJSON("userCookie");
  const token = userCookie ? userCookie.token : "";

  await axios({
    method: "GET",
    url: `${server}export-sample`,
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,

    },
  }).then((res) => {
    const type = `${res.headers['content-type']}`;
    let blob = new Blob([res.data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Sample");
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
};

export const exportFood = async () => {
  const userCookie = Cookies.getJSON("userCookie");
  const token = userCookie ? userCookie.token : "";
  await axios({
    method: "GET",
    url: `${server}export-food`,
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,

    },
  }).then((res) => {
    const type = `${res.headers['content-type']}`;
    let blob = new Blob([res.data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "FoodNutrition");
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
};