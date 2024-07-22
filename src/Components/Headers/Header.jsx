import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../Assets/logo.webp";
import { Button } from "../Ui/Button.jsx";
import { Link } from "react-router-dom";
import { List } from "@phosphor-icons/react";

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
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-principal font-inter font-bold transition-colors duration-300 ${isScrolled ? "bg-opacity-90 backdrop-blur bg-[#292931]" : "bg-opacity-100"}`}
      >
        <div className="sm:justify-between flex xl:flex-row xl:w-[100%] xl:mx-auto xl:px-10 sm:px-10 telefono:justify-between telefono:px-6">
          <div className="flex items-center">
            <img src={logo} alt="" className="w-[70px] rounded-full" />
            <span className="">INSTANT3D</span>
          </div>

          <nav className="flex items-center gap-4 xl:flex-row xl:w-[100%] xl:text-xl xl:mt-0 xl:mx-auto xl:justify-end">
            <Link to="/" className="hidden md:block">
              Inicio
            </Link>
            <Link to="/documentos" className="hidden md:block">
              Documentación
            </Link>
            <Link to="/tutoriales" className="hidden md:block">
              Tutoriales
            </Link>

            <Button />

            <button
              name="menu"
              className={`block md:hidden ${isMenuButtonActive ? "outline outline-linea rounded-lg  bg-gray-700" : ""}`}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                setIsMenuButtonActive(!isMenuButtonActive);
              }}
            >
              <List size={32} color="#ffffff" />
            </button>
          </nav>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mx-4 p-2 flex flex-col items-center mt-2 bg-fondologin rounded-lg border border-linea mb-4">
            <Link
              to="/"
              className={`text-xl py-4 w-full text-center rounded-lg ${
                location.pathname === "/" ? "bg-azul-gradient" : ""
              }`}
              onClick={() => {
                setIsMenuOpen(false);
                setIsMenuButtonActive(false);
              }}
            >
              Inicio
            </Link>
            <Link
              to="/documentos"
              className={`text-xl w-full py-4 text-center rounded-lg ${
                location.pathname === "/documentos/documento/titulo1"
                  ? "bg-azul-gradient"
                  : ""
              }`}
              onClick={() => {
                setIsMenuOpen(false);
                setIsMenuButtonActive(false);
              }}
            >
              Documentación
            </Link>
            <Link
              to="/tutoriales"
              className={`text-xl py-4 w-full text-center rounded-lg ${
                location.pathname === "/tutoriales" ? "bg-azul-gradient" : ""
              }`}
              onClick={() => {
                setIsMenuOpen(false);
                setIsMenuButtonActive(false);
              }}
            >
              Tutoriales
            </Link>
          </div>
        )}
      </header>
    </>
  );
};