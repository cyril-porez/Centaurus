import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import horseApi from "../../../services/horseApi";
import { HeaderText } from "../../../components/texts/HeaderText";
import HomeButton from "../../../components/buttons/HomeButton";
import TextInput from "../../../components/inputs/TextInput";
import SelectInput from "../../../components/SelectInput";
import Button from "../../../components/buttons/Button";
import { useAuth } from "../../../contexts/AuthContext";

function AddHorse() {
  let navigate = useNavigate();
  const { user, token, initializing } = useAuth();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [apiError, setApiError] = React.useState("");

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

    setApiError("");
    if (!user?.id) {
      // pas d'utilisateur chargé → on renvoie vers la connexion
      navigate("/auth/sign-in", { replace: true });
      return;
    }
    if (!name || !age || !category) {
      setApiError("Veuillez renseigner tous les champs.");
      return;
    }
    setSubmitting(true);
    try {
      console.log("avant res dans try");

      // adapte si ton service attend d'autres noms de champs (race vs category)
      const res = await horseApi.AddHorse(name, Number(age), category, token);
      console.log(res);

      // compat: selon ton wrapper (axios vs fetch):
      const status = res?.status;
      if (status === 201) {
        navigate("/horses/my-horse/my-horses", { replace: false });
      } else {
        const msg = res?.data?.message || "Échec de la création du cheval.";
        setApiError(msg);
      }
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Échec de la création du cheval.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
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
