import React from "react";
import { HeaderText } from "../../components/texts/HeaderText";
import HomeButton from "../../components/buttons/HomeButton";
import userApi from "../../services/userApi";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  let navigate = useNavigate();

  const handlesubmit = async () => {
    await userApi.logout();
    navigate("../SignIn", { replace: true });
  };
  return (
    <div className="flex flex-col justify-center align-middle h-full">
      <img
        src="/icons/casque.png"
        width={50}
        className="absolute top-8 right-8"
      />
      <HeaderText
        props={{
          title: "Mes informations",
          subtitle: "",
        }}
      />

      <div className="h-16"></div>
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
          <legend className={`px-2`}>E-mail</legend>
          <input
            className="mb-2 py-1 w-full"
            type="email"
            id="email"
            placeholder="marie.dupont@gmail.com"
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
          <legend className={`px-2`}>Pseudo</legend>
          <input
            className="mb-2 py-1 w-full"
            type="text"
            id="pseudo"
            placeholder="marie_dupont"
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
          <legend className={`px-2`}>Mot de passe</legend>
          <input
            className="mb-2 py-1 w-full"
            type="password"
            id="password"
            placeholder="....."
          />
        </fieldset>
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
          <img className="h-8 w-8" src="/icons/deconnexion.png" />
          Déconnexion
        </button>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="mt-5">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}
