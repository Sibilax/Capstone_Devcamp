import WelcomeMessage from "../components/Welcome_Message";


const SplashPage: React.FC = () => {
  return (
    <div className="splash-midsection-wrapper">
      <div className="splash-welcome-message">
        <WelcomeMessage />
      </div>

      <div className="splash-img">
        <img src="" alt="img" />
      </div>
    </div>
  );
};

export default SplashPage;
