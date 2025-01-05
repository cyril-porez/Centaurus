import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import userApi from "../../services/userApi";
import { HeaderText } from "../../components/texts/HeaderText";

function SignIn() {
  const [error, setError] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    console.log("test");
  });

  const authUser = async (data) => {
    console.log(data);

    const login = await userApi.login(data.email, data.password);
    console.log(login);
    if (!login.response) {
      // navigate("/", { replace: true });
    } else {
      // setError();
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

  const onSubmit = (data) => {
    console.log("test");

    console.log(data);
    authUser(data);
  };

  const data = {
    title: "Connexion",
    subtitle: "On est content de te revoir !",
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex 
                      flex-col"
        >
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

            <div className="mb-[6%] w-full">
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
                  placeholder=".........."
                  {...register("password")}
                  className="w-full focus:outline-none focus:ring-2 focus:ring-homa-beige"
                />
              </fieldset>
              <p className="text-red mt-[2%]">{errors.password?.message}</p>
            </div>
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
                py-5
                mx-auto
                transition
                duration-300
                flex
                items-center
                justify-center"
            type="submit"
          >
            <span className="mt-2">C'est reparti</span>
            <span className="text-[40px] font-extrabold ml-1 align-middle">
              {">"}
            </span>
          </button>

          <Link
            className="mx-auto mt-6 text-sky-blue underline text-2xl"
            to="/auth/signup"
          >
            S'inscrire
          </Link>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
