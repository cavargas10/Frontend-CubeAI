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
  
  export const NavDash = ({ handleLogout }) => {
    const location = useLocation();
  
    const isActiveRoute = (route) => {
      return location.pathname === route;
    };
  
    return (
      <section className="fixed z-100 w-[252px] mt-2 border-r-2  border-linea  bg-principal h-screen">
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
              >
                <Compass size={30} color="#6666ff" className="mr-2" />
                <span>Mis Objetos</span>
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
              >
                <Video size={30} color="#6666ff" className="mr-2" />
                <span>Tutoriales</span>
              </Link>
            </li>
          </ul>
  
          <div className="mt-2 ml-6 flex-grow">
            <p>Herramientas de IA</p>
            <ul className="mt-3 ml-1 pr-6 flex-grow">
              <li className="my-1">
                <Link
                  to="texto3D"
                  className={
                    isActiveRoute("/dashboard/texto3D")
                      ? "w-full py-2 px-1 bg-bg-btn-dash rounded-lg hover:bg-bg-btn-dash-hover flex items-center"
                      : "w-full py-2 px-1 flex items-center hover:bg-bg-btn-dash rounded-lg"
                  }
                >
                  <Textbox size={30} color="#6666ff" className="mr-2" />
                  <span>Texto a 3D</span>
                </Link>
              </li>
  
              <li className="my-1 ">
                <Link
                  to="imagen3D"
                  className={
                    isActiveRoute("/dashboard/imagen3D")
                      ? "w-full py-2 px-1 bg-bg-btn-dash rounded-lg hover:bg-bg-btn-dash-hover flex items-center"
                      : "w-full py-2 px-1 flex items-center hover:bg-bg-btn-dash rounded-lg"
                  }
                >
                  <Image size={30} color="#6666ff" className="mr-2" />
                  <span>Imagen a 3D</span>
                </Link>
              </li>
  
              <li className="my-1 ">
                <Link
                  to="textoaimagen"
                  className={
                    isActiveRoute("/dashboard/textoaimagen")
                      ? "w-full py-2 px-1 bg-bg-btn-dash rounded-lg hover:bg-bg-btn-dash-hover flex items-center"
                      : "w-full py-2 px-1 flex items-center hover:bg-bg-btn-dash rounded-lg"
                  }
                >
                  <Images size={30} color="#6666ff" className="mr-2" />
                  <span>Texto A Imagen A 3D</span>
                </Link>
              </li>
  
              <li className="my-1 mb-3">
                <Link
                  to="unico3D"
                  className={
                    isActiveRoute("/dashboard/unico3D")
                      ? "w-full py-2 px-1 bg-bg-btn-dash rounded-lg hover:bg-bg-btn-dash-hover flex items-center"
                      : "w-full py-2 px-1 flex items-center hover:bg-bg-btn-dash rounded-lg"
                  }
                >
                  <Cube size={30} color="#6666ff" className="mr-2" />
                  <span>Unico A 3D</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
  
        <div className="border-t-2 border-linea flex-grow">
          <div className="border-b-2 border-linea">
            <ul className="text-lg w-5/6 mt-2 ml-4">
              <li className="">
                <Link
                  to="/documentos/documento/titulo1"
                  target="_blank"
                  className={
                    isActiveRoute("/documentos/documento/titulo1")
                      ? "w-full py-2 px-1 bg-bg-btn-dash rounded-lg hover:bg-bg-btn-dash-hover flex items-center"
                      : "w-full py-2 px-1 flex items-center hover:bg-bg-btn-dash rounded-lg"
                  }
                >
                  <BookOpen size={30} color="#6666ff" className="mr-2" />
                  <span>Documentación</span>
                  <ArrowLineUpRight size={25} color="#6A6B77" className="ml-2" />
                </Link>
              </li>
  
              <li className=" my-3">
                <Link
                  to="configdash"
                  className={
                    isActiveRoute("/dashboard/configdash")
                      ? "w-full py-2 px-1 bg-bg-btn-dash rounded-lg hover:bg-bg-btn-dash-hover flex items-center"
                      : "w-full py-2 px-1 flex items-center hover:bg-bg-btn-dash rounded-lg"
                  }
                >
                  <Gear size={30} color="#6666ff" className="mr-2" />
                  <span>Configuración</span>
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
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </section>
    );
  };
  