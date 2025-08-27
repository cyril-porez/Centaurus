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

  // useEffect(() => {
  //   fetchData();
  // }, []);

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
    label: "Nom du cheval",
    colorBorder: "border-homa-beige",
    textColor: "text-homa-beige",
    inputBoderColor: "focus:ring-homa-beige",
    type: "text",
    placeholder: "Horisse du chêne",
  };

  const ageHorse = {
    label: "Âge du cheval",
    colorBorder: "border-homa-beige",
    textColor: "text-homa-beige",
    inputBoderColor: "focus:ring-homa-beige",
    type: "number",
    placeholder: "10",
  };

  return (
    <div
      className="
        flex justify-center
        max-h-screen
        px-[5%]
      "
    >
      <div className="w-[90%] max-w-[360px]">
        <HeaderText
          props={{
            title: "Modification d’un profil cheval",
            subtitle: "Quelles informations veux tu mettre à jour ?",
          }}
        />

        <div className="flex flex-col gap-y-2 mt-3 mb-2">
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
        </div>

        <div className="mt-6">
          <Button name="Modifier" onSubmit={() => handleSubmit()} />
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

export default UpdateHorse;
