import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import clienteAxios from "../config/axios";
const Register = ({ onRegistration, online }) => {
  const [username, setUsername] = useState("");
  
  const handleRegistration = async (e) => {
    e.preventDefault();
    if (username.trim() !== "") {
      // Verificar si el usuario existe en la base de datos
      try {
        const { data } = await clienteAxios.post("/check-username", {
          username,
        });

        if (data.userExists) {
          onRegistration(username);
        } else {
          // Registrar al usuario si no existe
          await clienteAxios.post("/register", { username });
          onRegistration(username);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Ingrese un Apodo/NickName");
    }
  };

  return (
    <div className="min-h-screen h-screen flex justify-center flex-col items-center  ">
      <Toaster position="top-center" richColors />
      <div className="flex justify-center items-center">
      <div className="sm:h-3.5 sm:w-3.5 w-3 h-3  rounded-full bg-green-500 mr-2"></div>
      <h1 className="font-bold text-white">
        Online : {online}
      </h1>
      </div>
      <h2 className="text-white font-bold text-md smtext-2xl mb-5">
        Apodo/NickName
      </h2>
      <div className="bg-[#202c33] p-8 rounded-md outline-dashed outline-4 outline-stone-600 ">
        <form
          onSubmit={handleRegistration}
          className=" flex flex-wrap lg:flex-nowrap "
        >
          <input
            className="p-3 focus:outline-none focus:right-1 w-full lg:w-full  "
            type="text"
            placeholder="Ingresa tu nick"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="p-3 bg-[#005c4b]  text-white font-bold w-full lg:w-1/3 "
            onClick={handleRegistration}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
