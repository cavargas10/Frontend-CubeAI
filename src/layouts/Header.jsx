import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo.webp";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { List, X, CaretRight } from "@phosphor-icons/react";

export const Header = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const isAuthenticated = !!user;

  if (isAuthenticated) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-transparent font-inter font-bold transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-lg bg-opacity-80"
            : "backdrop-blur-sm bg-opacity-50"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <img src={logo} alt="Logo" className="w-[60px] rounded-full" />
            <span className="text-xl text-white hover:text-[#A975FF] transition-colors duration-300">
              INSTANT3D
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 justify-center flex-grow">
            <Link
              to="/"
              className={`text-base font-semibold transition-colors duration-300 ${
                location.pathname === "/"
                  ? "text-[#A975FF]"
                  : "text-white hover:text-[#A975FF]"
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/documentos"
              className={`text-base font-semibold transition-colors duration-300 ${
                location.pathname.includes("/documentos")
                  ? "text-[#A975FF]"
                  : "text-white hover:text-[#A975FF]"
              }`}
            >
              Documentación
            </Link>
            <Link
              to="/tutoriales"
              className={`text-base font-semibold transition-colors duration-300 ${
                location.pathname === "/tutoriales"
                  ? "text-[#A975FF]"
                  : "text-white hover:text-[#A975FF]"
              }`}
            >
              Tutoriales
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium py-2 px-4 rounded-md bg-gradient-to-r from-[#3333EA] to-[#A975FF] text-white shadow-sm hover:shadow-md transition-all"
            >
              Iniciar sesión
            </Link>

            <Button
              to="/register"
              className="text-sm font-medium py-2 px-4 rounded-md bg-white text-[#0A0B20] hover:bg-gray-200 shadow-md hover:shadow-lg transition-all"
            >
              Registrarse
            </Button>
          </div>

          <button
            name="menu"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            className={`
              block md:hidden
              w-11 h-11 rounded-lg shadow-lg
              bg-gradient-to-r from-[#3333EA] to-[#A975FF]
              text-white transition-all duration-300 ease-in-out
              hover:scale-105 hover:shadow-xl
              focus:outline-none focus:ring-3 focus:ring-[#A975FF]/30
              flex items-center justify-center
              ${isMenuOpen ? "rotate-90 shadow-2xl" : "rotate-0"}
            `}
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X size={22} weight="bold" />
            ) : (
              <List size={22} weight="bold" />
            )}
          </button>
        </div>
      </header>

      <div className="fixed top-16 left-0 w-full h-[1px] bg-gray-700 z-50"></div>

      {isMenuOpen && (
        <>
          <div
            className="md:hidden fixed bg-black/60 backdrop-blur-sm z-30 transition-all duration-300"
            onClick={toggleMenu}
            style={{
              top: "calc(4rem + 1px)",
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          {/* Panel deslizable - CORREGIDO z-index y posición */}
          <div
            className={`
            md:hidden fixed left-0 right-0 z-40
            bg-fondologin/95 backdrop-blur-lg
            shadow-2xl border-b border-gray-700/50
            transform transition-all duration-300 ease-out
            ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
          `}
            style={{
              top: "calc(4rem + 1px)",
              maxHeight: "calc(100vh - 4rem - 1px)",
              overflowY: "auto",
            }}
          >
            {/* Header del drawer */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/30 bg-fondologin/80">
              <h2 className="text-lg font-bold text-white">Menú</h2>
              <div className="w-8 h-1 bg-gradient-to-r from-[#3333EA] to-[#A975FF] rounded-full"></div>
            </div>

            {/* Contenido */}
            <div className="px-4 py-4">
              <div className="flex flex-col gap-2">
                {/* Enlaces principales */}
                <Link
                  to="/"
                  className={`
                    flex items-center justify-between transition-all duration-200 ease-in-out
                    text-lg font-semibold py-4 px-4 rounded-lg group relative
                    ${
                      location.pathname === "/"
                        ? "bg-gradient-to-r from-[#3333EA]/30 to-[#A975FF]/30 text-white shadow-sm border-l-4 border-[#A975FF]"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50 hover:translate-x-1"
                    }
                  `}
                  onClick={toggleMenu}
                >
                  {location.pathname === "/" && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3333EA] to-[#A975FF] rounded-r-sm"></span>
                  )}
                  <span
                    className={`transition-all duration-200 ${location.pathname === "/" ? "ml-2" : "ml-0"}`}
                  >
                    Inicio
                  </span>
                  <CaretRight
                    size={20}
                    weight="bold"
                    className={`
                      transition-all duration-200 
                      ${location.pathname === "/" ? "text-[#A975FF]" : "text-gray-400 group-hover:text-white group-hover:translate-x-1"}
                    `}
                  />
                </Link>

                <Link
                  to="/documentos"
                  className={`
                    flex items-center justify-between transition-all duration-200 ease-in-out
                    text-lg font-semibold py-4 px-4 rounded-lg group relative
                    ${
                      location.pathname.includes("/documentos")
                        ? "bg-gradient-to-r from-[#3333EA]/30 to-[#A975FF]/30 text-white shadow-sm border-l-4 border-[#A975FF]"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50 hover:translate-x-1"
                    }
                  `}
                  onClick={toggleMenu}
                >
                  {location.pathname.includes("/documentos") && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3333EA] to-[#A975FF] rounded-r-sm"></span>
                  )}
                  <span
                    className={`transition-all duration-200 ${location.pathname.includes("/documentos") ? "ml-2" : "ml-0"}`}
                  >
                    Documentación
                  </span>
                  <CaretRight
                    size={20}
                    weight="bold"
                    className={`
                      transition-all duration-200 
                      ${location.pathname.includes("/documentos") ? "text-[#A975FF]" : "text-gray-400 group-hover:text-white group-hover:translate-x-1"}
                    `}
                  />
                </Link>

                <Link
                  to="/tutoriales"
                  className={`
                    flex items-center justify-between transition-all duration-200 ease-in-out
                    text-lg font-semibold py-4 px-4 rounded-lg group relative
                    ${
                      location.pathname === "/tutoriales"
                        ? "bg-gradient-to-r from-[#3333EA]/30 to-[#A975FF]/30 text-white shadow-sm border-l-4 border-[#A975FF]"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50 hover:translate-x-1"
                    }
                  `}
                  onClick={toggleMenu}
                >
                  {location.pathname === "/tutoriales" && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3333EA] to-[#A975FF] rounded-r-sm"></span>
                  )}
                  <span
                    className={`transition-all duration-200 ${location.pathname === "/tutoriales" ? "ml-2" : "ml-0"}`}
                  >
                    Tutoriales
                  </span>
                  <CaretRight
                    size={20}
                    weight="bold"
                    className={`
                      transition-all duration-200 
                      ${location.pathname === "/tutoriales" ? "text-[#A975FF]" : "text-gray-400 group-hover:text-white group-hover:translate-x-1"}
                    `}
                  />
                </Link>
              </div>

              <div className="mx-0 my-4 h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="
                    text-base font-medium py-3 px-4 rounded-lg 
                    bg-gradient-to-r from-[#3333EA] to-[#A975FF] 
                    text-white shadow-lg hover:shadow-xl 
                    transition-all duration-300 ease-in-out
                    text-center transform hover:scale-105
                    border border-[#A975FF]/20
                  "
                  onClick={toggleMenu}
                >
                  Iniciar sesión
                </Link>

                <Button
                  to="/register"
                  className="
                    w-full text-base font-medium py-3 px-4 rounded-lg 
                    bg-white/95 text-[#0A0B20] 
                    hover:bg-white hover:shadow-xl 
                    shadow-lg transition-all duration-300 ease-in-out
                    text-center transform hover:scale-105
                    border border-white/20
                  "
                  onClick={toggleMenu}
                >
                  Registrarse
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};