import axios from "axios";
import { URL_WEIGHTS } from "../config/url_api";

async function addHorseWeihgt(weight, horseId, date) {
  try {
    const response = await axios.post(`${URL_WEIGHTS}/${horseId}`, {
      weight: weight,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export default {
  addHorseWeihgt,
};
