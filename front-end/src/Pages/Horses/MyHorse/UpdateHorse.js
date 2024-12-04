import React, { useEffect, useState } from "react";
import { HeaderText } from "../../../components/texts/HeaderText";
import HomeButton from "../../../components/buttons/HomeButton";
import { useParams, useNavigate } from "react-router-dom";
import horseApi from "../../../services/horseApi";

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

  return (
    <div className="flex flex-col h-full justify-evenly">
      <img
        src="/icons/horseHead.png"
        width={50}
        className="absolute top-8 right-8"
        alt="icon horse head"
      />
      <HeaderText
        props={{
          title: "Modification d’un profil cheval",
          subtitle: "Quelles informations veux tu mettre à jour ?",
        }}
      />

      <div className="flex flex-col">
        <fieldset
          className={`
                w-5/6 
                my-2 mx-auto 
                rounded-full 
                border 
                px-8 
            `}
        >
          <legend className={`px-2`}>Nom</legend>
          <input
            className="mb-2 py-1 w-full"
            type="text"
            id="name"
            placeholder="Horisse"
            value={horse.name}
            onChange={handleNameChange}
          />
        </fieldset>

        <fieldset
          className={`
                w-5/6 
                my-2 mx-auto 
                rounded-full 
                border 
                px-8 
            `}
        >
          <legend className={`px-2`}>Âge</legend>
          <input
            className="mb-2 py-1 w-full"
            type="number"
            id="age"
            placeholder="0"
            value={horse.age}
            onChange={handleAgeChange}
          />
        </fieldset>

        <fieldset
          className={`
                w-5/6 
                my-2 mx-auto 
                rounded-full 
                border 
                px-8 
            `}
        >
          <legend className={`px-2`}>Catégorie</legend>
          <select
            className="mb-2 py-1 w-full"
            value={horse.race}
            onChange={handleRaceChange}
          >
            <option selected disabled>
              Sélectionner
            </option>
            <option>Pur Sang</option>
            <option>Trait/Attelage</option>
            <option>Autre</option>
          </select>
        </fieldset>

        <input
          type="submit"
          className="bg-blue-500
                hover:bg-blue-700
                text-white
                font-bold
                rounded-full
                shadow-xl
                py-5 w-80
                mx-auto mt-2"
          onClick={handleSubmit}
        />
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
