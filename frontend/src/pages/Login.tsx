import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate(); // Hook de React Router para redirigir

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    //Especifico el tipo de evento que se está manejando (formulario en este caso)
    event.preventDefault(); // Evito que se refresque la página

    try {
      // Realizar la solicitud POST para iniciar sesión (debo incluir solo los datos que definí en la solicitud POST)
      const response = await axios.post("http://localhost:5000/login", {
        user_email: email,
        user_pwd: password,
      });

      if (response.status === 200) {
        // Almaceno el token en localStorage si la respuesta es exitosa
        localStorage.setItem("token", response.data.token);
        console.log("User logged in successfully!");

        setIsLoggedIn(true); // Actualizar el estado a logueado
        navigate("/home"); // Redirigir al usuario a la página de inicio (donde los cursos)
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
