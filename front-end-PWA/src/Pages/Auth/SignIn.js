import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import userApi from "../../services/userApi";
import { HeaderText } from "../../components/texts/HeaderText";
import SocialButton from "../../components/buttons/Social.Button";
// import SocialButton from "../../components/buttons/SocialButton";

function SignIn() {
  const [error, setError] = useState("");
  let navigate = useNavigate();

  const authUser = async (formData) => {
    const response = await userApi.login(formData.email, formData.password);

    const status = response?.status ?? response?.header?.code;
    const payload = response?.data ?? response?.body ?? response;

    console.log("✓ login response", { status, payload });

    if (status === 200) {
      //navigate("/", { replace: true });
    } else {
      setError(
        payload?.details?.[0]?.issue ||
          payload?.message ||
          "Échec de la connexion."
      );
    }
  };

  const schema = yup.object({
    email: yup
      .string()
      .email("*L'email doit être valide")
      .required("* L'email est obligatoire!"),
    password: yup
      .string()
      .required("* Le mot de passe est le mot de passe est obligatoire")
      .matches(/([A-Z])/, "*Au minimum une lettre majuscule!")
      .matches(/([0-9])/, "*Au minimum un entier")
      .min(8, "*Le mot de passe doit avoir 8 caratères"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (formData) => {
    authUser(formData);
  };

  const data = {
    title: "Connexion",
    subtitle: "On est content de te revoir !",
  };
  return (
    <div className="max-h-screen flex justify-center">
      <div className="w-[90%] max-w-[360px] p-[5%]">
        <HeaderText props={data} />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="flex flex-col gap-y-4 mt-1 mb-2">
            <div className="w-full">
              <label className="block mb-1 text-sm text-centaurus-oxford-blue">
                E-mail:
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
                  focus:border-2 focus:border-centaurus-dark-cerelean"
              />
              <p className="text-red mt-1 text-sm">{errors.email?.message}</p>
            </div>

            <div className="w-full">
              <label className="block mb-1 text-sm text-centaurus-oxford-blue">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                placeholder=".........."
                {...register("password")}
                className=" 
                  w-full h-11 px-3
                  rounded-lg 
                  border-2 border-centaurus-oxford-blue
                  focus:outline-none                 
                  focus:border-2 focus:border-centaurus-dark-cerelean"
              />

              <p className="text-red mt-1 text-sm">
                {errors.password?.message}
              </p>
              <p className="text-red mt-1 text-sm">
                {error !== "" ? "*".concat(" ", error) : null}
              </p>
            </div>
          </div>

          <button
            className="
              mt-6 mb-3
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
            Connexion
          </button>

          <Link
            to="/auth/forgot-password"
            className="mb-2 text-sm text-centaurus-oxford-blue hover:underline self-end"
          >
            Mot de passe oublié ?
          </Link>

          <div
            className="
            my-3
            flex 
            items-center
            text-centaurus-oxford-blue
            before:content-['']
            before:flex-grow
            before:border-t
            before:border-centaurus-oxford-blue
            before:mr-4
            after:content-['']
            after:flex-grow
            after:border-t
            after:border-centaurus-oxford-blue
            after:ml-4"
          >
            ou
          </div>

          <div className="flex flex-col gap-3 w-full">
            <SocialButton
              icon="/icons/google.png"
              text="Se connecter avec Google"
              onClick={() => console.log("Google login")}
            />

            <SocialButton
              icon="/icons/apple.png"
              text="Se connecter avec Google"
              onClick={() => console.log("apple login")}
            />
          </div>

          <Link
            className="mx-auto mt-2 text-centaurus-oxford-blue underline text-base"
            to="/auth/sign-up"
          >
            Pas encore de compte ?
          </Link>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
