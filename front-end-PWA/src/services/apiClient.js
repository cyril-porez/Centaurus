import axios from "axios";

let accessToken = null;
export function setAccessToken(token) {
  accessToken = token || null;
}

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "ht tp://localhost:8080/api/v1",
  withCredentials: true,
});
console.log("tets", client.defaults.baseURL);

client.interceptors.request.use((config) => {
  const hdrs = config.headers || {};
  if (accessToken) {
    if (typeof hdrs.set === "function") {
      hdrs.set("Authorization", `Bearer ${accessToken}`);
    } else {
      hdrs["Authorization"] = `Bearer ${accessToken}`;
    }
  } else {
    if (typeof hdrs.set === "function") {
      hdrs.set("Authorization", "");
    } else if ("Authorization" in hdrs) {
      delete hdrs["Authorization"];
    }
  }
  config.headers = hdrs;
  return config;
});

export default client;
