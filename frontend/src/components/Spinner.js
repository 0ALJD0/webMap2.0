import './css/Spinner.css';

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <p>Cargando datos...</p>
    </div>
  );
};

export default Spinner;
