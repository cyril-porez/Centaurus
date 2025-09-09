import React from "react";
import { HeaderText } from "../../../components/texts/HeaderText";
import HomeButton from "../../../components/buttons/HomeButton";
import { useParams, useNavigate } from "react-router-dom";
import horseApi from "../../../services/horseApi";
import TextInput from "../../../components/inputs/TextInput";
import SelectInput from "../../../components/SelectInput";
import Button from "../../../components/buttons/Button";
import { useAuth } from "../../../contexts/AuthContext";
import BottomNav from "../../../components/BottomNav";

function UpdateHorse() {
  const { id } = useParams();
  const { token } = useAuth();
  let navigate = useNavigate();

  const [horse, setHorse] = React.useState({ name: "", age: 0, race: "" });
  const [apiError, setApiError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setApiError("");
      const res = await horseApi.getHorse(id, token);
      if (res?.status === 200) {
        // Le back renvoie généralement { horse: {...} }
        const h = res?.data?.horse ?? res?.data ?? {};
        setHorse({
          name: h?.name ?? "",
          age: Number(h?.age ?? 0),
          race: h?.race ?? "",
        });
      } else {
        const msg = res?.data?.message || "Impossible de charger le cheval.";
        setApiError(msg);
      }
    })();
  }, [id, token]);

  const handleNameChange = (v) => setHorse((p) => ({ ...p, name: v }));
  const handleAgeChange = (v) => setHorse((p) => ({ ...p, age: v }));
  const handleRaceChange = (v) => setHorse((p) => ({ ...p, race: v }));

  const handleSubmit = async () => {
    setApiError("");
    setSaving(true);
    console.log("test");

    const res = await horseApi.UpdateHorse(
      horse.name,
      horse.age,
      horse.race,
      id,
      token
    );
    console.log(res);

    if ([200, 201, 204].includes(res?.status)) {
      navigate("/horses/my-horse/my-horses", { replace: true });
    } else {
      const msg = res?.data?.message || "Échec de la mise à jour du cheval.";
      setApiError(msg);
    }
    setSaving(false);
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
          <BottomNav />
        </div>
      </div>
    </div>
  );
}

export default UpdateHorse;
