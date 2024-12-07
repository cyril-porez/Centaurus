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

  useEffect(() => {
    const fetchData = async () => {
      const response = await horseApi.getHorse(id);
      setHorse(response);
      console.log(response);
    };
    console.log(horse.name);
    fetchData();
  }, []);

  const handleNameChange = (e) => {
    setHorse({ ...horse, name: e.target.value });
  };

  const handleAgeChange = (e) => {
    const newAge = e.target.value === "" ? 0 : Number(e.target.value);
    setHorse({ ...horse, age: newAge });
  };

  const handleRaceChange = (e) => {
    setHorse({ ...horse, race: e.target.value });
  };

  const handleSubmit = async () => {
    await horseApi.UpdateHorse(horse.name, horse.age, horse.race, id);
    navigate(`/MyHorses`, { replace: true });
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
          <TextInput props={nameHorse} />
          <TextInput props={ageHorse} />
          <SelectInput />
          <Button />
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
