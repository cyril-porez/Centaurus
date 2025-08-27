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
    console.log("test");

    const AddHorse = await horseApi.AddHorse(name, age, category, userId);
    if (AddHorse.header.code === 201) {
      navigate("/horses/my-horse/my-horses", { replace: false });
    }
  };

  const nameHorse = {
    label: "Nom du cheval",
    type: "text",
    placeholder: "Horisse du chêne",
  };

  const ageHorse = {
    label: "Âge du cheval",
    type: "number",
    placeholder: "10",
  };

  return (
    <div
      className="
        flex justify-center
        max-h-[100svh]
        px-[5%]
      "
    >
      <div className="w-[90%] max-w-[360px]">
        <HeaderText
          props={{
            title: "Création d'un profil cheval",
            subtitle: "Nous allons avoir besoin d'informations.",
          }}
        />

        <div className="flex flex-col gap-y-2 mt-3 mb-2">
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
        <div className="mt-6">
          <Button name="Ajouter" onSubmit={() => onSubmit()} />
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="mx-auto w-full max-w-[360px] flex justify-center">
          <HomeButton
            className="
              fixed z-50
              left-1/2 -translate-x-1/2
              bottom-[max(env(safe-area-inset-bottom),0.75rem)]
            "
          />
        </div>
      </div>
    </div>
  );
}

export default AddHorse;
