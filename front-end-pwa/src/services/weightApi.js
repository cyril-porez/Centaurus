// @ts-nocheck
import axios from "axios";
import client, { setAccessToken } from "./apiClient";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1";

async function addHorseWeight(horseId, weight, token) {
   try {
    setAccessToken(token)
    const response = await client.post(
      `/horses/${horseId}/weights`,
      {
        weight: weight,
      }//,
      //{ headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
    );
    console.log(response);
    return response;
  } catch (error) {
    return error.response;
  }
}

async function getWeightHorseForTable(
  id,
  token,
  { sort = "desc", compare = true, limit = 6 } = {}
) {
  try {
    setAccessToken(token)
    const response = await client.get(`/horses/${id}/weights`, {
      //withCredentials: true,
      //headers: { Authorization: `Bearer ${token}` },
      params: { sort, compare, limit },
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

async function getWeightHorseForGraph(horseId, token, { sort = "asc" } = {}) {
  try {
    setAccessToken(token)
    const response = await client.get(
      `/horses/${horseId}/weights?`,
      {
        //withCredentials: true,
        //headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { sort },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    return error.response;
  }
}

async function getWeightHorse(
  horseId,
  token,
  { sort = "desc", compare = true, limit = 1 } = {}
) {
  try {
    setAccessToken(token)
    const response = await client.get(
      `/horses/${horseId}/weights`,
      {
        //withCredentials: true,
        //headers: { Authorization: `Bearer ${token}` },
        params: { sort, compare, limit },
      }
    );
    return response;
  } catch (error) {
    console.log(error);

    return error.response.data;
  }
}

const weightApi = {
  addHorseWeight,
  getWeightHorseForTable,
  getWeightHorseForGraph,
  getWeightHorse,
};

export default weightApi;
