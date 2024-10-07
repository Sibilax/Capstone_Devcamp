import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import Videos from "./pages/Videos";
import Quizzes from "./pages/Quizzes";
import Login from "./pages/Login";
import LoginAdmin from "./pages/LoginAdmin";
import SignUp from "./pages/SignUp";
import SplashPage from "./pages/SplashPage";
import Results from "./pages/Results";
import VideoItem from "./pages/VideoItem";
import BlogItem from "./pages/BlogItem";
import AdminCrud from "./pages/AdminCrud";

const App: React.FC = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false); // Estado para el login de usuarios
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false); // Estado para el login de administradores

  // Efecto para comprobar el token de login al cargar la app
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const adminToken = localStorage.getItem("adminToken");

    if (userToken) {
      setIsUserLoggedIn(true);
    }

    if (adminToken) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Función para verificar si se debe mostrar el footer
  const shouldShowFooter = () => {
    return (
      location.pathname !== "/login" && // No mostrar footer en la página de login
      location.pathname !== "/signup" // No mostrar footer en la página de signup
    );
  };

  return (
    <Router>
      {/* Navbar, la renderizo fuera de las rutas para que esté siempre visible */}
      <NavBar
        isLoggedIn={isUserLoggedIn || isAdminLoggedIn}
        setIsLoggedIn={isUserLoggedIn ? setIsUserLoggedIn : setIsAdminLoggedIn} // Corregir para manejar ambos estados
      />

      {/* Aquí defino todas las rutas de la aplicación */}
      <Routes>
        {/* Ruta principal: página que se muestra si el usuario no está logueado */}
        <Route path="/" element={<SplashPage />} />

        {/* Rutas de login y signup */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsUserLoggedIn} />}
        />
        <Route
          path="/signup"
          element={<SignUp setIsLoggedIn={setIsUserLoggedIn} />}
        />

        {/* Rutas protegidas para usuarios logueados */}
        <Route
          path="/home"
          element={
            isUserLoggedIn ? (
              <Home /> // Si el usuario está logueado, muestra la página de inicio
            ) : (
              <Navigate to="/" />
            ) // Si no está logueado, redirige a la página splash
          }
        />

        <Route
          path="/blogs"
          element={isUserLoggedIn ? <Blogs /> : <Navigate to="/" />}
        />

        <Route
          path="/contact"
          element={isUserLoggedIn ? <Contact /> : <Navigate to="/" />}
        />

        <Route
          path="/videos"
          element={isUserLoggedIn ? <Videos /> : <Navigate to="/" />}
        />

        <Route
          path="/quizzes"
          element={isUserLoggedIn ? <Quizzes /> : <Navigate to="/" />}
        />

        <Route path="/results" element={<Results />} />
        <Route path="/blog/:blog_id" element={<BlogItem />} />
        <Route path="/video/:video_id" element={<VideoItem />} />

        {/* Ruta para el login de administrador */}
        <Route
          path="/admin/login"
          element={<LoginAdmin setIsLoggedIn={setIsAdminLoggedIn} />} // Usar setIsAdminLoggedIn para admin
        />

        <Route path="/admin/crud" element={<AdminCrud />} />
      </Routes>

      {/* Mostrar el footer según la ruta */}
      {shouldShowFooter() && <Footer />}
    </Router>
  );
};

export default App;
