// @ts-nocheck
import axios from "axios";
import client, { authHeader, setAccessToken } from "./apiClient";

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
  console.log("token length =>", token.length, "prefix =>", token.slice(0,10));
  setAccessToken(token)
  try {
    const response = await client.post(
      `/horses`,
      {
        name: name,
        age: age,
        race: race,
      },
      //{ headers: authHeader(token), withCredentials: true }
    );
    console.log("response =>",response);
    
    return response;
  } catch (error) {
    console.log("AddHorse error =>", error?.response || error);
    return error;
  }
}

async function UpdateHorse(name, age, race, horseId, token) {
  try {
    setAccessToken(token)
    const response = await client.put(
      `/horses/${horseId}`,
      {
        name: name,
        age: parseInt(age, 10),
        race: race,
      }//,
      //{/
      //  withCredentials: true,
      //  headers: { Authorization: `Bearer ${token}` },
      //}
    );
    return response;
  } catch (error) {
    return error.response.data;
  }
}

async function getHorsesByUser({ userId, token }) {
  try {
    setAccessToken(token)
    const response = await client.get(`/users/${userId}/horses`//, 
      //{
    //  headers: { Authorization: `Bearer ${token}` },
    //}
    );
    console.log(response);
    
    return response;
  } catch (error) {
    return error.response;
  }
}

async function getHorse(id, token) {
  try {
    setAccessToken(token)
    const response = await client.get(`/horses/${id}`//, {
      //headers: { Authorization: `Bearer ${token}` },
    //}
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

async function DeleteHorse(id, token) {
  try {
    setAccessToken(token)
    const response = await client.delete(`/horses/${id}`);
  } catch (error) {
    return error.response
  }
}

const horseApi = {
  AddHorse,
  UpdateHorse,
  getHorsesByUser,
  getHorse,
  DeleteHorse,
};

export default horseApi;
