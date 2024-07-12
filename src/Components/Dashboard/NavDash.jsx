import {
  Compass,
  Video,
  Cube,
  Image,
  BookOpen,
  Gear,
  SignOut,
  Textbox,
  Images,
  ArrowLineUpRight,
} from "@phosphor-icons/react";

import { Link, useLocation } from "react-router-dom";

export const NavDash = ({ handleLogout, menuOpen, toggleMenu }) => {
  const location = useLocation();

  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  const handleLinkClick = () => {
    if (menuOpen) {
      toggleMenu();
    }
  };

  return (
    <section
      className={`w-full fixed z-40 2xl:w-[300px] md:w-[252px] mt-2 sm:border-r-2 sm:border-linea bg-principal h-screen 2xl:text-xl ${menuOpen ? "block" : "hidden"} md:block`}
    >
      <div className="flex-grow flex flex-col ">
        <ul className="text-lg w-5/6 mt-2 ml-4 flex-grow">
          <li>
            <Link
              to="visualizador"
              className={
                isActiveRoute("/dashboard/visualizador")
                  ? "w-full py-2 px-1 bg-bg-btn-dash rounded-lg hover:bg-bg-btn-dash-hover flex items-center"
                  : "w-full py-2 px-1 flex items-center hover:bg-bg-btn-dash rounded-lg"
              }
              onClick={handleLinkClick}
            >
              <Compass size={30} color="#6666ff" className="mr-2" />
              <span className="text-2xl sm:text-lg 2xl:text-xl">
                Mis Objetos
              </span>
            </Link>
          </li>
          <li className="mt-3">
            <Link
              to="tutorialdash"
              className={
                isActiveRoute("/dashboard/tutorialdash")
                  ? "w-full py-2 px-1 bg-bg-btn-dash rounded-lg hover:bg-bg-btn-dash-hover flex items-center"
                  : "w-full py-2 px-1 flex items-center hover:bg-bg-btn-dash rounded-lg"
              }
              onClick={handleLinkClick}
            >
              <Video size={30} color="#6666ff" className="mr-2" />
              <span className="text-2xl sm:text-lg 2xl:text-xl ">
                Tutoriales
              </span>
            </Link>
          </li>
        </ul>

        <div className="mt-4 sm:mt-2 ml-6 flex-grow">
          <p className="text-xl sm:text-xl 2xl:text-lg ">Herramientas de IA</p>
          <ul className="mt-3 ml-1 pr-6 flex-grow">
            <li className="my-4 sm:my-1">
              <Link
                to="texto3D"
                className={
                  isActiveRoute("/dashboard/texto3D")
                    ? "w-full py-2 px-1 bg-bg-btn-dash rounded-lg hover:bg-bg-btn-dash-hover flex items-center"
                    : "w-full py-2 px-1 flex items-center hover:bg-bg-btn-dash rounded-lg"
                }
                onClick={handleLinkClick}
              >
                <Textbox size={30} color="#6666ff" className="mr-2" />
                <span className="text-2xl sm:text-lg">Texto a 3D</span>
              </Link>
            </li>

            <li className="my-4 sm:my-1">
              <Link
                to="imagen3D"
                className={
                  isActiveRoute("/dashboard/imagen3D")
                    ? "w-full py-2 px-1 bg-bg-btn-dash rounded-lg hover:bg-bg-btn-dash-hover flex items-center"
                    : "w-full py-2 px-1 flex items-center hover:bg-bg-btn-dash rounded-lg"
                }
                onClick={handleLinkClick}
              >
                <Image size={30} color="#6666ff" className="mr-2" />
                <span className="text-2xl sm:text-lg">Imagen a 3D</span>
              </Link>
            </li>

            <li className="my-4 sm:my-1">
              <Link
                to="textoaimagen"
                className={
                  isActiveRoute("/dashboard/textoaimagen")
                    ? "w-full py-2 px-1 bg-bg-btn-dash rounded-lg hover:bg-bg-btn-dash-hover flex items-center"
                    : "w-full py-2 px-1 flex items-center hover:bg-bg-btn-dash rounded-lg"
                }
                onClick={handleLinkClick}
              >
                <Images size={30} color="#6666ff" className="mr-2" />
                <span className="text-2xl sm:text-lg">Texto A Imagen A 3D</span>
              </Link>
            </li>

            <li className="my-4  sm:my-1 sm:mb-3">
              <Link
                to="unico3D"
                className={
                  isActiveRoute("/dashboard/unico3D")
                    ? "w-full py-2 px-1 bg-bg-btn-dash rounded-lg hover:bg-bg-btn-dash-hover flex items-center"
                    : "w-full py-2 px-1 flex items-center hover:bg-bg-btn-dash rounded-lg"
                }
                onClick={handleLinkClick}
              >
                <Cube size={30} color="#6666ff" className="mr-2" />
                <span className="text-2xl sm:text-lg">Unico A 3D</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t-2 border-linea flex-grow ">
        <div className="border-b-2 border-linea">
          <ul className="text-lg w-5/6 mt-2 ml-4">
            <li className="my-4 sm:my-1">
              <Link
                to="/documentos/documento/titulo1"
                target="_blank"
                className={
                  isActiveRoute("/documentos/documento/titulo1")
                    ? "w-full py-2 px-1 bg-bg-btn-dash rounded-lg hover:bg-bg-btn-dash-hover flex items-center"
                    : "w-full py-2 px-1 flex items-center hover:bg-bg-btn-dash rounded-lg"
                }
                onClick={handleLinkClick}
              >
                <BookOpen size={30} color="#6666ff" className="mr-2" />
                <span className="text-2xl sm:text-lg  ">Documentación</span>
                <ArrowLineUpRight size={25} color="#6A6B77" className="ml-2" />
              </Link>
            </li>

            <li className=" my-4 sm:my-3">
              <Link
                to="configdash"
                className={
                  isActiveRoute("/dashboard/configdash")
                    ? "w-full py-2 px-1 bg-bg-btn-dash rounded-lg hover:bg-bg-btn-dash-hover flex items-center"
                    : "w-full py-2 px-1 flex items-center hover:bg-bg-btn-dash rounded-lg"
                }
                onClick={handleLinkClick}
              >
                <Gear size={30} color="#6666ff" className="mr-2" />
                <span className="text-2xl sm:text-lg">Configuración</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="group mt-4 flex text-lg py-2 w-5/6 ml-4 hover:bg-red-500 rounded-lg">
        <SignOut
          size={30}
          className="mr-2 transform scale-x-[-1] text-[#6666ff] group-hover:text-white"
        />
        <button
          onClick={handleLogout}
          className="btn-logout text-2xl sm:text-lg"
        >
          Cerrar Sesión
        </button>
      </div>
    </section>
  );
};