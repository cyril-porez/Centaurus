// @ts-nocheck
import React, { useState } from "react";
import { HeaderText } from "../../../components/texts/HeaderText";
import { useNavigate, useParams } from "react-router-dom";
import horseApi from "../../../services/horseApi";
import weightApi from "../../../services/weightApi";
import HomeButton from "../../../components/buttons/HomeButton";
import TextInput from "../../../components/inputs/TextInput";
import Button from "../../../components/buttons/Button";
import { useAuth } from "../../../contexts/AuthContext";

export default function Mensurations() {
  const { token } = useAuth();
  const { id: horseId } = useParams();
  const [horse, setHorse] = React.useState({ name: "", age: 0, race: "" });
  const [apiError, setApiError] = React.useState("");
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

  React.useEffect(() => {
    (async () => {
      try {
        const res = await horseApi.getHorse(horseId, token);
        // format attendu: { horse: {...} }
        console.log(res);

        const h = res?.data?.horse ?? {};
        setHorse({ name: h.name ?? "", age: h.age ?? 0, race: h.race ?? "" });
      } catch (e) {
        setApiError(
          e?.response?.data?.message ||
            e?.message ||
            "Erreur lors de la récupération du cheval."
        );
      }
    })();
  }, [horseId, token]);

  // Normalisation de la race (insensible à la casse/espaces)
  const normalized = (horse?.race || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  const isPureSang = normalized === "pur sang";
  const raceKey = normalized.replace(/\s+/g, "-"); // "pur-sang" | "trait/attelage" | "autre"

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
  const calculateAndSaveWeight = async () => {
    const G = horseMesure.chest;
    const L = horseMesure.body;
    const H = horseMesure.garrot;
    const N = horseMesure.neck;

    let weight = null;
    if (raceKey === "pur-sang" || raceKey === "pure-sang") {
      console.log("pure sang");

      weight = Math.ceil((G ** 2 * L) / 11877);
    } else if (raceKey === "trait/attelage") {
      console.log("trait");

      weight = Math.ceil(
        (G ** 1.486 * L ** 0.554 * H ** 0.599 * N ** 0.173) / 3441
      );
    } else {
      // "autre" et défaut
      console.log("autre");

      weight = Math.ceil(
        (G ** 1.486 * L ** 0.554 * H ** 0.599 * N ** 0.173) / 3596
      );
      console.log(weight);
    }
    console.log(horseId);

    const res = await weightApi.addHorseWeight(horseId, weight, token);
    console.log(res);

    return res;
  };

  const handleSubmit = async () => {
    console.log("test");

    setApiError("");
    try {
      const res = await calculateAndSaveWeight();
      console.log(res);

      if ((res?.status ?? 0) === 201) {
        navigate(`/horses/calculation/ResultWeight/${horseId}`, {
          replace: false,
        });
      } else {
        const msg = res?.data?.message || "Échec de l’enregistrement du poids.";
        setApiError(msg);
      }
    } catch (e) {
      setApiError(
        e?.response?.data?.message ||
          e?.message ||
          "Échec de l’enregistrement du poids."
      );
    }
  };

  const hgarot = {
    label: "Hauteur au garrot",
    colorBorder: "border-homa-beige",
    textColor: "text-homa-beige",
    placeholder: "... cm",
    type: "text",
  };

  const lcorp = {
    label: "Longueur du corps",
    colorBorder: "border-red",
    textColor: "text-red",
    placeholder: "... cm",
    type: "text",
  };

  const circThoracique = {
    label: "Circonférence thoracique",
    colorBorder: "border-green-apple",
    textColor: "text-green-apple",
    placeholder: "... cm",
    type: "text",
  };

  const circEncolure = {
    label: "Circonférence de l'encolure",
    colorBorder: "border-orange",
    textColor: "text-orange",
    placeholder: "... cm",
    type: "text",
  };

  const dateMeasure = {
    label: "Date de la prise de mesure",
    colorBorder: "border-homa-brown",
    textColor: "text-homa-brown",
    type: "date",
  };

  // horse.race = "";
  // const isPureSang = horse?.race?.toLowerCase() === "pur sang";

  return (
    <div
      className={[
        "flex justify-center px-4",
        isPureSang
          ? "max-h-screen overflow-hidden" // aucun scroll
          : "min-h-[100svh] overflow-y-auto pb-[calc(max(env(safe-area-inset-bottom),0.75rem)+5rem)]", // scroll si contenu long
      ].join(" ")}
    >
      <div
        className="
          w-[90%] 
          max-w-[360px] 
          
        "
      >
        <HeaderText
          props={{
            title: `${horse?.name}`,
            subtitle: "Nous avons besoin de ses nouvelles mensurations",
          }}
        />
        {isPureSang ? (
          <div className="mt-3 mb-2 space-y-2">
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
              value={horseMesure.date}
              onValueChange={handleDateChange}
            />
          </div>
        ) : (
          <div className="mt-3 mb-2 space-y-2">
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
          </div>
        )}
        <img
          src="/images/cheval_lignes_mesure2.png"
          width={110}
          className="mx-auto my-4"
          alt=""
        />

        <Button name={"Calculons"} onSubmit={() => handleSubmit()} />
      </div>

      <div className="fixed inset-x-0 bottom-0 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="mx-auto w-full max-w-[360px] flex justify-center">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}
