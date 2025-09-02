// @ts-nocheck
import axios from "axios";
import client from "./apiClient";

const BASE = (process.env.REACT_APP_API_URL || "/api").replace(/\/+$/, "");
async function register(email, password, pseudo) {
  try {    
    const res = await client.post(`/auth/sign-up`, {
      email: email,
      password: password,
      username: pseudo,
    });
    console.log("res",res);
    
    return {
      ok: res.status >= 200 && res.status < 300,
      status: res.status,
      data: res.data,
    };
  } catch (e) {
    return {
      ok: false,
      status: e?.response?.status ?? 0,
      data: e?.response?.data,
    };
  }
}

async function login(email, password) {
  try {
    const response = await axios.post(`${BASE}/auth/sign-in`, {
      email: email,
      password: password,
    });
    console.log(response.data);
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.log(error.response.data);

    return {
      ok: false,
      status: error?.response?.status ?? 0,
      data: error?.response?.data,
      error: error,
    };
  }
}

async function getuser(userId) {
  console.log(URL);
  try {
    const response = await axios.get(`${BASE}/api/users/${userId}`);
    return response.data;
  } catch (error) {}
}

async function logout() {
  try {
    const res = await client.post("/auth/logout");
    return {
      ok: res.status >= 200 && res.status < 300,
      status: res.status,
      data: res.data,
    };
  } catch (e) {
    return {
      ok: false,
      status: e?.response?.status ?? 0,
      data: e?.response?.data,
    };
  }
}

const userApi = {
  register,
  login,
  getuser,
  logout,
};

export default userApi;
