// @ts-nocheck
import React from "react";
import HomeButton from "../../../components/buttons/HomeButton";
import weightApi from "../../../services/weightApi";
import { useNavigate, useParams } from "react-router";
import Button from "../../../components/buttons/Button";
import ContactText from "../../../components/texts/ContactText";
import MailFieldset from "../../../components/texts/ContactMailFieldset";
import { useAuth } from "../../../contexts/AuthContext";

function WeightTable() {
  const { id } = useParams();
  const { token } = useAuth();
  const [rows, setRows] = React.useState([]); // [{date, weight}]
  const [name, setName] = React.useState("");
  const [apiError, setApiError] = React.useState("");
  let navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/horses/follow/evolution/weight/graph/${id}`, { replace: false });
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "");

  React.useEffect(() => {
    (async () => {
      setApiError("");
      const res = await weightApi.getWeightHorseForTable(id, token, {
        sort: "desc",
        compare: true,
        limit: 6,
      });

      if (res?.status === 200) {
        // Attendu:
        // { horse: { name, data: [{weight, fk_horse_id, created_at}, ...] }, ... }
        const h = res.data?.horse ?? {};
        const list = Array.isArray(h.data) ? h.data : [];
        setName(h.name ?? "");
        setRows(
          list.map((it) => ({
            date: it.created_at ?? it.date ?? null,
            weight: it.weight ?? null,
          }))
        );
      } else {
        setApiError(res?.data?.message || "Impossible de récupérer les poids.");
      }
    })();
  }, [id, token]);

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
      <div className="w-full max-w-[360px] flex flex-col">
        {/* Titre */}
        <h1 className="text-centaurus-oxford-blue text-4xl font-bold text-center">
          <strong>{name}</strong>
        </h1>
        <h3 className="mt-1 text-centaurus-oxford-blue text-2xl italic text-center">
          Comment a �volu�{" "}
          <span className="text-centaurus-dark-cerelean">son poids</span> ?
        </h3>

        {apiError && <p className="text-red mt-2 text-center">{apiError}</p>}

        {/* Tableau */}
        <div className="mt-4">
          <table className="w-full border-collapse border border-black rounded-md overflow-hidden">
            <tbody>
              {rows.length > 0 ? (
                rows.map((w, idx) => (
                  <tr
                    key={`${w?.date || "n/a"}-${idx}`}
                    className="even:bg-centaurus-dark-cerelean/20"
                  >
                    <td className="border border-black p-2 w-1/2 align-middle">
                      {formatDate(w?.date)}
                    </td>
                    <td className="border border-black p-2 w-1/2 align-middle text-right">
                      {w?.weight != null ? `${w.weight} kg` : "� kg"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="border border-black p-2 text-center"
                    colSpan={2}
                  >
                    Aucun poids enregistr�.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Texte et champ e-mail (garde tes composants) */}
        <div className="mt-4 space-y-3">
          <ContactText />
          <MailFieldset />
        </div>

        {/* Bouton action */}
        <div className="mt-6">
          <Button name="Tracer le graphique" onSubmit={() => handleSubmit()} />
        </div>

        {/* Petit espace pour ne pas coller au bas */}
        <div className="h-6" aria-hidden />
      </div>

      {/* Bouton Home fixe, comme sur les autres pages */}
      <div className="fixed inset-x-0 bottom-0 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="mx-auto w-full max-w-[360px] flex justify-center">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}

export default WeightTable;
