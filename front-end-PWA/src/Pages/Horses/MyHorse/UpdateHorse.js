import React, { useEffect, useState } from "react";
import { HeaderText } from "../../../components/texts/HeaderText";
import HomeButton from "../../../components/buttons/HomeButton";
import { useParams, useNavigate } from "react-router-dom";
import horseApi from "../../../services/horseApi";
import TextInput from "../../../components/inputs/TextInput";
import SelectInput from "../../../components/SelectInput";
import Button from "../../../components/buttons/Button";

function UpdateHorse() {
  const { id } = useParams();
  const [horse, setHorse] = useState({ name: "", age: 0, race: "" });
  let navigate = useNavigate();

  const fetchData = async () => {
    const response = await horseApi.getHorse(id);
    setHorse((prevHorse) => ({
      ...prevHorse,
      name: response.body.horse.name,
      age: response.body.horse.age,
      race: response.body.horse.race,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNameChange = (/** @type {any} */ newName) => {
    setHorse((prevHorse) => ({ ...prevHorse, name: newName }));
  };

  const handleAgeChange = (/** @type {any} */ newAge) => {
    setHorse((prevHorse) => ({ ...prevHorse, age: newAge }));
  };

  const handleRaceChange = (/** @type {any} */ newRace) => {
    setHorse((prevHorse) => ({ ...prevHorse, race: newRace }));
  };

  const handleSubmit = async () => {
    const response = await horseApi.UpdateHorse(
      horse.name,
      horse.age,
      horse.race,
      id
    );
    console.log(response);
    if (response.header.code === 201) {
      navigate(`/horses/my-horse/my-horses`, { replace: true });
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
    textColor: "text-homa-beige",
    inputBoderColor: "focus:ring-homa-beige",
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
        alt="icon horse head"
      />
      <div
        className="w-[90%] 
                    max-w-[400px] 
                    p-[5%]"
      >
        <HeaderText
          props={{
            title: "Modification d’un profil cheval",
            subtitle: "Quelles informations veux tu mettre à jour ?",
          }}
        />

        <div className="flex flex-col">
          <TextInput
            props={nameHorse}
            value={horse.name}
            onValueChange={handleNameChange}
          />
          <TextInput
            props={ageHorse}
            value={horse.age}
            onValueChange={handleAgeChange}
          />
          <SelectInput value={horse.race} onValueChange={handleRaceChange} />
          <Button name="Modifier" onSubmit={() => handleSubmit()} />
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="mt-5">
            <HomeButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateHorse;
