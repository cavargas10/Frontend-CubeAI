import { Button } from "../Ui/Button";
import logo from "../../Assets/logo.png";
export const SeccionOne = () => {
  return (
    <section className="sm:flex-col sm:mt-10 xl:grid xl:grid-cols-4 xl:w-full xl:mt-0 ">
      <div className="text-white font-title  xl:text-left  xl:col-span-2">
        <h1
          className="
          font-extrabold
          sm:text-3xl sm:text-center xl:text-5xl xl:mt-10 xl:leading-normal xl:text-left 
        "
        >
          Genere Modelos 3D
          <br />
          <span className="bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text">
            de alta calidad con IA <br />
          </span>{" "}
          en Minutos
        </h1>
        <p className="sm:mt-4 xl:mt-5 xl:text-l xl:font-sans font-title font-bold  ">
          Transforma palabras o imágenes en piezas artísticas y recurso
          dígitales para tu proyectos utilizando un generador de inteligencia
          artificial que convierte texto o imágenes e modelo 3D.
        </p>
        <div className=" sm:mt-4 sm:flex sm:justify-center xl:mt-10 xl:justify-start ">
          <Button />
        </div>
      </div>

      <div className=" sm:hidden xl:flex xl:justify-center xl:items-center  xl:col-span-2">
        <img src={logo} alt="imagen3D" className="sm:w-28 xl:w-5/12" />
      </div>
    </section>
  );
};
