import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import userApi from "../../services/userApi";
import HeaderText from "../../components/texts/HeaderText";
import TextInput from "../../components/inputs/TextInput";
import NavigationButton from "../../components/buttons/NavigationButton";

function SignIn() {
  const [error, setError] = useState("");
  let navigate = useNavigate();

  const authUser = async (data) => {
    const login = await userApi.login(data.email, data.password);
    console.log(login);
    if (!login.response) {
      navigate("/", { replace: true });
    } else {
      setError(login.response.data.error.message);
    }
  };

  const schema = yup.object({
    email: yup
      .string()
      .email("L'email doit être valide")
      .required("* L'email est requis"),
    password: yup
      .string()
      .required("* Le mot de passe est requis")
      .matches(/([A-Z])/, "Au minimum une lettre majuscule!")
      .matches(/([0-9])/, "Au minimum un entier")
      .min(8, "Le mot de passe doit avoir 8 caratères"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    authUser(data);
  };
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <HeaderText
        props={{
          title: "Connexion",
          subtitle: "On est content de te revoir !",
        }}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div>
          <fieldset
            className={`
                w-5/6 
                my-2 mx-auto 
                rounded-full 
                border 
                px-8 
            `}
          >
            <legend className="px-2">E-mail</legend>
            <input
              className="mb-2 py-1 w-full"
              type="email"
              id="email"
              placeholder="marie.dupont@gmail.com"
              {...register("email")}
            />
          </fieldset>
          <p className="text-red-600 px-2">{errors.email?.message}</p>
        </div>
        <div>
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
              placeholder="...."
              {...register("password")}
            />
          </fieldset>
          <p className="text-red-600 px-[10%]">{errors.password?.message}</p>
        </div>
        <input
          className="bg-blue-500
                hover:bg-blue-700
                text-white
                font-bold
                rounded-full
                shadow-xl
                py-5 w-80
                mx-auto mt-6"
          type="submit"
        />
        <Link
          className="mx-auto mt-6 text-blue-700 underline text-lg"
          to="/auth/signup"
        >
          S'inscrire
        </Link>
      </form>
    </div>
  );
}

export default SignIn;
