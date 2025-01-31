import axios from "axios";
import { URL_WEIGHTS, URL_WEIGHTSS, URL_WEIGHTSSS } from "../config/url_api";

async function addHorseWeihgt(weight, horseId, date) {
  try {
    const response = await axios.post(`${URL_WEIGHTS}/${horseId}`, {
      weight: weight,
      date: date,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

async function getWeightHorseForTable(id) {
  try {
    const response = await axios.get(`${URL_WEIGHTSS}/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
}

async function getWeightHorseForGraph(id) {
  try {
    const response = await axios.get(`${URL_WEIGHTSSS}/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export default {
  addHorseWeihgt,
  getWeightHorseForTable,
  getWeightHorseForGraph,
};
