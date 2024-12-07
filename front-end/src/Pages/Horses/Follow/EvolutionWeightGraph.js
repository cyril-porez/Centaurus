import React, { useEffect, useState } from "react";
import LineChart from "../../../components/listChart";
import HomeButton from "../../../components/buttons/HomeButton";
import { useParams } from "react-router-dom";
import horseApi from "../../../services/horseApi";
import ContactText from "../../../components/texts/ContactText";
import MailFieldset from "../../../components/texts/ContactMailFieldset";

export default function WeightGraph() {
  // const { id } = useParams();
  // const [horse, sethorse] = useState({
  //   /*weights: { data: [] }*/
  // });

  // const tabWeightsHorse = (horse) => {
  //   let tabWeightsHorse = [];
  //   horse?.weights.data.forEach((tab) => {
  //     tabWeightsHorse.push(parseInt(tab.attributes.weight));
  //   });
  //   return tabWeightsHorse;
  // };

  // const tabWeighDate = (horse) => {
  //   let tabWeighDate = [];
  //   horse?.weights.data.forEach((tab) => {
  //     console.log();
  //     tabWeighDate.push(tab.attributes.date);
  //   });
  //   return tabWeighDate;
  // };

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const horse = await horseApi.getWeightHorseForGraph(id);
  //       sethorse(horse);
  //       console.log(horse);
  //     } catch (error) {
  //       console.error("Erreur lors de la récupération du cheval:", error);
  //     }
  //   }

  //   fetchData();
  // }, []);

  return (
    <div>
      <h1 className="text-blue-900 text-4xl font-bold text-center">
        <strong>{/*horse.name*/}</strong>
      </h1>
      <h3 className="ml-5 mr-3 text-blue-900 text-3xl italic text-center">
        Comment a évolué <span className="text-blue-600">son poids </span>?
      </h3>
      {/* <LineChart
        weights={
          {
            tabWeightsHorse(horse)
          }
        }
        date={
          {
            tabWeighDate(horse)
          }
        }
      /> */}
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
