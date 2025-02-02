import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Usar useNavigate en lugar de useHistory
import './css/IntroPage.css'; // Asegúrate de importar el CSS
import { GoMoveToTop } from "react-icons/go";

const IntroPage = () => {
    const navigate = useNavigate();
    const [currentImages, setCurrentImages] = useState([]);
    const [centerImageIndex, setCenterImageIndex] = useState(null);
    const imagesRef = useRef([]);
    const galleryImages = [
        './img/r1.jpg',
        './img/r2.jpg',
        './img/r3.jpg',
        './img/r4.jpg',
        './img/r5.jpeg',
        './img/r6.jpg',
        './img/r7.jpg',
        './img/r8.jpg',
        './img/r9.jpg'
      ];
    
  const sectionsRef = useRef([]);
  const [inView, setInView] = useState(Array(sectionsRef.current.length).fill(false));

    // Cambiar imágenes aleatorias de la galería cada 3 segundos
    useEffect(() => {
        const getRandomImages = () => {
          // Generar 3 índices aleatorios únicos
          let indices = [];
          while (indices.length < 3) {
            const randomIndex = Math.floor(Math.random() * galleryImages.length);
            if (!indices.includes(randomIndex)) {
              indices.push(randomIndex);
            }
          }
          // Asignar las imágenes aleatorias seleccionadas
          setCurrentImages(indices.map(index => galleryImages[index]));
        };
    
        getRandomImages(); // Inicializa con 3 imágenes al cargar
        const intervalId = setInterval(getRandomImages, 3000); // Cambiar imágenes cada 3 segundos
    
        return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
      }, [galleryImages.length]); // Asegurarse de que no se repita si cambia la longitud
      useEffect(() => {
        const handleScroll = () => {
          let closestIndex = 0;
          let minDistance = Number.POSITIVE_INFINITY;
    
          imagesRef.current.forEach((img, index) => {
            if (img) {
              const rect = img.getBoundingClientRect();
              const centerDistance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
              
              if (centerDistance < minDistance) {
                minDistance = centerDistance;
                closestIndex = index;
              }
            }
          });
    
          setCenterImageIndex(closestIndex);
        };
    
        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Ejecutar una vez al inicio
        return () => window.removeEventListener("scroll", handleScroll);
      }, [currentImages]); // Se actualiza cada vez que cambian las imágenes
    
  
  
      // Detectar cuando una sección entra en el viewport
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const index = sectionsRef.current.indexOf(entry.target);
        setInView((prev) => {
          const updated = [...prev];
          updated[index] = entry.isIntersecting; // Activar si está en viewport, desactivar si sale
          return updated;
        });
      });
    }, { threshold: 0.5 });

    sectionsRef.current.forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleButtonClick = () => {
    navigate('/home'); // Redirige a la página de inicio
  };
  const [showButton, setShowButton] = useState(false);
  
  // Detectar el scroll y mostrar/ocultar el botón
  useEffect(() => {
    const handleScroll = () => {
      const lastSection = document.querySelector(".info-section:last-child");
      if (lastSection) {
        const lastSectionBottom = lastSection.getBoundingClientRect().bottom;
        setShowButton(lastSectionBottom < window.innerHeight);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Función para desplazarse al inicio
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300); // Aparece después de 300px de scroll
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="intro-container">
      <div className="intro-content">
        <div className="gallery-images">
          {currentImages.map((image, index) => {
          const isCenter = index === Math.floor(currentImages.length / 2); // Detecta la imagen del centro
          return (
            <img 
              key={index} 
              src={image} 
              alt={`Restaurant ${index + 1}`} 
              className={`gallery-image ${isCenter ? 'center-image' : ''}`}
            />
          );
    })}
  </div>
        <div className="intro-data">
            <h1 className="intro-title">¡Bienvenido al Mapa Virtual Turístico Alimenticio!</h1>
            <p className="intro-description">
            Explora los mejores establecimientos de comida en tu zona. Descubre restaurantes, 
            cafeterías, y más, con información detallada sobre cada uno.
            </p>
            <button className="intro-button" onClick={handleButtonClick}>¡Comienza a explorar!</button>
        </div>

      </div>
      
      <div className="arrow-container">
        <img src="./img/chevron-down.png" alt="Desliza hacia abajo" className="arrow" />
      </div>

      <div className="info-scroll">
          <div 
            className={`floating-title ${inView[0] ? 'fade-in' : ''}`} 
            ref={(el) => (sectionsRef.current[0] = el)}
          >
            <h1>¿Qué puedes hacer en nuestra aplicación?</h1>
          </div>
        <div 
          className={`info-section ${inView[1] ? 'fade-in' : ''}`} 
          ref={(el) => (sectionsRef.current[1] = el)}
        >
          <div className="info-content">
            <div className="info-text">
              <h2>Usar el mapa de establecimientos</h2>
              <p>
                Dentro del mapa interactivo podrás explorar los establecimientos alimenticios recopilados en nuestra base de datos. 
                Podrás buscarlos por nombre o ubicación y encontrar el que mejor se adapte a tus necesidades.
                Tienes un sinnúmero de opciones de filtrado y características para hacer tu búsqueda más sencilla. 
              </p>
            </div>
            <div className="info-image">
              <img src="./img/MapaInteractivo.jpeg" alt="Mapa interactivo" />
            </div>
          </div>
        </div>

        <div 
          className={`info-section ${inView[2] ? 'fade-in' : ''}`} 
          ref={(el) => (sectionsRef.current[2] = el)}
        >
          <div className="info-content">
            <div className="info-text">
              <h2>Preguntarle a nuestro Agente Virtual con IA</h2>
              <p>
              ¿Tienes alguna duda? Nuestro agente virtual está aquí para asistirte en todo momento. 
              Con él, podrás descubrir las mejores opciones que se adapten a tus necesidades. 
              Puedes preguntarle desde tipos de comida que te apetezcan hasta los horarios de atención. 
              El agente siempre estará disponible para ayudarte con tus dudas.
              </p>
          </div>
          <div className="info-image">
            <img src="./img/AgenteVirtual.jpeg" alt="Agente virtual" />
          </div>
        </div>
        </div>

        <div 
          className={`info-section ${inView[3] ? 'fade-in' : ''}`} 
          ref={(el) => (sectionsRef.current[3] = el)}
        >
          <div className="info-content">
            <div className="info-text">
              <h2>Galería de Establecimientos</h2>
              <p>Explora los mejores lugares para disfrutar de una buena comida.</p>
            </div>
            <div className="info-image">
              <img src="/ruta-de-tu-imagen3.jpg" alt="Galería de establecimientos" />
            </div>
          </div>
        </div>
      </div>
                      
      <div className="intro-footer">
        <p>Administrado por el Observatorio Territorial ULEAM</p>
      </div>

      <div className={`scroll-to-top ${showButton ? 'visible' : ''}`} onClick={handleScrollToTop}>
        <GoMoveToTop />
      </div>

    </div>
     
  );
};
export default IntroPage;
