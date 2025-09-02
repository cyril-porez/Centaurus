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
    <div className="flex flex-col mx-1">
      <div className="my-4">
        <HeaderText
          props={{
            title: `Bienvenue ${username ? username : ""}${
              username ? "" : ""
            }, on est ravis de te revoir !`,
            subtitle: "Que veux-tu faire ?",
          }}
        />
      </div>

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
        props={{ onClick: goToMyHorses, title: "Mes chevaux", src: horseHead }}
      />
      <ButtonCenter
        props={{ onClick: goToProfile, title: "Mon compte", src: casque }}
      />
    </div>
  );
}

export default Home;
