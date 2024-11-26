import axios from "axios";
import { URL_HORSES, URL } from "../config/url_api";

async function AddHorse(name, age, race, userId) {
  try {
    const response = await axios.post(URL_HORSES, {
      data: {
        age: age,
        name: name,
        race: race,
        users_permissions_user: userId,
      },
    });

    return response;
  } catch (error) {
    console.log("error", error.response);
    return error;
  }
}

async function UpdateHorse(name, age, race, horseId) {
  try {
    const response = await axios.put(`${URL}/api/horses/${horseId}`, {
      data: {
        age: age,
        name: name,
        race: race,
      },
    });
    return response;
  } catch (error) {
    return error;
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
  try {
    const response = await axios.get(`${URL}/api/horses/${id}`);
    return response.data.data.attributes;
  } catch (error) {
    return error;
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
