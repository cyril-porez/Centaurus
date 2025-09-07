// @ts-nocheck
import React, { useEffect, useState } from "react";
import DisplayWeight from "../../../components/DisplayWeight";
import HomeButton from "../../../components/buttons/HomeButton";
import { useNavigate, useParams } from "react-router-dom";
import weightApi from "../../../services/weightApi";
import { useAuth } from "../../../contexts/AuthContext";
import Button from "../../../components/buttons/Button";
import BottomNav from "../../../components/BottomNav";

const DASH = "\u2014";          // — (em dash)
const LQ = "\u00AB";           // «
const RQ = "\u00BB";           // »

const fmtDateSafe = (x) => {
  if (!x) return DASH;
  const d = new Date(x);
  return Number.isNaN(d.getTime()) ? DASH : d.toLocaleDateString("fr-FR");
};

export default function ResultWeight() {
  const { id } = useParams();
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const goToTable = () =>
    navigate(`/horses/follow/evolution/weight/table/${id}`, { replace: false });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await weightApi.getWeightHorse(id, token, {
          sort: "desc",
          compare: true,
          limit: 1,
        });

        const status = res?.status ?? 0;
        const h = res?.data?.horse ?? {};

        if (status >= 200 && status < 300) {
          const current = Array.isArray(h.data) ? h.data[0] : null;
          if (!alive) return;
          setData({
            name: h.name ?? "",
            weight: current?.weight ?? null,
            diff: h.difference_weight ?? null,
            date: fmtDateSafe(current?.created_at ?? h.created_at),
            lastDate: fmtDateSafe(h.last_date),
          });
          setErr("");
        } else {
          if (!alive) return;
          setErr(res?.data?.message || "Impossible de récupérer le poids.");
        }
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.message || e?.message || "Erreur réseau.");
      }
    })();
    return () => { alive = false; };
  }, [id, token]);

  const diffStr =
    data?.diff == null ? DASH : `${data.diff > 0 ? "+" : ""}${data.diff}`;

  if (err) {
    return (
      <div className="flex justify-center min-h-[100svh] px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-[calc(max(env(safe-area-inset-bottom),0.75rem)+5rem)]">
        <div className="w-full max-w-[360px] text-center text-red-600 mt-6">{err}</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-[100svh] px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-[calc(max(env(safe-area-inset-bottom),0.75rem)+5rem)]">
      <div className="w-full max-w-[360px]">
        <h1 className="text-centaurus-oxford-blue text-4xl font-bold text-center">
          {data?.name ?? ""}
        </h1>

        <h3 className="mt-1 text-centaurus-oxford-blue text-2xl italic text-center">
          Son poids le{" "}
          <span className="text-centaurus-dark-cerelean">
            {data?.date ?? DASH}
          </span>{" "}
          est de :
        </h3>

        <div className="mt-3">
          <DisplayWeight props={{ title: `${data?.weight ?? DASH} kg` }} />
        </div>

        <h3 className="mt-4 text-xl text-center">
          Soit {diffStr} kg depuis la dernière fois ({data?.lastDate ?? DASH})
        </h3>

        <p className="mt-4 text-sm leading-snug">
          En termes de fréquence, pour un cheval {LQ}sain{RQ}, nous recommandons
          de réaliser cette estimation <strong>toutes les deux semaines</strong> ; en cas
          de particularité ou de problème, la répéter <strong>toutes les semaines</strong>.
        </p>

        <div className="mt-6">
          <Button name="Accéder au suivi" onSubmit={goToTable} />
        </div>

        <div className="h-6" aria-hidden />
      </div>

      <div className="fixed inset-x-0 bottom-0 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="mx-auto w-full max-w-[360px] flex justify-center">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
