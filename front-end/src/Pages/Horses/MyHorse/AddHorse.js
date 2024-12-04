import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import horseApi from "../../../services/horseApi";
import { jwtDecode } from "jwt-decode";
import { HeaderText } from "../../../components/texts/HeaderText";
import HomeButton from "../../../components/buttons/HomeButton";
import TextInput from "../../../components/inputs/TextInput";
import SelectInput from "../../../components/SelectInput";

function AddHorse() {
  let navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [category, setCategory] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    var token = localStorage.getItem("user");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && typeof decoded === "object" && "id" in decoded) {
          setUserId(decoded.id);
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

  const createHorse = async () => {
    const AddHorse = await horseApi.AddHorse(name, age, category, userId);
    console.log(AddHorse);
  };

  const onSubmit = async () => {
    await createHorse();

    navigate("/MyHorses", { replace: false });
  };

  const nameHorse = {
    legend: "Nom du cheval",
    type: "text",
    placeholder: "Horisse du chêne",
  };

  const ageHorse = {
    legend: "Âge du cheval",
    type: "number",
    placeholder: "10",
  };

  return (
    <div className="flex flex-col h-screen justify-evenly">
      <img
        src="/icons/horseHead.png"
        width={50}
        className="absolute top-8 right-8"
        alt=""
      />
      <HeaderText
        props={{
          title: "Création d'un profil cheval",
          subtitle: "Nous allons avoir besoin de quelques informations.",
        }}
      />

      <div className="flex flex-col">
        <TextInput props={nameHorse} />
        <TextInput props={ageHorse} />
        <SelectInput />
      </div>

      <input
        type="submit"
        onClick={() => onSubmit()}
        className="bg-blue-500
                hover:bg-blue-700
                text-white
                font-bold
                rounded-full
                shadow-xl
                py-5 w-80
                mx-auto mt-2"
      />

      <div className="mt-5">
        <HomeButton />
      </div>
    </div>
  );
}

export default AddHorse;
