import axios from "axios";
import { URL_ADD_HORSE, URL, URL_HORSE } from "../config/url_api";

async function AddHorse(name, age, race, userId) {
  console.log(
    `name => ${name}\nage => ${age}\nrace => ${race}\nuserId => ${userId}`
  );

  try {
    const response = await axios.post(URL_ADD_HORSE, {
      name: name,
      age: parseInt(age, 10),
      race: race,
      fk_user_id: userId,
    });
    return response.data;
  } catch (error) {
    console.log("error", error);
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

async function getHorseByUser(id) {
  try {
    const response = await axios.get(
      `${URL}/api/users/${id}?populate[0]=horses`
    );
    return response.data;
  } catch (error) {
    console.log("error", error.response.data);
    return error;
  }
}

async function getHorse(id) {
  console.log(id);
  try {
    const response = await axios.get(`${URL_HORSE}/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

async function getWeightHorse(id) {
  try {
    const response = await axios.get(
      `${URL}/api/horses/${id}?populate[weights][sort]=date:desc&populate[weights][limit]=2`
    );
    return response.data.data.attributes;
  } catch (error) {
    return error;
  }
}

async function getWeightHorseForTable(id) {
  try {
    const response = await axios.get(
      `${URL}/api/horses/${id}?populate[weights][sort]=date:desc&populate[weights][limit]=6`
    );
    return response.data.data.attributes;
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
  AddHorse,
  UpdateHorse,
  getHorseByUser,
  getHorse,
  getWeightHorse,
  getWeightHorseForTable,
  getWeightHorseForGraph,
};
