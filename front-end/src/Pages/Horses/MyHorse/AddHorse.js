import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import horseApi from "../../../services/horseApi";
import { jwtDecode } from "jwt-decode";
import { HeaderText } from "../../../components/texts/HeaderText";
import HomeButton from "../../../components/buttons/HomeButton";
import TextInput from "../../../components/inputs/TextInput";
import SelectInput from "../../../components/SelectInput";
import Button from "../../../components/buttons/Button";

function AddHorse() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [category, setCategory] = useState("");
  const [userId, setUserId] = useState("");
  let navigate = useNavigate();

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

  const handleNameChange = (newName) => {
    setName(newName);
  };

  const handleAgeChange = (newAge) => {
    setAge(newAge);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  const onSubmit = async () => {
    const AddHorse = await horseApi.AddHorse(name, age, category, userId);
    if (AddHorse.header.code === 201) {
      navigate("/horses/my-horse/my-horses", { replace: false });
    }
  };

  const nameHorse = {
    legend: "Nom du cheval",
    colorBorder: "border-homa-beige",
    textColor: "text-homa-beige",
    inputBoderColor: "focus:ring-homa-beige",
    type: "text",
    placeholder: "Horisse du chêne",
  };

  const ageHorse = {
    legend: "Âge du cheval",
    colorBorder: "border-homa-beige",
    inputBoderColor: "focus:ring-homa-beige",
    textColor: "text-homa-beige",
    type: "number",
    placeholder: "10",
  };

  return (
    <div
      className="flex flex-col 
                  items-center
                  max-h-screen"
    >
      <img
        src="/icons/horseHead.png"
        width={50}
        className="absolute top-8 right-8"
        alt=""
      />
      <div
        className="w-[90%] 
                    max-w-[400px] 
                    p-[5%]"
      >
        <HeaderText
          props={{
            title: "Création d'un profil cheval",
            subtitle: "Nous allons avoir besoin de quelques informations.",
          }}
        />

        <div className="flex flex-col">
          <TextInput
            props={nameHorse}
            value={name}
            onValueChange={handleNameChange}
          />
          <TextInput
            props={ageHorse}
            value={age}
            onValueChange={handleAgeChange}
          />
          <SelectInput value={category} onValueChange={handleCategoryChange} />
        </div>
        <Button name="Ajouter" onSubmit={() => onSubmit()} />
      </div>

      <div className="mt-5">
        <HomeButton />
      </div>
    </div>
  );
}

export default AddHorse;
