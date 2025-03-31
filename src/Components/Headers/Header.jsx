import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../Assets/logo.webp";
import { Button } from "../Ui/Button.jsx";
import { Link } from "react-router-dom";
import { List, CaretRight } from "@phosphor-icons/react";

export const Header = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuButtonActive, setIsMenuButtonActive] = useState(false);
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

  const isAuthenticated = !!user;

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-transparent font-inter font-bold transition-all duration-300 ${
          isScrolled ? "backdrop-blur-lg bg-opacity-80" : "backdrop-blur-sm bg-opacity-50"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Logo y Nombre clicables */}
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src={logo} alt="Logo" className="w-[60px] rounded-full" />
            <span className="text-xl text-white hover:text-[#A975FF] transition-colors duration-300">
              INSTANT3D
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 justify-center flex-grow">
            <Link
              to="/"
              className={`text-base font-semibold transition-colors duration-300 ${
                location.pathname === "/" ? "text-[#A975FF]" : "text-white hover:text-[#A975FF]"
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/documentos"
              className={`text-base font-semibold transition-colors duration-300 ${
                location.pathname.includes("/documentos") ? "text-[#A975FF]" : "text-white hover:text-[#A975FF]"
              }`}
            >
              Documentación
            </Link>
            <Link
              to="/tutoriales"
              className={`text-base font-semibold transition-colors duration-300 ${
                location.pathname === "/tutoriales" ? "text-[#A975FF]" : "text-white hover:text-[#A975FF]"
              }`}
            >
              Tutoriales
            </Link>
          </nav>

          {/* Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Botón "Iniciar sesión" */}
            <Link
              to="/login"
              className="text-sm font-medium py-2 px-4 rounded-md bg-gradient-to-r from-[#3333EA] to-[#A975FF] text-white shadow-sm hover:shadow-md transition-all"
            >
              Iniciar sesión
            </Link>

            {/* Botón "Registrarse" */}
            <Button
              to="/register"
              className="text-sm font-medium py-2 px-4 rounded-md bg-white text-[#0A0B20] hover:bg-gray-200 shadow-md hover:shadow-lg transition-all"
            >
              Registrarse
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            name="menu"
            aria-label="Open menu"
            className={`block md:hidden text-white hover:text-primary ${
              isMenuButtonActive ? "outline outline-linea rounded-lg bg-gray-700" : ""
            }`}
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsMenuButtonActive(!isMenuButtonActive);
            }}
          >
            <List size={28} />
          </button>
        </div>
      </header>

      {/* Línea divisoria gris de 1px */}
      <div className="fixed top-16 left-0 w-full h-[1px] bg-gray-700 z-40"></div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed top-16 left-0 w-full z-40 bg-fondologin rounded-b-lg border-t border-linea p-4 shadow-lg"
        >
          <div className="flex flex-col gap-2">
            {/* Enlaces principales */}
            <Link
              to="/"
              className={`flex items-center justify-between text-lg font-semibold py-3 px-4 rounded-lg transition-colors duration-300 ${
                location.pathname === "/" ? "bg-[#A975FF] text-white" : "text-white hover:bg-gray-700"
              }`}
              onClick={() => {
                setIsMenuOpen(false);
                setIsMenuButtonActive(false);
              }}
            >
              <span>Inicio</span>
              <CaretRight size={20} weight="bold" className="text-gray-400" />
            </Link>
            <Link
              to="/documentos"
              className={`flex items-center justify-between text-lg font-semibold py-3 px-4 rounded-lg transition-colors duration-300 ${
                location.pathname.includes("/documentos") ? "bg-[#A975FF] text-white" : "text-white hover:bg-gray-700"
              }`}
              onClick={() => {
                setIsMenuOpen(false);
                setIsMenuButtonActive(false);
              }}
            >
              <span>Documentación</span>
              <CaretRight size={20} weight="bold" className="text-gray-400" />
            </Link>
            <Link
              to="/tutoriales"
              className={`flex items-center justify-between text-lg font-semibold py-3 px-4 rounded-lg transition-colors duration-300 ${
                location.pathname === "/tutoriales" ? "bg-[#A975FF] text-white" : "text-white hover:bg-gray-700"
              }`}
              onClick={() => {
                setIsMenuOpen(false);
                setIsMenuButtonActive(false);
              }}
            >
              <span>Tutoriales</span>
              <CaretRight size={20} weight="bold" className="text-gray-400" />
            </Link>
          </div>

          {/* Separador */}
          <div className="h-[1px] bg-gray-700 my-4"></div>

          {/* Botones de inicio de sesión y registro */}
          <div className="flex flex-col gap-4">
            {/* Botón "Iniciar sesión" en móvil */}
            <Link
              to="/login"
              className="text-base font-medium py-3 px-4 rounded-md bg-gradient-to-r from-[#3333EA] to-[#A975FF] text-white shadow-sm hover:shadow-md transition-all text-center"
              onClick={() => {
                setIsMenuOpen(false);
                setIsMenuButtonActive(false);
              }}
            >
              Iniciar sesión
            </Link>

            {/* Botón "Registrarse" en móvil */}
            <Button
              to="/register"
              className="w-full text-base font-medium py-3 px-4 rounded-md bg-white text-[#0A0B20] hover:bg-gray-200 shadow-md hover:shadow-lg transition-all text-center"
            >
              Registrarse
            </Button>
          </div>
        </div>
      )}
    </>
  );
};