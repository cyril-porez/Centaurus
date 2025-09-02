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
    <div className="flex flex-col justify-evenly h-screen">
      <h1 className="text-blue-900 text-4xl font-bold text-center">
        <strong>{name}</strong>
      </h1>
      <h3 className="ml-5 mr-3 text-blue-900 text-3xl italic text-center">
        Comment a évolué <span className="text-blue-600">son poids </span>?
      </h3>

      {apiError && <p className="text-red-600 text-center mt-2">{apiError}</p>}

      <div className="mx-auto p-4">
        <table className="border border-black">
          <tbody>
            {rows.map((w, idx) => {
              return (
                <tr key={`${w?.date || "n/a"}-${idx}`}>
                  <td className="border p-2 border-black w-1/2">
                    {formatDate(w?.date)}
                  </td>
                  <td className="border p-2 border-black w-1/2">
                    {w.weight != null ? `${w.weight}` : "—"} kg
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td className="border p-2 border-black text-center" colSpan={2}>
                  Aucun poids enregistré.
                </td>
              </tr>
            )}
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
