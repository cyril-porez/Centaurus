import axios from "axios";
import { URL_LOGIN, URL_REGISTER, URL } from "../config/url_api";

async function register(email, password, pseudo) {
  try {
    const response = await axios.post(URL_REGISTER, {
      username: pseudo,
      email: email,
      password: password,
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.log(error.response.data);

    return error.response.data;
  }
}

async function login(email, password) {
  try {
    const response = await axios.post(URL_LOGIN, {
      email: email,
      password: password,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data);

    return error.response.data;
  }
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
