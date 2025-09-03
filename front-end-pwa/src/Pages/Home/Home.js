import React from "react";
import ButtonCenter from "../../components/buttons/ButtonCenterImg";
import horseHead from "../../assets/icons/horseHead.png";
import calcul from "../../assets/icons/calcul.png";
import casque from "../../assets/icons/casque.png";
import courbe from "../../assets/icons/courbe.png";
import { HeaderText } from "../../components/texts/HeaderText";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Home() {
  let navigate = useNavigate();
  const { user, initializing } = useAuth();

  const username =
    user?.username || (user?.email ? user.email.split("@")[0] : "");

  const goToWeightCalculation = () => {
    navigate("/horses/calculation/ChoiceHorse", { replace: false });
  };

  const goToFollowWeight = () => {
    navigate("/horses/follow/follow-weight", { replace: false });
  };

  const goToMyHorses = () => {
    navigate("/horses/my-horse/my-horses", { replace: false });
  };

  const goToProfile = () => {
    navigate("/users/profile", { replace: false });
  };

  if (initializing) return null;

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
        {/* --- TES CARDS --- */}
        <div className="space-y-3">
          <ProfileHeaderCard
            initials="BB"
            name="TEST"
            lastUpdated="15/08/2025"
          />

          <div className="grid grid-cols-2 gap-3">
            <StatCard
              iconSrc="/icons/scale.png" // remplace par ton ic�ne
              value="200"
              suffix="kg"
              subtitle="kg actuel"
            />
            <StatCard
              iconSrc="/icons/scale.png"
              value="+12"
              suffix="kg"
              subtitle="kg ce mois"
            />
          </div>
        </div>

        {/* Tes boutons centraux d�j� existants */}
        <div className="mt-4 space-y-3">
          <ButtonCenter
            props={{
              onClick: goToWeightCalculation,
              title: "Calcul du poids",
              src: calcul,
            }}
          />
          <ButtonCenter
            props={{
              onClick: goToFollowWeight,
              title: "Suivi du poids",
              src: courbe,
            }}
          />
          <ButtonCenter
            props={{
              onClick: goToMyHorses,
              title: "Mes chevaux",
              src: horseHead,
            }}
          />
          <ButtonCenter
            props={{ onClick: goToProfile, title: "Mon compte", src: casque }}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
