interface SiteNameProps {
  size: number; // Definir la prop 'size' o si no, no va a funcionar al pasarle el tamaño desde la navbar
}

const SiteName: React.FC<SiteNameProps> = ({ size }) => {
  return <h1 style={{ fontSize: size }}>EFL COMPANION</h1>;
};

export default SiteName;
