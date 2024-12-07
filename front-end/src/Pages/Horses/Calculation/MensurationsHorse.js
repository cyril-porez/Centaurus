import React, { useEffect, useState } from "react";
import { HeaderText } from "../../../components/texts/HeaderText";
import { useNavigate, useParams } from "react-router-dom";
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
  const [horse, sethorse] = useState("");

  let navigate = useNavigate();

  const navigateResult = () => {
    navigate(`/ResultWeight/${id}`, { replace: false });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const horse = await horseApi.getHorse(id);
        sethorse(horse);
        console.log(horse);
      } catch (error) {
        console.error("Erreur lors de la récupération du cheval:", error);
      }
    }

    // Appel de la fonction asynchrone
    fetchData();
  }, []);

  const addWeight = async (weight, horseId, date) => {
    try {
      const addWeight = await weightApi.addHorseWeihgt(weight, horseId, date);
      return addWeight;
    } catch (error) {
      console.log(error);
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
    let G = parseInt(chestSize, 10);
    let L = parseInt(bodyLength, 10);
    let H = parseInt(garrotHeight, 10);
    let N = parseInt(neckSize, 10);

    switch (horse?.race) {
      case "pure sang":
        const weight = Math.ceil((G ** 2 * L) / 11877);
        console.log("pur sang");
        console.log("G => ", G);
        console.log("L =>", L);
        console.log("longueur corp =>", bodyLength);
        console.log("circonférence du corp =>", chestSize);
        console.log("date =>", date);
        console.log("result =>", weight);
        await addWeight(weight, id, date);
        break;
      case "Trait/Attelage":
        const weightTraitAttelage = Math.ceil(
          (G ** 1.486 * L ** 0.554 * H ** 0.599 * N ** 0.173) / 3441
        );
        await addWeight(weightTraitAttelage, id, date);
        break;
      case "Autre":
        const weightAutre = Math.ceil(
          (G ** 1.486 * L ** 0.554 * H ** 0.599 * N ** 0.173) / 3596
        );
        await addWeight(weightAutre, id, date);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    calculateWeightHorse();
    navigateResult();
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
            <TextInput props={lcorp} />
            <TextInput props={circThoracique} />
            <TextInput props={dateMeasure} />
          </>
        ) : (
          <>
            {/* <div className="flex flex-col h-1/2"> */}
            <TextInput props={hgarot} />
            <TextInput props={lcorp} />
            <TextInput props={circThoracique} />
            <TextInput props={circEncolure} />
            <TextInput props={dateMeasure} />
          </>
        )}
        <img
          src="/images/cheval_lignes_mesure.png"
          width={150}
          className="mx-auto my-4"
          alt=""
        />

        <Button />
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="mt-5">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}
