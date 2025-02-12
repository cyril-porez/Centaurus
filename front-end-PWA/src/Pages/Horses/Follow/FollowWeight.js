import React, { useEffect, useState } from "react";
import Button from "../../../components/buttons/ButtonCenter";
import AddHorseButton from "../../../components/buttons/AddHorseButton";
import HomeButton from "../../../components/buttons/HomeButton";
import { HeaderText } from "../../../components/texts/HeaderText";
import { jwtDecode } from "jwt-decode";
import horseApi from "../../../services/horseApi";
import { useNavigate } from "react-router";

function FollowWeight() {
  let navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userHorses, setUserHorses] = useState([]);

  const goToWeightPage = (horseId) => {
    navigate(`/WeightTable/${horseId}`, { replace: false });
  };

  const goToAddHorse = () => {
    navigate(`/AddHorse/`);
  };

  const getHorseByUser = async (id) => {
    try {
      const getHorsesByUser = await horseApi.getHorseByUser(id);
      return getHorsesByUser;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    var token = localStorage.getItem("user");
    console.log(token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && typeof decoded === "object" && "id" in decoded) {
          setUserId(decoded.id);
          getHorseByUser(decoded.id)
            .then((ressponse) => {
              setUserHorses(ressponse.horses);
              console.log(ressponse.horses);
            })
            .catch((error) => {
              console.error(error);
              console.log(decoded.id);
            });
        } else {
          console.log("Le token JWT n'a pas la propriété 'id'");
        }
      } catch (error) {
        console.error("Erreur de décodage du token :", error);
      }
    } else {
      console.log("Aucun token trouvé");
    }
  }, []);

  return (
    <div className="flex flex-col justify-evenly h-full">
      <img
        src="/icons/courbe.png"
        width={50}
        className="absolute top-8 right-8"
        alt=""
      />

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
