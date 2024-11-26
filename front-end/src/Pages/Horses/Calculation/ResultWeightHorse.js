import React, { useEffect, useState } from "react";
import DisplayWeight from "../../../components/DisplayWeight";
import HomeButton from "../../../components/buttons/HomeButton";
import horseApi from "../../../services/horseApi";
import { useNavigate, useParams } from "react-router-dom";

function ResultWeight() {
  const { id } = useParams();
  const [horse, sethorse] = useState({ weights: { data: [] } });

  let navigate = useNavigate();

  const navigateResult = () => {
    console.log("test");
    navigate(`/WeightTable/${id}`, { replace: false });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const horse = await horseApi.getWeightHorse(id);
        sethorse(horse);
        console.log(horse);
      } catch (error) {
        console.error("Erreur lors de la récupération du cheval:", error);
      }
    }
    fetchData();
  }, []);

  const splitDate = (dateApi) => {
    if (!dateApi) {
      return "Date non disponible"; // ou toute autre valeur par défaut que vous souhaitez retourner
    }
    const date = dateApi;
    const splitDate = date.split("-");
    const finalDate = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
    return finalDate;
  };

  const calculateDifferenceWeight = () => {
    const weight =
      horse.weights.data[0]?.attributes.weight -
      horse.weights.data[1]?.attributes.weight;
    return weight;
  };

  return (
    <div className="flex flex-col justify-evenly h-full">
      <img
        src="/icons/calcul.png"
        width={50}
        className="absolute top-8 right-8"
      />
      <h1 className="text-blue-900 text-4xl font-bold text-center">
        <strong>{horse.name}</strong>
      </h1>
      <h3 className="ml-5 mr-3 text-blue-900 text-3xl italic text-center">
        Son poids le{" "}
        <span className="text-blue-600">
          [{splitDate(horse.weights.data[0]?.attributes.date)}]
        </span>
        est de :
      </h3>

      <DisplayWeight
        props={{ title: horse.weights.data[0]?.attributes.weight + "kg" }}
      />
      <h3 className="ml-5 text-2xl text-center">
        Soit {calculateDifferenceWeight()} depuis la dernière fois (
        {splitDate(horse.weights.data[1]?.attributes.date)})
      </h3>
      <p className="ml-5">
        En terme de fréquence, pour un cheval “sain” nous recommandons de
        réaliser cette estimation toute les deux semaines si particularité ou
        problème, la répéter toute les semaines
      </p>
      <div className="flex flex-col justify-center items-center">
        <div className="mt-6">
          <input
            type="submit"
            onClick={() => navigateResult()}
            className="bg-blue-500
                hover:bg-blue-700
                text-white
                font-bold
                rounded-full
                shadow-xl
                py-5 w-80
                mx-auto mt-2"
            value="Accéder au suivi"
          />
        </div>
        <div className="mt-5">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}

export default ResultWeight;
