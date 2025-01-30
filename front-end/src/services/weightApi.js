import axios from "axios";
import { URL_WEIGHTS, URL_WEIGHTSS } from "../config/url_api";

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
    console.log(response.data);

    return response.data;
  } catch (error) {
    return error;
  }
}

async function getWeightHorseForGraph(id) {
  try {
    const response = await axios.get(
      `${URL}/api/horses/${id}?populate[weights][sort]=date:asc`
    );
    return response.data.data.attributes;
  } catch (error) {
    return error;
  }
}

export default {
  addHorseWeihgt,
  getWeightHorseForTable,
  getWeightHorseForGraph,
};
