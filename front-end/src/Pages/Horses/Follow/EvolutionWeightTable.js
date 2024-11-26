import React, { useEffect, useState } from "react";
import DisplayWeight from "../../../components/DisplayWeight";
import NavigationButton from "../../../components/buttons/NavigationButton";
import HomeButton from "../../../components/buttons/HomeButton";
import horseApi from "../../../services/horseApi";
import { useNavigate, useParams } from "react-router";

function WeightTable() {
  const { id } = useParams();
  const [horse, sethorse] = useState({ weights: { data: [] } });

  let navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/WeightGraph/${id}`, { replace: false });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const horse = await horseApi.getWeightHorseForTable(id);
        sethorse(horse);
      } catch (error) {
        console.error("Erreur lors de la récupération du cheval:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-evenly h-screen">
      <h1 className="text-blue-900 text-4xl font-bold text-center">
        <strong>{horse.name}</strong>
      </h1>
      <h3 className="ml-5 mr-3 text-blue-900 text-3xl italic text-center">
        Comment a évolué <span className="text-blue-600">son poids </span>?
      </h3>

      <div className="mx-auto p-4">
        <table className="border border-black">
          <tbody>
            {horse.weights.data.map((weightEntry) => (
              <tr key={weightEntry.id}>
                <td className="border p-2 border-black w-1/2">
                  {new Date(weightEntry.attributes.date).toLocaleDateString()}
                </td>
                <td className="border p-2 border-black w-1/2">
                  {weightEntry.attributes.weight} kg
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="ml-5 text-[#B88D76]">
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
        <legend className="text-[#B88D76]">mail:</legend>
        <p className="text-[#B88D76]">homalink.app@gmail.com</p>
      </fieldset>
      <div className="flex flex-col justify-center items-center">
        <div className="mt-6">
          <input
            type="submit"
            onClick={() => handleSubmit()}
            className="bg-blue-500
                hover:bg-blue-700
                text-white
                font-bold
                rounded-full
                shadow-xl
                py-5 w-80
                mx-auto mt-2"
            value="Tracer le graphique"
          />
        </div>
        <div className="mt-5">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}

export default WeightTable;
