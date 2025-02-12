import React from "react";
import { HeaderText } from "../../components/texts/HeaderText";
import HomeButton from "../../components/buttons/HomeButton";
import userApi from "../../services/userApi";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/inputs/TextInput";

export default function Profile() {
  let navigate = useNavigate();

  const handlesubmit = async () => {
    await userApi.logout();
    navigate("../SignIn", { replace: true });
  };

  const email = {
    legend: "Email",
    colorBorder: "border-homa-beige",
    textColor: "text-homa-beige",
    inputBoderColor: "focus:ring-homa-beige",
    type: "email",
    placeholder: "marie.dupont@gmail.com",
  };

  const Pseudo = {
    legend: "Pseudo",
    colorBorder: "border-homa-beige",
    textColor: "text-homa-beige",
    inputBoderColor: "focus:ring-homa-beige",
    type: "text",
    placeholder: "marie_dupont",
  };

  const password = {
    legend: "Mot de passe",
    colorBorder: "border-homa-beige",
    textColor: "text-homa-beige",
    inputBoderColor: "focus:ring-homa-beige",
    type: "password",
    placeholder: "************",
  };
  return (
    <div
      className="flex flex-col 
                  items-center
                  max-h-screen"
    >
      <img
        src="/icons/casque.png"
        width={50}
        className="absolute top-8 right-8"
        alt="logo casque cavalier"
      />
      <div
        className="w-[90%] 
                    max-w-[400px] 
                    p-[5%]"
      >
        <HeaderText
          props={{
            title: "Mes informations",
            subtitle: "",
          }}
        />

        <div
          className="flex 
                      flex-col 
                      items-center 
                      justify-center 
                      min-h-[400px]"
        >
          <TextInput props={email} />
          <TextInput props={Pseudo} />
          <TextInput props={password} />
        </div>
      </div>
      <button
        className="
                    flex
                    items-center
                    justify-evenly
                    py-1 w-56
                    mx-auto"
        type="submit"
        onClick={() => handlesubmit()}
      >
        <img
          className="h-8 w-8"
          src="/icons/deconnexion.png"
          alt="deconexion"
        />
        Déconnexion
      </button>
      <div className="flex flex-col justify-center items-center">
        <div className="mt-5">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}
