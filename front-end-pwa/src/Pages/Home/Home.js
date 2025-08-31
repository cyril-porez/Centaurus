import React, { useEffect, useState } from "react";
import ButtonCenter from "../../components/buttons/ButtonCenterImg";
import horseHead from "../../assets/icons/horseHead.png";
import calcul from "../../assets/icons/calcul.png";
import casque from "../../assets/icons/casque.png";
import courbe from "../../assets/icons/courbe.png";
import { HeaderText } from "../../components/texts/HeaderText";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import userApi from "../../services/userApi";

function Home() {
  const [username, setUsername] = useState("");
  let navigate = useNavigate();

  const getUser = async (id) => {
    try {
      const user = await userApi.getuser(id);
      return user;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  useEffect(() => {
    var token = localStorage.getItem("user");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && typeof decoded === "object" && "id" in decoded) {
          getUser(decoded.id)
            .then((response) => {
              // setUsername(response.username);
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

  return (
    <div className="flex flex-col mx-1">
      <div className="my-4">
        <HeaderText
          props={{
            title: `Bienvenue ${username}, on est ravis de te revoir !`,
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
