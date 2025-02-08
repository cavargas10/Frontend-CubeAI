import React from "react";
import {
  Compass,
  Video,
  Cube,
  Image,
  BookOpen,
  Textbox,
  Images,
  FileImage,
  Scribble,
  ArrowLineUpRight,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";

export const NavDash = ({ menuOpen, toggleMenu, isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  const handleLinkClick = () => {
    if (menuOpen) {
      toggleMenu();
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <section
      className={`
        fixed z-40 transition-all duration-300 ease-in-out mt-2 
        sm:border-r-2 sm:border-linea bg-principal h-screen
        ${menuOpen ? "block" : "hidden"} sm:block
        ${isCollapsed ? "w-[80px]" : "w-full 2xl:w-[300px] md:w-[267px]"}
      `}
    >
      {/* Collapse button */}
      <button
        onClick={toggleCollapse}
        className="absolute right-[-12px] top-[50%] translate-y-[-50%] z-50 bg-principal p-2 rounded-full border border-linea cursor-pointer hidden sm:block hover:bg-bg-btn-dash"
      >
        {isCollapsed ? <CaretRight size={16} /> : <CaretLeft size={16} />}
      </button>

      <div className="flex flex-col flex-grow">
        {/* Main Section */}
        <ul className={`text-lg ${isCollapsed ? "w-full px-2" : "w-5/6 ml-4"} mt-3 flex-grow`}>
          <li>
            <Link
              to="visualizador"
              className={`
                w-full py-2 px-1 flex items-center
                ${isCollapsed ? "justify-center" : "justify-start"}
                ${isActiveRoute("/dashboard/visualizador")
                  ? "bg-bg-btn-dash hover:bg-bg-btn-dash-hover"
                  : "hover:bg-bg-btn-dash"
                } rounded-lg
              `}
              onClick={handleLinkClick}
              title={isCollapsed ? "Mis Objetos" : ""}
            >
              <Compass
                size={30}
                color="#6666ff"
                className={isCollapsed ? "" : "mr-2"}
              />
              <span 
                className={`
                  whitespace-nowrap overflow-hidden transition-all duration-300
                  ${isCollapsed 
                    ? "w-0 opacity-0" 
                    : "w-full opacity-100 text-2xl sm:text-lg 2xl:text-xl"
                  }
                `}
              >
                Mis Objetos
              </span>
            </Link>
          </li>
          <li className="mt-3">
            <Link
              to="tutorialdash"
              className={`
                w-full py-2 px-1 flex items-center
                ${isCollapsed ? "justify-center" : "justify-start"}
                ${isActiveRoute("/dashboard/tutorialdash")
                  ? "bg-bg-btn-dash hover:bg-bg-btn-dash-hover"
                  : "hover:bg-bg-btn-dash"
                } rounded-lg
              `}
              onClick={handleLinkClick}
              title={isCollapsed ? "Tutoriales" : ""}
            >
              <Video
                size={30}
                color="#6666ff"
                className={isCollapsed ? "" : "mr-2"}
              />
              <span 
                className={`
                  whitespace-nowrap overflow-hidden transition-all duration-300
                  ${isCollapsed 
                    ? "w-0 opacity-0" 
                    : "w-full opacity-100 text-2xl sm:text-lg 2xl:text-xl"
                  }
                `}
              >
                Tutoriales
              </span>
            </Link>
          </li>
          <li className="mt-3">
            <Link
              to="/documentos/documento/empezar"
              target="_blank"
              className={`
                w-full py-2 px-1 flex items-center
                ${isCollapsed ? "justify-center" : "justify-start"}
                ${isActiveRoute("/documentos/documento/titulo1")
                  ? "bg-bg-btn-dash hover:bg-bg-btn-dash-hover"
                  : "hover:bg-bg-btn-dash"
                } rounded-lg
              `}
              onClick={handleLinkClick}
              title={isCollapsed ? "Documentación" : ""}
            >
              <BookOpen
                size={30}
                color="#6666ff"
                className={isCollapsed ? "" : "mr-2"}
              />
              <span 
                className={`
                  whitespace-nowrap overflow-hidden transition-all duration-300 flex items-center
                  ${isCollapsed 
                    ? "w-0 opacity-0" 
                    : "w-full opacity-100 text-2xl sm:text-lg"
                  }
                `}
              >
                Documentación
                <ArrowLineUpRight size={25} color="#6A6B77" className="ml-2" />
              </span>
            </Link>
          </li>
        </ul>

        {/* AI Tools */}
        <div className={`mt-4 sm:mt-2 ${isCollapsed ? "px-2" : "ml-6"} flex-grow`}>
          <p 
            className={`
              whitespace-nowrap overflow-hidden transition-all duration-300
              ${isCollapsed 
                ? "w-0 opacity-0" 
                : "w-full opacity-100 text-xl sm:text-xl 2xl:text-lg"
              }
            `}
          >
            Herramientas de IA
          </p>
          <ul className={`mt-4 ${isCollapsed ? "" : "ml-1 pr-6"} flex-grow`}>
            <li className="my-4 sm:my-1">
              <Link
                to="texto3D"
                className={`
                  w-full py-2 px-1 flex items-center
                  ${isCollapsed ? "justify-center" : "justify-start"}
                  ${isActiveRoute("/dashboard/texto3D")
                    ? "bg-bg-btn-dash hover:bg-bg-btn-dash-hover"
                    : "hover:bg-bg-btn-dash"
                  } rounded-lg
                `}
                onClick={handleLinkClick}
                title={isCollapsed ? "Texto a 3D" : ""}
              >
                <Textbox
                  size={30}
                  color="#6666ff"
                  className={isCollapsed ? "" : "mr-2"}
                />
                <span 
                  className={`
                    whitespace-nowrap overflow-hidden transition-all duration-300
                    ${isCollapsed 
                      ? "w-0 opacity-0" 
                      : "w-full opacity-100 text-2xl sm:text-lg"
                    }
                  `}
                >
                  Texto a 3D
                </span>
              </Link>
            </li>

            <li className="my-4 sm:my-1">
              <Link
                to="imagen3D"
                className={`
                  w-full py-2 px-1 flex items-center
                  ${isCollapsed ? "justify-center" : "justify-start"}
                  ${isActiveRoute("/dashboard/imagen3D")
                    ? "bg-bg-btn-dash hover:bg-bg-btn-dash-hover"
                    : "hover:bg-bg-btn-dash"
                  } rounded-lg
                `}
                onClick={handleLinkClick}
                title={isCollapsed ? "Imagen a 3D" : ""}
              >
                <Image
                  size={30}
                  color="#6666ff"
                  className={isCollapsed ? "" : "mr-2"}
                />
                <span 
                  className={`
                    whitespace-nowrap overflow-hidden transition-all duration-300
                    ${isCollapsed 
                      ? "w-0 opacity-0" 
                      : "w-full opacity-100 text-2xl sm:text-lg"
                    }
                  `}
                >
                  Imagen a 3D
                </span>
              </Link>
            </li>

            <li className="my-4 sm:my-1">
              <Link
                to="textoaimagen"
                className={`
                  w-full py-2 px-1 flex items-center
                  ${isCollapsed ? "justify-center" : "justify-start"}
                  ${isActiveRoute("/dashboard/textoaimagen")
                    ? "bg-bg-btn-dash hover:bg-bg-btn-dash-hover"
                    : "hover:bg-bg-btn-dash"
                  } rounded-lg
                `}
                onClick={handleLinkClick}
                title={isCollapsed ? "Texto A Imagen A 3D" : ""}
              >
                <FileImage
                  size={30}
                  color="#6666ff"
                  className={isCollapsed ? "" : "mr-2"}
                />
                <span 
                  className={`
                    whitespace-nowrap overflow-hidden transition-all duration-300
                    ${isCollapsed 
                      ? "w-0 opacity-0" 
                      : "w-full opacity-100 text-2xl sm:text-lg"
                    }
                  `}
                >
                  Texto A Imagen A 3D
                </span>
              </Link>
            </li>

            <li className="my-4 sm:my-1">
              <Link
                to="unico3D"
                className={`
                  w-full py-2 px-1 flex items-center
                  ${isCollapsed ? "justify-center" : "justify-start"}
                  ${isActiveRoute("/dashboard/unico3D")
                    ? "bg-bg-btn-dash hover:bg-bg-btn-dash-hover"
                    : "hover:bg-bg-btn-dash"
                  } rounded-lg
                `}
                onClick={handleLinkClick}
                title={isCollapsed ? "Unico A 3D" : ""}
              >
                <Cube
                  size={30}
                  color="#6666ff"
                  className={isCollapsed ? "" : "mr-2"}
                />
                <span 
                  className={`
                    whitespace-nowrap overflow-hidden transition-all duration-300
                    ${isCollapsed 
                      ? "w-0 opacity-0" 
                      : "w-full opacity-100 text-2xl sm:text-lg"
                    }
                  `}
                >
                  Unico A 3D
                </span>
              </Link>
            </li>
            <li className="my-4 sm:my-1">
              <Link
                to="multiimagen3D"
                className={`
                  w-full py-2 px-1 flex items-center
                  ${isCollapsed ? "justify-center" : "justify-start"}
                  ${isActiveRoute("/dashboard/multiimagen3D")
                    ? "bg-bg-btn-dash hover:bg-bg-btn-dash-hover"
                    : "hover:bg-bg-btn-dash"
                  } rounded-lg
                `}
                onClick={handleLinkClick}
                title={isCollapsed ? "Multi Imagen a 3D" : ""}
              >
                <Images
                  size={30}
                  color="#6666ff"
                  className={isCollapsed ? "" : "mr-2"}
                />
                <span 
                  className={`
                    whitespace-nowrap overflow-hidden transition-all duration-300
                    ${isCollapsed 
                      ? "w-0 opacity-0" 
                      : "w-full opacity-100 text-2xl sm:text-lg"
                    }
                  `}
                >
                  Multi Imagen a 3D
                </span>
              </Link>
            </li>

            <li className="my-4 sm:my-1">
              <Link
                to="boceto3D"
                className={`
                  w-full py-2 px-1 flex items-center
                  ${isCollapsed ? "justify-center" : "justify-start"}
                  ${isActiveRoute("/dashboard/boceto3D")
                    ? "bg-bg-btn-dash hover:bg-bg-btn-dash-hover"
                    : "hover:bg-bg-btn-dash"
                  } rounded-lg
                `}
                onClick={handleLinkClick}
                title={isCollapsed ? "Boceto a 3D" : ""}
              >
                <Scribble
                  size={30}
                  color="#6666ff"
                  className={isCollapsed ? "" : "mr-2"}
                />
                <span 
                  className={`
                    whitespace-nowrap overflow-hidden transition-all duration-300
                    ${isCollapsed 
                      ? "w-0 opacity-0" 
                      : "w-full opacity-100 text-2xl sm:text-lg"
                    }
                  `}
                >
                  Boceto a 3D
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default NavDash;