// @ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";
import { HeaderText } from "../../../components/texts/HeaderText";
import AddHorseButton from "../../../components/buttons/AddHorseButton";
import HomeButton from "../../../components/buttons/HomeButton";
import horseApi from "../../../services/horseApi";
import Button from "../../../components/buttons/ButtonCenter";
import { useAuth } from "../../../contexts/AuthContext";
import HorseCard from "../../../components/cards/HorseCard";
import BottomNav from "../../../components/BottomNav";

function MyHorses() {
  let navigate = useNavigate();
  const { user, token, initializing } = useAuth();
  const [userHorses, setUserHorses] = React.useState([]);
  const [error, setError] = React.useState("");

  const goToUpdateHorse = (horseId) => {
    navigate(`/horses/my-horse/update-horse/${horseId}`, { replace: false });
  };

  React.useEffect(() => {
    if (initializing) return;
    if (!user?.id) {
      navigate("/auth/sign-in", { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await horseApi.getHorsesByUser({
          userId: user.id,
          token,
        });
        console.log("res",res);
        
        const list = res?.data?.data;
        setUserHorses(Array.isArray(list) ? list : []);
      } catch (e) {
        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Impossible de charger vos chevaux."
        );
      }
    })();
  }, [initializing, user?.id, token, navigate]);

  const goToAddHorse = () => {
    navigate("/horses/my-horse/add-horse", { replace: false });
  };

  const handleDelete = async (horseId) => {
    console.log("delete =>", horseId);

    try {
      const res = await horseApi.DeleteHorse(horseId, token);
      console.log(res);
      

      if (res?.status === 200 || res?.status === 204) {
        // suppression c�t� front (met � jour ton state)
        setUserHorses((prev) => prev.filter((horse) => horse.id !== horseId));        
        console.log("Cheval supprimé avec succès");
      } else {
        console.error("Erreur lors de la suppression :", res);
        setError("Impossible de supprimer ce cheval.");
      }
    } catch (e) {
      console.error("Erreur API :", e); 
      setError(
        e?.response?.data?.message || e?.message || "Erreur lors de la suppression."
      );
    }
  };

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
        <HeaderText
          props={{
            title: "Mes chevaux",
            subtitle: "Tu peux ajouter jusqu'à 4 chevaux par compte",
          }}
        />

        <div className="mt-4 space-y-3">
          {userHorses.map((h) => (
            <HorseCard
              key={h.id}
              name={h.name}
              age={h.age} // ou calcule l��ge en amont
              onEdit={() => goToUpdateHorse(h.id)}
              onDelete={() => handleDelete(h.id)}
            />
          ))}
        </div>

        {/* Bouton �Ajouter un cheval� (style maquette) */}
        <div className="mt-4">
          <AddHorseButton onClick={goToAddHorse} />
        </div>

        <div className="h-6" aria-hidden />
      </div>

      {/* Barre / bouton fixe en bas comme ailleurs */}
      <div className="fixed inset-x-0 bottom-0 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="mx-auto w-full max-w-[360px] flex justify-center">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}

export default MyHorses;
