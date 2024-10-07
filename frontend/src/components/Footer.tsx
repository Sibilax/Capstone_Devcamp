import { useLocation } from "react-router-dom";
import "../styles/Footer.scss";
import { FaBook, FaLaptop, FaChalkboardTeacher } from "react-icons/fa";

const Footer: React.FC = () => {
  const location = useLocation(); // Obtengo la ruta actual

  //en la SplashPage renderizo
  if (location.pathname === "/") {
    return (
      <div className="footer-wrapper">
        <div className="footer-messages">
          <FaLaptop size={40} />
          <h1>Learn from home</h1>
        </div>
        <div className="footer-messages">
          <FaLaptop size={40} />
          <h1>Work at your own pace</h1>
        </div>
        <div className="footer-messages">
          <FaChalkboardTeacher size={40} />
          <h1>Challenge yourself</h1>
        </div>
      </div>
    );
  }

  // en cualquier otra página (excepto login/signup), renderizo otro contenido
  return (
    <div className="footer-wrapper">
      <div className="footer-messages">
        <h1>Explore our content and learn more!</h1>
      </div>
    </div>
  );
};

export default Footer;
