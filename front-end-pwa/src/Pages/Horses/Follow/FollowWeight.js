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
            title: "Suivi du poids",
            subtitle: "Qui sera l'heureux �lu ?",
          }}
        />
        <div className="mt-4 space-y-3">
          {userHorses.map((horse) => (
            <Button
              props={{
                key: horse.id,
                onClick: () => goToWeightPage(horse.id),
                title: horse.name,
              }}
            />
          ))}
        </div>
        <div className="mt-4">
          <AddHorseButton onClick={goToAddHorse} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="mx-auto w-full max-w-[360px] flex justify-center">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}

export default FollowWeight;
