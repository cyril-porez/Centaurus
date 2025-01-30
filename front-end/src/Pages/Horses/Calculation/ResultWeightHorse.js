import React, { useEffect, useState } from "react";
import DisplayWeight from "../../../components/DisplayWeight";
import HomeButton from "../../../components/buttons/HomeButton";
import horseApi from "../../../services/horseApi";
import { useNavigate, useParams } from "react-router-dom";

function ResultWeight() {
  const { id } = useParams();
  const [horse, sethorse] = useState({});

  let navigate = useNavigate();

  const navigateResult = () => {
    navigate(`/horses/follow/evolution/weight/table/${id}`, { replace: false });
  };

  const formatDate = (/** @type {string | number | Date} */ dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  async function fetchData() {
    try {
      const horse = await horseApi.getWeightHorse(id);
      horse.body.horse.date = formatDate(horse?.body?.horse.date);
      horse.body.horse.previous_date = formatDate(
        horse.body.horse.previous_date
      );
      sethorse(horse);
      console.log(horse);
    } catch (error) {
      console.error("Erreur lors de la récupération du cheval:", error);
    }
  }

  function signResult() {
    let sign = "";
    if (horse?.body?.horse.weight > horse?.body?.horse.last_weight) {
      sign = "+";
    } else {
      sign = "-";
    }
    return sign;
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-evenly h-full">
      <img
        src="/icons/calcul.png"
        width={50}
        className="absolute top-8 right-8"
        alt="Calculator"
      />
      <h1 className="text-blue-900 text-4xl font-bold text-center">
        <strong>{horse?.body?.horse.name}</strong>
      </h1>
      <h3 className="ml-5 mr-3 text-blue-900 text-3xl italic text-center">
        Son poids le{" "}
        <span className="text-blue-600">{horse?.body?.horse.date + " "}</span>
        est de :
      </h3>

      <DisplayWeight props={{ title: horse?.body?.horse.weight + " kg" }} />
      <h3 className="ml-5 text-2xl text-center">
        Soit {signResult()}
        {horse?.body?.horse.difference_weight} Kg depuis la dernière fois (
        {horse?.body?.horse.previous_date})
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
