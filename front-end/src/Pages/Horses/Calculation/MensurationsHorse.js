import React, { useEffect, useState } from "react";
import { HeaderText } from "../../../components/texts/HeaderText";
import ToggleInput from "../../../components/inputs/ToggleInput";
import { useNavigate, useParams } from "react-router-dom";
import horseApi from "../../../services/horseApi";
import weightApi from "../../../services/weightApi";
import HomeButton from "../../../components/buttons/HomeButton";

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

  return (
    <div className="flex flex-col h-screen justify-evenly">
      <HeaderText
        props={{
          title: `${horse.name}`,
          subtitle: "Nous avons besoin de ses nouvelles mensurations",
        }}
      />
      {horse.race === "pure sang" ? (
        <>
          <fieldset
            className={`
                        w-5/6 
                        my-2 mx-auto 
                        rounded-full 
                        border 
                        px-8 
                    `}
          >
            <legend className={`px-2`}>Longueur du corps</legend>
            <input
              className="mb-2 py-1 w-full"
              type="text"
              id="bodyLength"
              placeholder="... cm"
              onChange={(e) => setBodyLength(e.target.value)}
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
            <legend className={`px-2`}>Circonférence thoracique</legend>
            <input
              className="mb-2 py-1 w-full"
              type="text"
              id="chestSize"
              placeholder="... cm"
              onChange={(e) => setChestSize(e.target.value)}
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
            <legend className={`px-2`}>Date de la prise de mesure</legend>
            <input
              className="mb-2 py-1 w-full"
              type="date"
              id="date"
              onChange={(e) => setDate(e.target.value)}
            />
          </fieldset>
        </>
      ) : (
        <>
          {/* <div className="flex flex-col h-1/2"> */}
          <fieldset
            className={`
                        w-5/6 
                        my-2 mx-auto 
                        rounded-full 
                        border 
                        px-8 
                    `}
          >
            <legend className={`px-2`}>Hauteur au garrot</legend>
            <input
              className="mb-2 py-1 w-full"
              type="text"
              id="garrotHeight"
              placeholder="... cm"
              onChange={(e) => setGarrotHeight(e.target.value)}
            />
          </fieldset>
          {/* </div> */}
          {/* <div> */}
          <fieldset
            className={`
                        w-5/6 
                        my-2 mx-auto 
                        rounded-full 
                        border 
                        px-8 
                    `}
          >
            <legend className={`px-2`}>Longueur du corps</legend>
            <input
              className="mb-2 py-1 w-full"
              type="text"
              id="bodyLength"
              placeholder="... cm"
              onChange={(e) => setBodyLength(e.target.value)}
            />
          </fieldset>
          {/* </div> */}
          {/* <div> */}
          <fieldset
            className={`
                        w-5/6 
                        my-2 mx-auto 
                        rounded-full 
                        border 
                        px-8 
                    `}
          >
            <legend className={`px-2`}>Circonférence thoracique</legend>
            <input
              className="mb-2 py-1 w-full"
              type="text"
              id="chestSize"
              placeholder="... cm"
              onChange={(e) => setChestSize(e.target.value)}
            />
          </fieldset>
          {/* </div>
      <div> */}
          <fieldset
            className={`
                        w-5/6 
                        my-2 mx-auto 
                        rounded-full 
                        border 
                        px-8 
                    `}
          >
            <legend className={`px-2`}>Circonférence de l'encolure</legend>
            <input
              className="mb-2 py-1 w-full"
              type="text"
              id="neckSize"
              placeholder="... cm"
              onChange={(e) => setNeckSize(e.target.value)}
            />
          </fieldset>
          {/* </div> */}

          <fieldset
            className={`
                        w-5/6 
                        my-2 mx-auto 
                        rounded-full 
                        border 
                        px-8 
                    `}
          >
            <legend className={`px-2`}>Date de la prise de mesure</legend>
            <input
              className="mb-2 py-1 w-full"
              type="date"
              id="date"
              onChange={(e) => setDate(e.target.value)}
            />
          </fieldset>
        </>
      )}
      <img
        src="/images/cheval_lignes_mesure.png"
        width={150}
        className="mx-auto my-4"
      />
      <input
        type="submit"
        onClick={() => handleSubmit()}
        className="bg-blue-500
                hover:bg-blue-700
                text-white
                font-bold
                rounded-full
                shadow-xl
                py-5 w-80
                mx-auto mt-2"
        value="Calculons"
      />
      <div className="flex flex-col justify-center items-center">
        <div className="mt-5">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}
