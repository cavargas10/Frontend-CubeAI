import fondo from "../../Assets/fondo.png";
import { Button } from "../Ui/Button";
export const SeccionFondo = () => {
  return (
    <div className="sm:mt-2 relative h-screen ">
      <img
        src={fondo}
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover  object-center opacity-20"
      />

      <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
        <h1 className="text-3xl w-2/3 text-center sm:text-5xl xl:text-6xl bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text font-inter font-bold mb-10">
          ¿Preparado para que tu socio de IA genere objetos 3D únicos?
        </h1>
        <Button />
      </div>
    </div>
  );
};