import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const About = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  useEffect(() => {
    setPrevLocation(location?.state?.data);
  }, [location]);
  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Nosotros" prevLocation={prevLocation} />
      <div className="flex flex-col items-center my-6 w-full">
        <div className="w-full md:w-1/2 lg:w-1/3 h-auto justify-center items-center">
          <h1 className="max-w-[600px] text-base text-lightText mb-2 text-center">
            <span className="text-primeColor font-semibold text-lg">Tienda de Autor</span>{" "}
          </h1>
          <div className="text-lightText text-base my-4">
            <p>
              “Tienda de Autor” nace para complacer tus gustos y expectativas. En nuestra góndola virtual vas a encontrar productos exclusivos, delicados y únicos, realizados por reconocidos maestros y maestras artesanas de la Patagonia Argentina.
            </p>
            <p>
              Si buscas un regalo especial, si necesitas destacarte o simplemente darte un gusto que te haga feliz, en “Tienda de Autor” tenemos ese producto, y te va a llegar hasta la puerta de tu casa sin gastos de envío. Además, con cada compra te entregamos un certificado de autenticidad que demuestra que tu producto es único y creado de manera artesanal.
            </p>
            <p>
              Seguinos en redes sociales y suscribite al newsletter semanal, para recibir en tu cuenta de correo las novedades que tenemos para vos. Nuestros canales de comunicación están abiertos los 365 días del año, porque sabemos que es común que puedan surgirte imprevistos y que necesites un producto especial en un tiempo mínimo.
            </p>
          </div>
          <Link to="/tienda" >
            <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300">
              Continuar Comprando
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
