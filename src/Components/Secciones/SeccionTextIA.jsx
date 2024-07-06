import { Button } from "../Ui/Button";
import logo from "../../Assets/logo.png";
import { palabras } from "../../Data/data";
import { SeccionCarrusel } from "./SeccionCarrusel";

export const SeccionTextIA = () => {
  const carusel = [...palabras, ...palabras];
  return (
    <div className="xl:grid xl:grid-cols-4 xl:gap-4 mt-20 font-inter font-bold text-white">
      <div className="sm:flex sm:flex-col sm:items-center xl:col-span-2  xl:flex-coljustify-between">
        <h3 className="text-6xl bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text">
          Imagen a 3D
        </h3>
        <p className="sm:mt-8 xl:mt-14">
          Nuestra herramienta de texto a 3D empodera a los creadores, incluso a
          aquellos sin experiencia previa en modelos 3D, para crear modelos
          tridimensionales en solo un minuto mediante la introducción de una
          imagen.
        </p>
        <div className="sm:mt-8 xl:mt-12">
          <Button />
        </div>
      </div>
      <div className="sm:hidden xl:visible xl:flex xl:justify-center xl:items-cente xl:col-span-2">
        <img src={logo} alt="" />
      </div>
    </div>
  );
};
