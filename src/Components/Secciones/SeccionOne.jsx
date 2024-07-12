import { Button } from "../Ui/Button";
import logo from "../../Assets/logo.png";
export const SeccionOne = () => {
  return (
    <section className="mt-20 sm:flex-col sm:mt-10 xl:grid xl:grid-cols-4 xl:w-full xl:mt-0 2xl:-20">
      <div className="text-white font-title  xl:text-left  xl:col-span-2">
        <h1
          className="
          font-extrabold
          sm:text-4xl sm:text-center xl:text-5xl 2xl:text-6xl xl:mt-10 xl:leading-normal xl:text-left
          text-2xl text-center"
        >
          Genere Modelos 3D
          <br />
          <span className="bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text">
            de alta calidad con IA <br />
          </span>{" "}
          en Minutos
        </h1>
        <p className="mt-6  md:w-5/6 md:text-center  md:mx-auto sm:mt-4 xl:text-left xl:mt-5 xl:text-lg 2xl:text-2xl xl:w-full xl:font-sans font-title font-bold  ">
          Transforma palabras o imágenes en piezas artísticas y recurso
          dígitales para tu proyectos utilizando un generador de inteligencia
          artificial que convierte texto o imágenes e modelo 3D.
        </p>
        <div className=" mt-6 flex justify-center  sm:mt-4 sm:flex sm:justify-center xl:mt-10 xl:justify-start ">
          <Button />
        </div>
      </div>

      <div className=" hidden sm:hidden xl:flex xl:justify-center xl:items-center  xl:col-span-2">
        <img src={logo} alt="imagen3D" className="sm:w-28 xl:w-5/12" />
      </div>
    </section>
  );
};