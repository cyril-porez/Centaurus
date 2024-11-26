import axios from "axios";
import { URL } from "../config/url_api";
import { Await } from "react-router-dom";

async function addHorseWeihgt(weight, horseId, date) {
  console.log(weight);
  console.log(horseId);
  console.log(date);
  try {
    const response = await axios.post(`${URL}/api/weights/`, {
      data: {
        weight: weight,
        date: date,
        horse: horseId,
      },
    });
    return response;
  } catch (error) {
    console.log("error", error.response);
    return error;
  }
}

export default {
  addHorseWeihgt,
};
