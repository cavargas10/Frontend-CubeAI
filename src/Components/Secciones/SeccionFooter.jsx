import logo from "../../Assets/logo.webp";
import { Button } from "../Ui/Button";

export const SeccionFooter = () => {
  return (
    <footer className=" xl:w-full  mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-3">
        <div className=" sm:col-span-1 flex items-center justify-center  sm:border-r-2  sm:border-linea">
          <img src={logo} alt="" className="w-32" />
        </div>

        <div className=" sm:col-span-2  sm:flex sm:flex-col sm:justify-center sm:items-center   sm:px-8">
          <div className="flex flex-col justify-center items-center sm:flex-row sm:gap-20 ">
            <div className=" xl:w-96 sm:w-full">
              <h2 className="text-center text-lg font-bold 2xl:text-2xl">
                COMIENZA TU AVENTURA
              </h2>
              <p className="text-center mt-4 xl:mt-7 2xl:text-lg">
                Empieza a generar objetos 3D unicos gracias al texto o imagen
                que proporciones como entrada.
              </p>
            </div>
            <div className="mt-12">
              <Button />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-4 xl:mt-10 xl:py-4 text-white text-center">
        Copyright UTPL 2024. All rights reserved
      </div>
    </footer>
  );
};