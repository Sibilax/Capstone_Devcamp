import Logo from "./Logo";
import SiteName from "./SiteName";
import SearchBar from "./SearchBar";
import { NavLink, useLocation } from "react-router-dom";
import "../styles/NavBar.scss";

interface NavBarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBar: React.FC<NavBarProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };

  let navbarContent;

  if (
    !isLoggedIn &&
    (location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/signup")
  ) {
    // Navbar para la splashpage, login y signup cuando el usuario NO está logueado
    navbarContent = (
      <div className="navbar-splash">
        <div className="navbar-splash-name">
          <SiteName size={60} />
        </div>
        <div className="navbar-splash-auth-links">
          <NavLink
            to="/signup"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Sign Up
          </NavLink>
          <hr />
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Log In
          </NavLink>
        </div>
      </div>
    );
  } else if (isLoggedIn) {
    // Navbar para cuando el usuario está logueado
    navbarContent = (
      <div className="navbar-nav-links-wrapper">
        <NavLink
          to="/home"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/blogs"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Blogs
        </NavLink>
        <NavLink
          to="/quizzes"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Quizzes
        </NavLink>
        <NavLink
          to="/videos"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Videos
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Contact
        </NavLink>

        <button onClick={handleLogout}>Sign Out</button>
      </div>
    );
  } else {
    navbarContent = null;
  }

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-logo">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <Logo size={150} />
        </NavLink>
      </div>
      {navbarContent}

      {/* Renderizo la searchbar solo si se está logueado */}
      {isLoggedIn && (
        <div className="navbar-searchbar">
          <SearchBar />
        </div>
      )}
    </nav>
  );
};

export default NavBar;
