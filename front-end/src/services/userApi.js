import axios from "axios";
import { URL_LOGIN, URL_REGISTER, URL } from "../config/url_api";

async function register(email, password, pseudo) {
  try {
    const response = await axios.post(URL_REGISTER, {
      username: pseudo,
      email: email,
      password: password,
    });

    return response;
  } catch (error) {
    console.log("error", error.response);
    return error;
  }
}

async function login(email, password) {
  return await axios
    .post(URL_LOGIN, {
      identifier: email,
      password: password,
    })
    .then((response) => response.data)
    .then((data) => {
      window.localStorage.setItem("user", data.jwt);
      return data;
    })
    .catch((error) => {
      console.log("error", error.response);
      return error;
    });
}

async function getuser(userId) {
  try {
    const response = await axios.get(`${URL}/api/users/${userId}`);
    return response.data;
  } catch (error) {}
}

async function logout() {
  localStorage.removeItem("user");
}

export default {
  register,
  login,
  logout,
  getuser,
};
