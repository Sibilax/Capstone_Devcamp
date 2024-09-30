import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React, { useState } from "react";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import Videos from "./pages/Videos";
import Quizzes from "./pages/Quizzes";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import SplashPage from "./pages/SplashPage";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Iniciamos como 'false', lo que significa que no está logueado. Así sale las splashpage

  return (
    <Router>
      {/* Navbar, la renderizo fuera de las rutas para q esté siempre visible, independientemente de si está logueado o no */}
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />{" "}
      {/*paso props para que pueda verificar si el user está logueado */}
      {/* Aquí defino todas las rutas de la aplicación */}
      <Routes>
        {/* Ruta principal: página que se muestra si el usuario no está logueado */}
        <Route path="/" element={<SplashPage />} />

        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route
          path="/signup"
          element={<SignUp setIsLoggedIn={setIsLoggedIn} />}
        />

        {/* Rutas protegidas: sólo se pueden ver si el usuario está logueado */}
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Home /> // Si el usuario está logueado, muestra la página de cursos.
            ) : (
              <Navigate to="/" />
            ) // Si no está logueado, redirige a la página splash.
          }
        />

        <Route
          path="/blogs"
          element={isLoggedIn ? <Blogs /> : <Navigate to="/" />}
        />

        <Route
          path="/contact"
          element={isLoggedIn ? <Contact /> : <Navigate to="/" />}
        />

        <Route
          path="/videos"
          element={isLoggedIn ? <Videos /> : <Navigate to="/" />}
        />

        <Route
          path="/quizzes"
          element={isLoggedIn ? <Quizzes /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
