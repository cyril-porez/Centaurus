import React from "react";
import { useState } from "react";
import ToggleInput from "../../components/inputs/ToggleInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import userApi from "../../services/userApi";
import { HeaderText } from "../../components/texts/HeaderText";

function SignUp() {
  const [error, setError] = useState("");
  let navigate = useNavigate();

  const createUser = async (data) => {
    const fetchData = await userApi.register(
      data.email,
      data.password,
      data.name
    );
    if (fetchData.header.code === 201) {
      navigate("/auth/sign-in", { replace: false });
    } else {
      setError(fetchData.body.details[0].issue);
    }
  };

  const schema = yup.object({
    name: yup
      .string()
      .required("* Le nom est obligatoire !")
      .min(3, "* Le nom doit contenir au moins 3 caratères !"),
    email: yup
      .string()
      .email("* L'email doit être valide")
      .required("* L'email est obligatoire"),
    password: yup
      .string()
      .required("* Le mot de passe est obligatoire !")
      .matches(
        /([A-Z])/,
        "* Le mot de passe Doit contenir au moins une majuscule !"
      )
      .matches(
        /([0-9])/,
        "* Le mot de passe Doit contenir au moins un chiffre !"
      )
      .min(8, "* Le mot de passe doit au moins faire 8 caractères !"),
    confirmPassword: yup
      .string()
      .required("* La vérification du mot de passe est obligatoire !")
      .matches(
        /([A-Z])/,
        "* Le mot de passe Doit contenir au moins une majuscule !"
      )
      .matches(
        /([0-9])/,
        "* Le mot de passe Doit contenir au moins un chiffre !"
      )
      .min(8, "* Le mot de passe doit au moins faire 8 caractères !"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    createUser(data);
  };

  const data = {
    title: "Inscription",
    subtitle: "Crée ton compte",
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
        <HeaderText props={data} />
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div
            className="flex 
                        flex-col 
                        items-center 
                        justify-center 
                        min-h-[400px]"
          >
            <div className="mb-[5%] w-full">
              <fieldset
                className="w-full
                        mx-auto
                        rounded-lg
                        border
                        border-homa-beige
                        p-[4%]"
              >
                <legend className="text-sm text-homa-beige">E-mail</legend>
                <input
                  type="email"
                  id="email"
                  placeholder="marie.dupont@gmail.com"
                  {...register("email")}
                  className="w-full focus:outline-none focus:ring-2 focus:ring-homa-beige"
                />
              </fieldset>
              <p className="text-red mt-[2%]">{errors.email?.message}</p>
            </div>

            <div className="mb-[5%] w-full">
              <fieldset
                className="w-full
                        mx-auto
                        rounded-lg
                        border
                        border-homa-beige
                        p-[4%]"
              >
                <legend className="text-sm text-homa-beige">
                  Nom d'utilisateur
                </legend>
                <input
                  type="text"
                  id="pseudo"
                  placeholder="marie_dupont"
                  {...register("name")}
                  className="w-full 
                              focus:outline-none 
                              focus:ring-2 
                              focus:ring-homa-beige"
                />
              </fieldset>
              <p className="text-red mt-[2%]">{errors.name?.message}</p>
            </div>

            <div
              className="mb-[5%] 
                          w-full"
            >
              <fieldset
                className="w-full
                        mx-auto
                        rounded-lg
                        border
                        border-homa-beige
                        p-[4%]"
              >
                <legend className="text-sm text-homa-beige">
                  Mot de passe
                </legend>
                <input
                  type="password"
                  id="password"
                  placeholder="........"
                  {...register("password")}
                  className="w-full 
                              focus:outline-none 
                              focus:ring-2 
                              focus:ring-homa-beige"
                />
              </fieldset>
              <p className="text-red mt-[2%]">{errors.password?.message}</p>
            </div>

            <div
              className="mb-[5%] 
                          w-full"
            >
              <fieldset
                className="w-full
                        mx-auto
                        rounded-lg
                        border
                        border-homa-beige
                        p-[4%]"
              >
                <legend className="text-sm text-homa-beige">
                  Confirmes ton mot de passe
                </legend>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="........"
                  {...register("confirmPassword")}
                  className="w-full 
                              focus:outline-none 
                              focus:ring-2 
                              focus:ring-homa-beige"
                />
              </fieldset>
              <p className="text-red mt-[2%]">
                {errors.confirmPassword?.message}
              </p>
              <p className="text-red mt-[2%]">
                {error !== "" ? error.concat(" ", "*") : null}
              </p>
            </div>

            <ToggleInput text=" J'ai lu et j'accepte les CGU et la politique de confidentialité." />
          </div>
          <button
            className="bg-sky-blue
                hover:bg-sky-blue-hover
                text-white
                text-xl
                font-bold
                rounded-full
                shadow-lg
                w-full 
                p-[10px] 
                py-5 w-80
                mx-auto
                transition
                duration-300
                flex
                items-center
                justify-center"
            type="submit"
          >
            <span className="mt-2">Suivant</span>
            <span className="text-[40px] font-extrabold ml-1 align-middle">
              {">"}
            </span>
          </button>
          <Link
            className="mx-auto mt-6 text-sky-blue underline text-2xl"
            to="/auth/sign-in"
          >
            Se connecter
          </Link>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
