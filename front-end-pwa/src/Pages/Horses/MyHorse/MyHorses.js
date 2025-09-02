// @ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";
import { HeaderText } from "../../../components/texts/HeaderText";
import AddHorseButton from "../../../components/buttons/AddHorseButton";
import HomeButton from "../../../components/buttons/HomeButton";
import horseApi from "../../../services/horseApi";
import Button from "../../../components/buttons/ButtonCenter";
import { useAuth } from "../../../contexts/AuthContext";

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

  const handleClick = () => {
    navigate("/horses/my-horse/add-horse", { replace: false });
  };

  return (
    <div className="flex flex-col h-full justify-center">
      <div className="flex flex-col h-1/2 justify-between">
        <HeaderText
          props={{
            title: "Mes chevaux",
            subtitle: "Vous pouvez avoir jusqu'à 4 chevaux.",
          }}
        />
        {userHorses.map((horse) => (
          <Button
            key={horse.id}
            props={{
              title: horse.name,
              onClick: () => goToUpdateHorse(horse.id),
            }}
          />
        ))}
        {userHorses.length < 4 && <AddHorseButton onClick={handleClick} />}
        <div className="flex flex-col justify-center items-center">
          <div className="mt-5">
            <HomeButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyHorses;
