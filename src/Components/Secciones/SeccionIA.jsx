import { Button } from "../Ui/Button";
import logo from "../../Assets/logo.png";
export const SeccionIA = () => {
  return (
    <div className="sm:mt-10 xl:mt-40 text-white xl:font-inter font-bold">
      <div className="text-center  ">
        <h2 className=" sm:text-3xl  text-6xl bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text">
          Avanzado en el modelado 3D con IA
        </h2>
        <p className="sm:mt-4 mt-12 mb-14 text-lg ">
          Convierte texto e imágenes en sorpendentes modelo tridimensionales y{" "}
          <br />
          activos para tus proyectos
        </p>
      </div>

      <div className="sm:flex-col   xl:grid xl:grid-cols-4 xl:gap-4">
        <div className="sm:flex-col  xl:col-span-2 ">
          <h3 className=" sm:text-center text-6xl bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text">
            Texto a 3D
          </h3>
          <p className="sm:mt-5 sm:text-lg xl:mt-14 xl:whitespace-normal">
            Nuestra herra mienta de conversión de texto a 3D brinda a los
            creadores la capacidad de generar modelos tridimensionles en un
            minuto,incluso para aquellos sin experiencia previa en el
            ámbito,utilizando simplemente la entrada de texto.
          </p>

          <div className="sm:mt-6 sm:flex sm:justify-center xl:mt-10 ">
            <Button />
          </div>
        </div>

        <div className="sm:hidden xl:flex xl:justify-center xl:items-center  xl:col-span-2">
          <img src={logo} alt="" />
        </div>
      </div>
    </div>
  );
};
