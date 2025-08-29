// @ts-nocheck
import axios from "axios";
import { URL_ADD_HORSE, URL, URL_HORSE, URL_WEIGHTS } from "../config/url_api";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1";

/**
 * Route privée: le Bearer est mis ICI dans le service.
 * @param {object} p
 * @param {string} p.name
 * @param {number|string} p.age
 * @param {string} p.race
 * @param {number} [p.userId]   // optionnel si ton back lit l'id depuis le JWT
 * @param {string} p.token      // <-- le JWT à mettre en Bearer
 * @returns {Promise<import('axios').AxiosResponse>}
 */
async function AddHorse(name, age, race, token) {
  console.log(`${name}, ${age}, ${race}`);

  try {
    const response = await axios.post(
      URL_ADD_HORSE,
      {
        name: name,
        age: age,
        race: race,
      },
      { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
    );

    return response;
  } catch (error) {
    return error;
  }
}

async function UpdateHorse(name, age, race, horseId) {
  try {
    const response = await axios.put(`${URL}/horse/${horseId}`, {
      name: name,
      age: parseInt(age, 10),
      race: race,
      fk_user_id: 68,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

async function getHorsesByUser({ userId, token }) {
  try {
    const response = await axios.get(`${BASE}/users/${userId}/horses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

async function getHorse(id) {
  try {
    const response = await axios.get(`${URL_HORSE}/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
}

async function getWeightHorse(id) {
  try {
    const response = await axios.get(`${URL_WEIGHTS}/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);

    return error.response.data;
  }
}

export default {
  AddHorse,
  UpdateHorse,
  getHorsesByUser,
  getHorse,
  getWeightHorse,
};
