// @ts-nocheck
import React, { useEffect, useState } from "react";
import LineChart from "../../../components/listChart";
import HomeButton from "../../../components/buttons/HomeButton";
import { useParams } from "react-router-dom";
import weightApi from "../../../services/weightApi";
import ContactText from "../../../components/texts/ContactText";
import MailFieldset from "../../../components/texts/ContactMailFieldset";
import { useAuth } from "../../../contexts/AuthContext";

export default function WeightGraph() {
  const { id } = useParams();
  const { token } = useAuth();

  const [name, setName] = React.useState("");
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const json = await weightApi.getWeightHorseForGraph(id, token, {
          sort: "asc", // pour lire de gauche à droite
        });
        console.log(json);

        const h = json?.horse ?? {};
        setName(h.name ?? "");
        setRows(Array.isArray(h.data) ? h.data : []);
      } catch (e) {
        console.error("Erreur chargement poids:", e);
      }
    })();
  }, [id, token]);

  const toWeights = (rows = []) =>
    rows.map((r) => Number(r.weight)).filter(Number.isFinite);

  const toDates = (items = []) =>
    items
      .map((r) => (r?.created_at ? new Date(r.created_at).toISOString() : null))
      .filter(Boolean);

  return (
    <div>
      <h1 className="text-blue-900 text-4xl font-bold text-center">
        <strong>{name}</strong>
      </h1>
      <h3 className="ml-5 mr-3 text-blue-900 text-3xl italic text-center">
        Comment a évolué <span className="text-blue-600">son poids </span>?
      </h3>
      <LineChart weights={toWeights(rows)} date={toDates(rows)} />
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
