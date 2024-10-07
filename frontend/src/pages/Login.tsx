import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Form.scss";
import loginImage from "../assets/undraw_sign_up.svg";

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState<string>(""); // Estado para manejar el valor del email
  const [password, setPassword] = useState<string>(""); // Estado para manejar el valor de la contraseña
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const navigate = useNavigate(); // Hook de React Router para redirigir

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Evita que se refresque la página al enviar el formulario

    try {
      // Realiza la solicitud POST solo para usuarios
      const loginResponse = await axios.post("http://localhost:5000/login", {
        user_email: email,
        user_pwd: password,
      });

      if (loginResponse.status === 200) {
        // Almacena el token del usuario en localStorage
        localStorage.setItem("userToken", loginResponse.data.token);
        setIsLoggedIn(true); // Actualiza el estado a logueado

        navigate("/home"); // Redirige a la página de inicio de usuario
      }
    } catch (error: any) {
      // Maneja los errores devueltos por el backend
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="form-page-wrapper">
      <div className="form-image-section">
        <img src={loginImage} alt="img" />
      </div>

      <div className="form-section">
        <form onSubmit={handleLogin}>
          <div className="form-header">
            <h1>Login</h1>
            <p>Good to have you back!</p>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Actualiza el estado del email
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Actualiza el estado de la contraseña
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
          {error && <p className="error-message">{error}</p>}{" "}
          {/* Muestra el error */}
        </form>
      </div>
    </div>
  );
};

export default Login;
