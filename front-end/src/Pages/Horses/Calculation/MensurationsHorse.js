import React, { useEffect, useState } from "react";
import { HeaderText } from "../../../components/texts/HeaderText";
import { Await, useNavigate, useParams } from "react-router-dom";
import horseApi from "../../../services/horseApi";
import weightApi from "../../../services/weightApi";
import HomeButton from "../../../components/buttons/HomeButton";
import TextInput from "../../../components/inputs/TextInput";
import Button from "../../../components/buttons/Button";
export default function Mensurations() {
  const [garrotHeight, setGarrotHeight] = useState("");
  const [bodyLength, setBodyLength] = useState("");
  const [chestSize, setChestSize] = useState("");
  const [neckSize, setNeckSize] = useState("");
  const [date, setDate] = useState("");
  const { id } = useParams();
  const [horse, sethorse] = useState({ name: "", age: 0, race: "" });
  const [horseMesure, setHorseMesure] = useState({
    garrot: 0,
    body: 0,
    chest: 0,
    neck: 0,
    date: new Date(),
  });

  let navigate = useNavigate();

  const handleGarrotChange = (/** @type {any} */ newGarot) => {
    setHorseMesure((prevHorse) => ({ ...prevHorse, garrot: newGarot }));
  };
  const handleBodyChange = (/** @type {any} */ newBody) => {
    setHorseMesure((prevHorse) => ({ ...prevHorse, body: newBody }));
  };
  const handleChestChange = (/** @type {any} */ newChest) => {
    setHorseMesure((prevHorse) => ({ ...prevHorse, chest: newChest }));
  };
  const handleNeckChange = (/** @type {any} */ newNeck) => {
    setHorseMesure((prevHorse) => ({ ...prevHorse, neck: newNeck }));
  };
  const handleDateChange = (/** @type {any} */ newDate) => {
    setHorseMesure((prevHorse) => ({ ...prevHorse, date: newDate }));
  };

  const navigateResult = () => {
    navigate(`/ResultWeight/${id}`, { replace: false });
  };

  async function fetchData() {
    try {
      const horseData = await horseApi.getHorse(id);
      sethorse((prevHorse) => ({
        ...prevHorse,
        name: horseData.body.horse.name,
        age: horseData.body.horse.age,
        race: horseData.body.horse.race,
      }));
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du cheval:",
        error.response
      );
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const addWeight = async (weight, horseId, date) => {
    try {
      const addWeight = await weightApi.addHorseWeihgt(weight, horseId, date);
      return addWeight;
    } catch (error) {
      return error;
    }
  };

  /**
   * pure sang
    (G²×L) : (11877)
    - G = la circonférence thoracique (en cm)
    - L = la longueur du corps (en cm)

    trait attelage
    (G¹⋅⁴⁸⁶×L⁰⋅⁵⁵⁴×H⁰⋅⁵⁹⁹×N⁰⋅¹⁷³) : 3441
    - G = la circonférence thoracique (en cm)
    - L = la longueur du corps (en cm)
    - H = la hauteur au garrot (en cm)
    - N = la circonférence de l’encolure (en cm)

    autre
    (G¹⋅⁴⁸⁶×L⁰⋅⁵⁵⁴×H⁰⋅⁵⁹⁹×N⁰⋅¹⁷³) : 3596
    - G = la circonférence thoracique (en cm)
    - L = la longueur du corps (en cm)
    - H = la hauteur au garrot (en cm)
    - N = la circonférence de l’encolure (en cm)
   */
  const calculateWeightHorse = async () => {
    let G = horseMesure.chest;
    let L = horseMesure.body;
    let H = horseMesure.garrot;
    let N = horseMesure.neck;

    switch (horse?.race) {
      case "pure sang":
        const weight = Math.ceil((G ** 2 * L) / 11877);
        return await addWeight(weight, id, date);
      case "Trait/Attelage":
        const weightTraitAttelage = Math.ceil(
          (G ** 1.486 * L ** 0.554 * H ** 0.599 * N ** 0.173) / 3441
        );
        return await addWeight(weightTraitAttelage, id, date);
      case "Autre":
        const weightAutre = Math.ceil(
          (G ** 1.486 * L ** 0.554 * H ** 0.599 * N ** 0.173) / 3596
        );
        return await addWeight(weightAutre, id, date);
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    const response = await calculateWeightHorse();
    if (response.header.code === 201) {
      navigateResult();
    }
  };

  const hgarot = {
    legend: "Hauteur au garrot",
    colorBorder: "border-homa-beige",
    textColor: "text-homa-beige",
    placeholder: "... cm",
    type: "text",
  };

  const lcorp = {
    legend: "Longueur du corps",
    colorBorder: "border-red",
    textColor: "text-red",
    placeholder: "... cm",
    type: "text",
  };

  const circThoracique = {
    legend: "Circonférence thoracique",
    colorBorder: "border-green-apple",
    textColor: "text-green-apple",
    placeholder: "... cm",
    type: "text",
  };

  const circEncolure = {
    legend: "Circonférence de l'encolure",
    colorBorder: "border-orange",
    textColor: "text-orange",
    placeholder: "... cm",
    type: "text",
  };

  const dateMeasure = {
    legend: "Date de la prise de mesure",
    colorBorder: "border-homa-brown",
    textColor: "text-homa-brown",
    type: "date",
  };

  return (
    <div
      className="flex flex-col 
                  items-center
                  max-h-screen"
    >
      <div
        className="w-[90%] 
                    max-w-[400px] 
                    p-[5%]"
      >
        <HeaderText
          props={{
            title: `${horse?.name}`,
            subtitle: "Nous avons besoin de ses nouvelles mensurations",
          }}
        />
        {horse?.race === "pure sang" ? (
          <>
            <TextInput
              props={lcorp}
              value={horseMesure.body}
              onValueChange={handleBodyChange}
            />
            <TextInput
              props={circThoracique}
              value={horseMesure.chest}
              onValueChange={handleChestChange}
            />
            <TextInput
              props={dateMeasure}
              value={horseMesure}
              onValueChange={handleDateChange}
            />
          </>
        ) : (
          <>
            {/* <div className="flex flex-col h-1/2"> */}
            <TextInput
              props={hgarot}
              value={horseMesure.garrot}
              onValueChange={handleGarrotChange}
            />
            <TextInput
              props={lcorp}
              value={horseMesure.body}
              onValueChange={handleBodyChange}
            />
            <TextInput
              props={circThoracique}
              value={horseMesure.chest}
              onValueChange={handleChestChange}
            />
            <TextInput
              props={circEncolure}
              value={horseMesure.neck}
              onValueChange={handleNeckChange}
            />
            <TextInput
              props={dateMeasure}
              value={horseMesure.date}
              onValueChange={handleDateChange}
            />
          </>
        )}
        <img
          src="/images/cheval_lignes_mesure.png"
          width={150}
          className="mx-auto my-4"
          alt=""
        />

        <Button name={"Calculons"} onSubmit={() => handleSubmit()} />
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="mt-5">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}
