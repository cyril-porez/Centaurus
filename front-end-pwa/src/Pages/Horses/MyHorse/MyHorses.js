import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderText } from "../../../components/texts/HeaderText";
import AddHorseButton from "../../../components/buttons/AddHorseButton";
import HomeButton from "../../../components/buttons/HomeButton";
import horseApi from "../../../services/horseApi";
import { jwtDecode } from "jwt-decode";
import Button from "../../../components/buttons/ButtonCenter";

function MyHorses() {
  let navigate = useNavigate();
  // const [userId, setUserId] = useState(null);
  const [userHorses, setUserHorses] = useState([]);
  // const [nbrHorses, setNbrHorses] = useState();

  const goToUpdateHorse = (horseId) => {
    navigate(`/horses/my-horse/update-horse/${horseId}`, { replace: false });
  };

  const getHorseByUser = async (id) => {
    try {
      const getHorsesByUser = await horseApi.getHorsesByUser(id);
      setUserHorses(getHorsesByUser.body.horse.data);

      return getHorsesByUser;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    var token = localStorage.getItem("user");
    const decoded = jwtDecode(token);
    getHorseByUser(decoded.id);
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
        alt="head horse"
      />
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
