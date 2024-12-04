import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { HeaderText } from "../../../components/texts/HeaderText";
import AddHorseButton from "../../../components/buttons/AddHorseButton";
import HomeButton from "../../../components/buttons/HomeButton";
import horseApi from "../../../services/horseApi";
import { jwtDecode } from "jwt-decode";
import Button from "../../../components/buttons/ButtonCenter";

function MyHorses() {
  let navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userHorses, setUserHorses] = useState([]);
  const [nbrHorses, setNbrHorses] = useState();

  const goToUpdateHorse = (horseId) => {
    navigate(`/UpdateHorse/${horseId}`, { replace: false });
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
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && typeof decoded === "object" && "id" in decoded) {
          setUserId(decoded.id);
          getHorseByUser(decoded.id)
            .then((ressponse) => {
              setUserHorses(ressponse.horses);
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

  const handleClick = () => {
    navigate("/AddHorse", { replace: false });
  };

  return (
    <div className="flex flex-col h-full justify-center">
      <img
        src="/icons/horseHead.png"
        width={50}
        className="absolute top-8 right-8"
      />
      <div className="flex flex-col h-1/2 justify-between">
        <HeaderText
          props={{
            title: "Mes chevaux",
            subtitle: "Vous pouvez avoir jusqu'à 4 chevaux.",
          }}
        />
        {userHorses.map((horse) => (
          // <button key={horse.id} onClick={goToWeightPage} title={horse.name}>
          //   {horse.name}
          // </button>
          <Button
            props={{
              key: horse.id,
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
