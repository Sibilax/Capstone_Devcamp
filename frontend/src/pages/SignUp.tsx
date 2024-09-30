import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; //para redirigir al usuario una vez registrado

const Register = ({
  setIsLoggedIn,
}: {
  setIsLoggedIn: (value: boolean) => void;
}) => {
  //paso props para poder actualizar el estado y que quede (en app) como logueado tras el registro. Defino el tipo directamente sin interfaz. Void --> pq la funciñon no retornará ningún valor útil, puede ser un print, por ejemplo
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPwd, setUserPwd] = useState("");

  const navigate = useNavigate(); //hook de React Router

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    //Especifica el tipo de evento que se está manejando (formulario)
    event.preventDefault(); //evito q se refresque al enviar los datos del form

    try {  //envío datos del registro al backend
      const response = await axios.post("http://localhost:5000/register", {
        user_name: userName,
        user_pwd: userPwd,
        user_email: userEmail,
      });

      if (response.status === 201) {
        console.log("Registration successful!");

        //Login automático o redirigir al usuario, realizo una nueva solicitud POST a la url del login

        const loginResponse = await axios.post("http://localhost:5000/login", {
          user_name: userName, //TODO: Probar el código eliminando este dato de la solicitud *************
          user_pwd: userPwd,
          user_email: userEmail,
        });

        if (loginResponse.status === 200) {
          // Guardo el token en localStorage o manejar la autenticación
          localStorage.setItem("token", loginResponse.data.token); // localStorage.setItem() se usa para almacenar un par clave-valor en localStorage, la api del navegador
          console.log("User logged in successfully!");

          setIsLoggedIn(true); // Actualizo el estado a logged in y redirijo a home donde deben aparecer los cursos
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <form onSubmit={handleRegister}> 
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)} {/*/ Cuando el usuario escribe, el estado que estaba definido como un string vacío "" se actualiza */}
        placeholder="Enter your username"
        required
      />
      <input
        type="text"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)} {/*(e.target.value) es el valor actual que se está pasando al input --> e = event */}
        placeholder="Enter your email"
        required
      />
      <input
        type="password"
        value={userPwd}
        onChange={(e) => setUserPwd(e.target.value)}
        placeholder="Enter your password"
        required
      />
      <button type="submit">Register</button> {/*  Aquí ejecuto <form onSubmit={handleRegister}> */}
    </form>
  );
};

export default Register;
