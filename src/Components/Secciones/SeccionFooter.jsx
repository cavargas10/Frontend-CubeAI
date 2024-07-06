import logo from "../../Assets/logo.png";
import { Button } from "../Ui/Button";
import { ArrowCircleRight } from "@phosphor-icons/react";
export const SeccionFooter = () => {
  return (
    <footer className="sm:w-5/6 sm:mx-auto xl:w-full  mt-10">
      <div className=" grid grid-cols-3 ">
        <div className=" col-span-1  flex flex-col  border-r-2 border-linea py-20 pr-10  pl-2">
          <h2 className="text-lg font-bold  ">PONERSE EN CONTACTO</h2>
          <p className="sm:mt-7">
            Obtenga alertas sobre novedades y consiga preferencias para acceder
            a nuevos servicios.
          </p>

          <form className=" relative mb-4 mt-10 sm:w-80">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            ></label>
            <input
              className=" shadow  bg-principal appearance-none border-b-2 border-linea  rounded w-full py-3 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Dirección Email "
            />

            <div className="absolute inset-y-0 right-0 flex items-center pr-3 ">
              <ArrowCircleRight size={32} color="#6666ff" weight="fill" />
            </div>
          </form>
        </div>

        <div className=" col-span-1 flex items-center justify-center  border-r-2  border-linea">
          <img src={logo} alt="" className="w-32" />
        </div>

        <div className="col-span-1  flex flex-col justify-center items-center   px-8">
          <h2 className="text-lg font-bold">COMIENZA TU AVENTURA</h2>
          <p className="xl:mt-7">
            Empieza a generar objetos 3D unicos gracias al texto o imagen que
            proporciones como entrada.
          </p>
          <div className="mt-12">
            <Button />
          </div>
        </div>
      </div>

      <div className="sm:mt-4 xl:mt-10 xl:py-4 text-white text-center">
        Copyright UTPL 2024. All rights reserved
      </div>
    </footer>
  );
};
