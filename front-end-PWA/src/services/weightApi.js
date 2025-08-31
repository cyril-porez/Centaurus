// @ts-nocheck
import axios from "axios";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1";

async function addHorseWeight(horseId, weight, token) {
  console.log("w", weight);
  console.log("t", token);
  console.log("hid", horseId);

  try {
    const response = await axios.post(
      `${BASE}/horses/${horseId}/weights`,
      {
        weight: weight,
      },
      { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
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
    const response = await axios.get(`${BASE}/horses/${id}/weights`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
      params: { sort, compare, limit },
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

async function getWeightHorseForGraph(horseId, token, { sort = "asc" } = {}) {
  try {
    const response = await axios.get(
      `${BASE}/horses/${horseId}/weights?sort=desc`,
      {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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
    const response = await axios.get(
      `${BASE}/horses/${horseId}/weights?sort=desc&compare=true&limit=1`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
        params: { sort, compare, limit },
      }
    );
    return response;
  } catch (error) {
    console.log(error);

    return error.response.data;
  }
}

export default {
  addHorseWeight,
  getWeightHorseForTable,
  getWeightHorseForGraph,
  getWeightHorse,
};
