import React, { useEffect, useState } from "react";
import LineChart from "../../../components/listChart";
import HomeButton from "../../../components/buttons/HomeButton";
import { useParams } from "react-router-dom";
import weightApi from "../../../services/weightApi";
import ContactText from "../../../components/texts/ContactText";
import MailFieldset from "../../../components/texts/ContactMailFieldset";

export default function WeightGraph() {
  const { id } = useParams();
  const [horse, sethorse] = useState({
    weight: [],
    name: "",
  });

  const tabWeightsHorse = (horse) => {
    let tabWeightsHorse = [];
    horse?.weight.forEach((tab) => {
      tabWeightsHorse.push(parseInt(tab.weight));
    });
    return tabWeightsHorse;
  };

  const tabWeighDate = (horse) => {
    let tabWeighDate = [];
    horse?.weight.forEach((tab) => {
      tabWeighDate.push(tab.date);
    });
    return tabWeighDate;
  };

  async function fetchData() {
    try {
      const horse = await weightApi.getWeightHorseForGraph(id);
      sethorse((prevHorse) => ({
        ...prevHorse,
        weight: horse.body.horse.data,
        name: horse.body.horse.name,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération du cheval:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-blue-900 text-4xl font-bold text-center">
        <strong>{horse.name}</strong>
      </h1>
      <h3 className="ml-5 mr-3 text-blue-900 text-3xl italic text-center">
        Comment a évolué <span className="text-blue-600">son poids </span>?
      </h3>
      <LineChart weights={tabWeightsHorse(horse)} date={tabWeighDate(horse)} />
      <ContactText />
      <MailFieldset />
      <div className="flex flex-col justify-center items-center">
        <div className="mt-5">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}
