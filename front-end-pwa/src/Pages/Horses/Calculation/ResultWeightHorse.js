// @ts-nocheck
import React, { useEffect, useState } from "react";
import DisplayWeight from "../../../components/DisplayWeight";
import HomeButton from "../../../components/buttons/HomeButton";
import { useNavigate, useParams } from "react-router-dom";
import weightApi from "../../../services/weightApi";
import { useAuth } from "../../../contexts/AuthContext";

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
    <div className="flex flex-col justify-evenly h-full">
      <h1 className="text-blue-900 text-4xl font-bold text-center">
        <strong>{data?.name || ""}</strong>
      </h1>
      <h3 className="ml-5 mr-3 text-blue-900 text-3xl italic text-center">
        Son poids le <span className="text-blue-600">{data?.date + " "}</span>
        est de :
      </h3>

      <DisplayWeight props={{ title: (data?.weight ?? "—") + " kg" }} />
      <h3 className="ml-5 text-2xl text-center">
        Soit {diffStr} Kg depuis la dernière fois ({data?.lastDate || "—"})
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
