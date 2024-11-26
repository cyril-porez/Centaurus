import React, { useEffect, useState } from "react";
import LineChart from "../../../components/listChart";
import HomeButton from "../../../components/buttons/HomeButton";
import { useParams } from "react-router-dom";
import horseApi from "../../../services/horseApi";

export default function WeightGraph() {
  const { id } = useParams();
  const [horse, sethorse] = useState({ weights: { data: [] } });

  const tabWeightsHorse = (horse) => {
    let tabWeightsHorse = [];
    horse?.weights.data.forEach((tab) => {
      tabWeightsHorse.push(parseInt(tab.attributes.weight));
    });
    return tabWeightsHorse;
  };

  const tabWeighDate = (horse) => {
    let tabWeighDate = [];
    horse?.weights.data.forEach((tab) => {
      console.log();
      tabWeighDate.push(tab.attributes.date);
    });
    return tabWeighDate;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const horse = await horseApi.getWeightHorseForGraph(id);
        sethorse(horse);
        console.log(horse);
      } catch (error) {
        console.error("Erreur lors de la récupération du cheval:", error);
      }
    }

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
      <p className="ml-5 mt-5 text-[#B88D76]">
        Nous tenons à te rappeler que le suivi du poids de ton cheval est
        essentiel au suivi de sa santé générale. Cet outil vise à te faciliter
        l’accès à ces données. Si l’état de ton cheval évolue de manière
        significative, contacte ton vétérinaire.
      </p>

      <p className="ml-5 mt-5 text-[#B88D76]">
        Si tu as des questions sur l'utilisation de ces données, tu peux nous
        écrire
      </p>
      <fieldset
        className="ml-5 mt-5 w-1/6 
                        my-2 mx-auto 
                        rounded-full 
                        border
                        border-[#B88D76] 
                        px-8 "
      >
        <legend className=" text-[#B88D76]">mail:</legend>
        <p className=" text-[#B88D76]">homalink.app@gmail.com</p>
      </fieldset>
      <div className="flex flex-col justify-center items-center">
        <div className="mt-5">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}
