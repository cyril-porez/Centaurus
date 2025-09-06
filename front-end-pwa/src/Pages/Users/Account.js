import React from "react";
import { HeaderText } from "../../components/texts/HeaderText";
import HomeButton from "../../components/buttons/HomeButton";
import userApi from "../../services/userApi";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/inputs/TextInput";
import { useAuth } from "../../contexts/AuthContext";

export default function Profile() {
  let navigate = useNavigate();
  const { user, logout } = useAuth();
  const [busy, setBusy] = React.useState(false);

  const [form, setForm] = React.useState({
    email: user?.email || "",
    username: user?.username || "",
    password: "",
  });

  const handleLogout = async () => {
    setBusy(true);
    try {
      await logout();
      navigate("/auth/sign-in", { replace: true });
    } finally {
      setBusy(false);
    }
  };

  const email = {
    label: "Email",
    colorBorder: "border-homa-beige",
    textColor: "text-homa-beige",
    inputBoderColor: "focus:ring-homa-beige",
    type: "email",
    placeholder: "marie.dupont@gmail.com",
  };

  const username = {
    label: "Pseudo",
    colorBorder: "border-homa-beige",
    textColor: "text-homa-beige",
    inputBoderColor: "focus:ring-homa-beige",
    type: "text",
    placeholder: "marie_dupont",
  };

  const password = {
    label: "Mot de passe",
    colorBorder: "border-homa-beige",
    textColor: "text-homa-beige",
    inputBoderColor: "focus:ring-homa-beige",
    type: "password",
    placeholder: "************",
  };
  return (
    <div
      className="
        flex justify-center
        max-h-screen
        px-[5%]
        pb-[max(env(safe-area-inset-bottom),5rem)]
        pt-[max(env(safe-area-inset-top),1rem)]
      "
    >
      <div className="w-[90%] max-w-[360px]">
        <HeaderText
          props={{
            title: "Mes informations",
            subtitle: "",
          }}
        />

        <div className="flex flex-col gap-y-4 mt-3 mb-2 py-8 my-auto">
          <TextInput
            props={email}
            value={form.email}
            onValueChange={(v) => setForm((f) => ({ ...f, email: v }))}
          />
          <TextInput
            props={username}
            value={form.username}
            onValueChange={(v) => setForm((f) => ({ ...f, username: v }))}
          />
          <TextInput
            props={password}
            value={""}
            onValueChange={(v) => setForm((f) => ({ ...f, password: v }))}
          />
        </div>

        <button
          className="flex items-center justify-evenly py-8 w-56 mx-auto"
          type="submit"
          onClick={() => handleLogout()}
        >
          <img
            className="h-8 w-8"
            src="/icons/deconnexion.png"
            alt="deconexion"
          />
          Déconnexion
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="mx-auto w-full max-w-[360px] flex justify-center">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}
