import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "ht tp://localhost:8080/api/v1",
  withCredentials: true,
});
console.log("tets", client.defaults.baseURL);
export default client;
