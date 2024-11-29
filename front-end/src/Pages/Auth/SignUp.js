import { useState } from "react";
import ToggleInput from "../../components/inputs/ToggleInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import userApi from "../../services/userApi";
import HeaderText from "../../components/texts/HeaderText";
import TextInput from "../../components/inputs/TextInput";
import NavigationButton from "../../components/buttons/NavigationButton";
import React from "react";

function SignUp() {
  const [error, setError] = useState("");
  let navigate = useNavigate();

  const createUser = async (data) => {
    const regist = await userApi.register(data.email, data.password, data.name);
    console.log(regist.status);
    if (regist.status === 200) {
      navigate("/SignIn", { replace: false });
    } else {
      setError(regist.response.data.error.message);
    }
  };

  const schema = yup.object({
    name: yup
      .string()
      .required("* Le nom est requis")
      .min(3, "Le nom doit contenir au moins 3 caratères"),
    email: yup
      .string()
      .email("L'email doit être valide")
      .required("* L'email est requis"),
    password: yup
      .string()
      .required("* Le mot de passe est requis")
      .matches(/([A-Z])/, "Doit contenir au moins une majuscule")
      .matches(/([0-9])/, "Doit contenir au moins un chiffre")
      .min(8, "Le mot de passe doit au moins faire 8 caractères"),
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
    console.log(data);
  };

  return (
    <div className="flex flex-col justify-evenly">
      <HeaderText
        props={{
          title: "Inscription",
          subtitle: "Crée ton compte",
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
            <legend className={`px-2`}>E-mail</legend>
            <input
              className="mb-2 py-1 w-full"
              type="email"
              id="email"
              placeholder="marie.dupont@gmail.com"
              {...register("email")}
            />
          </fieldset>
          <p className="text-red-600 px-[10%]">{errors.email?.message}</p>
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
            <legend className={`px-2`}>Nom d'utilisateur</legend>
            <input
              className="mb-2 py-1 w-full"
              type="text"
              id="pseudo"
              placeholder="marie_dupont"
              {...register("name")}
            />
          </fieldset>
          <p className="text-red-600 px-[10%]">{errors.name?.message}</p>
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

        <ToggleInput
          props={{
            text: "J'ai lu et j'accepte les CGU et la politique de confidentialité.",
          }}
        />
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
          to="/auth/signin"
        >
          Se connecter
        </Link>
      </form>
    </div>
  );
}

export default SignUp;
