import axios from "axios";

const ApiRequest = axios.create({
//   baseURL: "http://localhost:4000/api/v1",
  baseURL: "https://backendhajir-blogmanagement.onrender.com/api/v1",
  withCredentials: true,
  // headers: {
  //     'Content-Type': 'multipart/form-data',
  //   },
});

export default ApiRequest;
