import axios from "axios";

let accessToken = null;
export function setAccessToken(token) {
  accessToken = token || null;
}

const BASE = (process.env.REACT_APP_API_URL || "/api").replace(/\/+$/, "");
const client = axios.create({
  baseURL: BASE,
  withCredentials: true,
});
console.log("tets", client.defaults.baseURL);

export const authHeader = (token?: string) =>
  token ? { Authorization: `Bearer ${token.trim()}` } : {};

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
