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
    <div
    className={[
      "flex justify-center px-4",
      isPureSang
        ? "h-[100svh] overflow-hidden pt-[max(env(safe-area-inset-top),1rem)]"
        : "min-h-[100svh] overflow-y-auto pt-[max(env(safe-area-inset-top),1rem)] pb-[calc(max(env(safe-area-inset-bottom),0.75rem)+5rem)]",
    ].join(" ")}
  >
    <div className="w-full max-w-[360px]">
      <HeaderText
        props={{
          title: `${horse?.name}`,
          subtitle: "Nous avons besoin de ses nouvelles mensurations",
        }}
      />

      {isPureSang ? (
        <div className="mt-3 mb-2 space-y-2">
          <TextInput props={lcorp}          value={horseMesure.body}  onValueChange={handleBodyChange} />
          <TextInput props={circThoracique} value={horseMesure.chest} onValueChange={handleChestChange} />
          {/* ?? on passe bien la date, pas tout l'objet */}
          <TextInput props={dateMeasure}    value={horseMesure.date ?? ""} onValueChange={handleDateChange} />
        </div>
      ) : (
        <div className="mt-3 mb-2 space-y-2">
          <TextInput props={hgarot}         value={horseMesure.garrot} onValueChange={handleGarrotChange} />
          <TextInput props={lcorp}          value={horseMesure.body}   onValueChange={handleBodyChange} />
          <TextInput props={circThoracique} value={horseMesure.chest}  onValueChange={handleChestChange} />
          <TextInput props={circEncolure}   value={horseMesure.neck}   onValueChange={handleNeckChange} />
          <TextInput props={dateMeasure}    value={horseMesure.date ?? ""} onValueChange={handleDateChange} />
        </div>
      )}

      <img
        src="/images/cheval_lignes_mesure.png"
        width={110}
        className="mx-auto my-4"
        alt="Zones de mesure du cheval"
      />

      <Button className="mt-2" name="Calculons" onSubmit={handleSubmit} />

      {/* petit espace suppl�mentaire uniquement quand on a du scroll */}
      {!isPureSang && <div className="h-6" aria-hidden />}
    </div>

    {/* HomeButton fixe, identique aux autres pages */}
    <div className="fixed inset-x-0 bottom-0 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
      <div className="mx-auto w-full max-w-[360px] flex justify-center">
        <HomeButton />
      </div>
    </div>
  </div>
  );
}

export default ResultWeight;
