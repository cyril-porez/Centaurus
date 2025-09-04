// @ts-nocheck
import React, { useEffect, useState } from "react";
import DisplayWeight from "../../../components/DisplayWeight";
import HomeButton from "../../../components/buttons/HomeButton";
import { useNavigate, useParams } from "react-router-dom";
import weightApi from "../../../services/weightApi";
import { useAuth } from "../../../contexts/AuthContext";
import Button from "../../../components/buttons/ButtonCenter";

function ResultWeight() {
  const { id } = useParams();
  const { token } = useAuth(); // ⬅️ JWT
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  let navigate = useNavigate();

  const navigateResult = () => {
    navigate(`/horses/follow/evolution/weight/table/${id}`, { replace: false });
  };

  const fmt = (d) => new Date(d).toLocaleDateString("fr-FR");

  useEffect(() => {
    (async () => {
      const res = await weightApi.getWeightHorse(id, token, {
        sort: "desc",
        compare: true,
        limit: 1,
      });
      console.log("test");

      if (res?.status === 200) {
        const h = res.data?.horse || {};
        const currentEntry = Array.isArray(h.data) ? h.data[0] : null;
        const currentWeight = currentEntry?.weight ?? null;
        const currentDate = currentEntry?.created_at ?? h.created_at ?? null;

        setData({
          name: h.name ?? "",
          weight: currentWeight,
          lastWeight: h.last_weight ?? null,
          diff: h.difference_weight ?? null,
          date: currentDate ? fmt(currentDate) : "",
          lastDate: h.last_date ? fmt(h.last_date) : "",
        });
      } else {
        setErr(res?.data?.message || "Impossible de récupérer le poids.");
      }
    })();
  }, [id, token]);

  const sign = () => {
    if (!data) return "";
    if (data.lastWeight == null || data.weight == null) return "";
    return data.weight >= data.lastWeight ? "+" : "-";
  };

  const diffStr =
    data?.diff == null ? "—" : `${data.diff > 0 ? "+" : ""}${data.diff}`;

  if (err) {
    return <p className="text-center text-red-600 mt-6">{err}</p>;
  }
  if (!data) {
    return <p className="text-center mt-6">Chargement…</p>;
  }

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
        {data?.name ?? ""}
      </h1>

      <h3 className="mt-1 text-centaurus-oxford-blue text-2xl italic text-center">
        Son poids le{" "}
        <span className="text-centaurus-dark-cerelean">
          {data?.date ?? "�"}
        </span>{" "}
        est de :
      </h3>

      <div className="mt-3">
        <DisplayWeight props={{ title: `${data?.weight ?? "�"} kg` }} />
      </div>

      <h3 className="mt-4 text-xl text-center">
        Soit {diffStr} kg depuis la derni�re fois (
        {data?.lastDate ?? "�"})
      </h3>

      <p className="mt-4 text-sm leading-snug">
        En termes de fréquence, pour un cheval " sain "", nous recommandons de
        réaliser cette estimation <strong>toutes les deux semaines</strong> ;
        en cas de particularité ou de problème, la répéter
        <strong> toutes les semaines</strong>.
      </p>

      {/* Bouton action (m�me style que partout) */}
      <div className="mt-6">
        <Button name="Accéder au suivi" onSubmit={navigateResult} />
      </div>

      {/* petit espace avant la barre fixe */}
      <div className="h-6" aria-hidden />
    </div>

    {/* Home fixe en bas, identique aux autres pages */}
    <div className="fixed inset-x-0 bottom-0 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
      <div className="mx-auto w-full max-w-[360px] flex justify-center">
        <HomeButton />
      </div>
    </div>
  </div>
  );
}

export default ResultWeight;
