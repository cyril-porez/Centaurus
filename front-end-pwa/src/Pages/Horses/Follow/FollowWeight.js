// @ts-nocheck
import React from "react";
import Button from "../../../components/buttons/ButtonCenter";
import AddHorseButton from "../../../components/buttons/AddHorseButton";
import HomeButton from "../../../components/buttons/HomeButton";
import { HeaderText } from "../../../components/texts/HeaderText";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import horseApi from "../../../services/horseApi";

function FollowWeight() {
  let navigate = useNavigate();
  const { user, token, initializing } = useAuth();
  const [userHorses, setUserHorses] = React.useState([]);
  const [error, setError] = React.useState("");

  const goToWeightPage = (horseId) => {
    navigate(`/horses/follow/evolution/weight/table/${horseId}`, {
      replace: false,
    });
  };

  const goToAddHorse = () => {
    navigate(`/horses/my-horse/add-horse`);
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

  return (
    <div className="flex flex-col justify-evenly h-full">
      <HeaderText
        props={{
          title: "Suivi du poids",
          subtitle: "Qui sera l'heureux élu ?",
        }}
      />

      {userHorses.map((horse) => (
        <Button
          props={{
            key: horse.id,
            onClick: () => goToWeightPage(horse.id),
            title: horse.name,
          }}
        />
      ))}

      <div className="flex flex-col justify-center items-center">
        <div className="mt-6">
          <AddHorseButton onClick={() => goToAddHorse()} />
        </div>
        <div className="mt-5">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}

export default FollowWeight;
