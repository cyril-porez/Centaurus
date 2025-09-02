// @ts-nocheck
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
    const res = await userApi.register(data.email, data.password, data.name);
    if (res.ok && (res.status === 201 || res.status === 200)) {
      navigate("/auth/sign-in", { replace: false });
    } else {
      const msg =
        res?.data?.details?.[0]?.issue ||
        res?.data?.message ||
        "Inscription impossible.";
      setError(msg);
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
    <div className="flex justify-center max-h-screen">
      <div className="w-[90%] max-w-[360px] p-[5%]">
        <HeaderText props={data} />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="flex flex-col gap-y-3 mt-3 mb-2">
            <div className="w-full">
              <label className="*block mb-1 text-sm text-centaurus-oxford-blue">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                placeholder="marie.dupont@gmail.com"
                {...register("email")}
                className="
                    w-full h-11 px-3
                    rounded-md
                    border-2 border-centaurus-oxford-blue
                    focus:outline-none
                    focus:border-2 focus:border-centaurus-dark-cerelean
                  "
              />
              <p className="text-red mt-1 text-sm">{errors.email?.message}</p>
            </div>

            <div className="w-full">
              <label className="block mb-1 text-sm text-centaurus-oxford-blue">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="pseudo"
                placeholder="marie_dupont"
                {...register("name")}
                className="
                  w-full h-11 px-3
                  rounded-md
                  border-2 border-centaurus-oxford-blue
                  focus:outline-none
                  focus:border-2 focus:border-centaurus-dark-cerelean  
                "
              />
              <p className="text-red mt-1 text-sm">{errors.name?.message}</p>
            </div>

            <div className="w-full">
              <legend className="block mb-1 text-sm text-centaurus-oxford-blue">
                Mot de passe
              </legend>
              <input
                type="password"
                id="password"
                placeholder="........"
                {...register("password")}
                className="
                  w-full h-11 px-3
                  rounded-md
                  border-2 border-centaurus-oxford-blue
                  focus:outline-none
                  focus:border-2 focus:border-centaurus-dark-cerelean
                "
              />

              <p className="text-red mt-1 text-sm">
                {errors.password?.message}
              </p>
            </div>

            <div className="w-full">
              <label className="block mb-1 text-sm text-centaurus-oxford-blue">
                Confirmes ton mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="........"
                {...register("confirmPassword")}
                className="
                  w-full h-11 px-3
                  rounded-md
                  border-2 border-centaurus-oxford-blue
                  focus:outline-none
                  focus:border-2 focus:border-centaurus-dark-cerelean
                "
              />
              <p className="text-red mt-1 text-sm">
                {errors.confirmPassword?.message}
              </p>
              <p className="text-red mt-1 text-sm">
                {error !== "" ? error.concat(" ", "*") : null}
              </p>
            </div>
          </div>

          <button
            className="
              mt-4 mb-1
              inline-flex items-center justify-center
              w-full h-12
              rounded-md
              bg-centaurus-dark-cerelean text-white
              text-base font-medium
              shadow-md shadow-black/10
              hover:brightness-110
              active:translate-y-px
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-centaurus-oxford-blue
              transition
            "
            type="submit"
          >
            Inscription
          </button>
          <Link
            className="mx-auto mt-6 text-centaurus-oxford-blue underline text-base"
            to="/auth/sign-in"
          >
            Déjà un compte
          </Link>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
