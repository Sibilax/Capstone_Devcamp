import Logo from "./Logo";
import SiteName from "./SiteName";
import { NavLink, useLocation } from "react-router-dom"; //hook de react-router-dom para acceder a la ubucación(URL) actual
import "../styles/NavBar.scss";

interface NavBarProps {
  //requiere props, tipo de dato y acción a despachar
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; //similar al uso de acciones para manejar edos en redux
}

const NavBar: React.FC<NavBarProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  //props del hook useState de app.tsx
  const location = useLocation();

  const handleLogout = () => {
    setIsLoggedIn(false); // Cambia a 'false' para simular un logout
  };

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-logo">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <Logo size={200} />
        </NavLink>
      </div>

      {/* Renderizo contenido diferente basado en si el usuario está en la SplashPage o si está logueado */}
      {location.pathname === "/" && !isLoggedIn ? (
        // Usuario en la SplashPage y no logueado, pasar props al logo desde el componente para q se admitan aquí
        <>
          <div className="navbar-center">
            <SiteName size={60} />
          </div>
          <div className="navbar-left">
            <div className="navbar-auth-links">
              <NavLink
                to="/signup"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Sign Up
              </NavLink>
            </div>
            <div className="navbar-auth-links">
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Log In
              </NavLink>
            </div>
          </div>
        </>
      ) : isLoggedIn ? (
        // Usuario logueado, muestro la navbar con los links, debo usar la nueva sintaxis para la clase active
        <div className="navbar-nav-links-wrapper">
          <div className="navbar-nav-links">
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? "active" : "")} //nueva sintaxis a partir de version 6
            >
              Home
            </NavLink>
          </div>
          <div className="navbar-nav-links">
            <NavLink
              to="/blogs"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Blogs
            </NavLink>
          </div>
          <div className="navbar-nav-links">
            <NavLink
              to="/quizzes"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Quizzes
            </NavLink>
          </div>
          <div className="navbar-nav-links">
            <NavLink
              to="/videos"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Videos
            </NavLink>
          </div>
          <div className="navbar-nav-links">
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Contact
            </NavLink>
          </div>
          <button onClick={handleLogout}>Sign Out</button>
        </div>
      ) : null}
    </nav>
  );
};

export default NavBar;
