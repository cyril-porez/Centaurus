import React, { useEffect, useState } from "react";

import HomeButton from "../../../components/buttons/HomeButton";
import weightApi from "../../../services/weightApi";
import { useNavigate, useParams } from "react-router";
import Button from "../../../components/buttons/Button";
import ContactText from "../../../components/texts/ContactText";
import MailFieldset from "../../../components/texts/ContactMailFieldset";

function WeightTable() {
  const { id } = useParams();
  const [horse, sethorse] = useState({ weight: [], name: "" });
  let navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/horses/follow/evolution/weight/graph/${id}`, { replace: false });
  };

  const formatDate = (/** @type {string | number | Date} */ dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  async function fetchData() {
    try {
      const horse = await weightApi.getWeightHorseForTable(id);
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
    <div className="flex flex-col justify-evenly h-screen">
      <h1 className="text-blue-900 text-4xl font-bold text-center">
        <strong>{horse?.name}</strong>
      </h1>
      <h3 className="ml-5 mr-3 text-blue-900 text-3xl italic text-center">
        Comment a évolué <span className="text-blue-600">son poids </span>?
      </h3>

      <div className="mx-auto p-4">
        <table className="border border-black">
          <tbody>
            {horse.weight.map((weightEntry) => {
              return (
                <tr key={weightEntry?.date}>
                  <td className="border p-2 border-black w-1/2">
                    {formatDate(weightEntry?.date)}
                  </td>
                  <td className="border p-2 border-black w-1/2">
                    {weightEntry?.weight} kg
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ContactText />
      <MailFieldset />
      <div className="flex flex-col justify-center items-center">
        <div className="mt-6">
          <Button name="Tracer le graphique" onSubmit={() => handleSubmit()} />
        </div>
        <div className="mt-5">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}

export default WeightTable;
