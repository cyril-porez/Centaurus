// @ts-nocheck
import React, { useEffect, useState } from "react";
import LineChart from "../../../components/listChart";
import HomeButton from "../../../components/buttons/HomeButton";
import { useParams } from "react-router-dom";
import weightApi from "../../../services/weightApi";
import ContactText from "../../../components/texts/ContactText";
import MailFieldset from "../../../components/texts/ContactMailFieldset";
import { useAuth } from "../../../contexts/AuthContext";
import BottomNav from "../../../components/BottomNav";

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
    <div
      className="
      flex justify-center
      min-h-[100svh]
      px-4
      pt-[max(env(safe-area-inset-top),1rem)]
      pb-[calc(max(env(safe-area-inset-bottom),0.75rem)+5rem)]
    "
    >
      <div className="w-full max-w-[360px]">
        <h1 className="text-centaurus-oxford-blue text-4xl font-bold text-center">
          <strong>{name}</strong>
        </h1>
        <h3 className="mt-1 text-centaurus-oxford-blue text-2xl italic text-center">
          Comment a évolué{" "}
          <span className="text-centaurus-dark-cerelean">son poids</span> ?
        </h3>

        {/* Graphique responsive */}
        <div className="mt-4">
          {/* si ton composant accepte className/height, sinon adapte */}
          <LineChart
            weights={toWeights(rows)}
            date={toDates(rows)}
            className="w-full"
            height={220}
          />
        </div>

        <div className="mt-4 space-y-3">
          <ContactText />
          <MailFieldset />
        </div>

        {/* petit espace pour respirer au-dessus de la barre fixe */}
        <div className="h-6" aria-hidden />
      </div>

      {/* HomeButton fixe, identique aux autres pages */}
      <div className="fixed inset-x-0 bottom-0 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="mx-auto w-full max-w-[360px] flex justify-center">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
