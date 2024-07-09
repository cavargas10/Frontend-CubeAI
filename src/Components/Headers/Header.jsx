import { useState, useEffect } from "react";
import logo from "../../Assets/logo.png";
import { Button } from "../Ui/Button.jsx";
import { Link } from "react-router-dom";

export const Header = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);

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
        className={ `fixed top-0 left-0  w-full z-50 bg-principal font-inter font-bold transition-colors duration-300 ${isScrolled ? "bg-opacity-90 backdrop-blur bg-[#292931]" : "bg-opacity-100"}`}
      >
        <div className="flex xl:flex-row xl:w-[100%] xl:mx-auto px-10">
          <div className="sm:flex-col sm:justify-center sm:items-center sm:flex xl:flex-row ">
            <img src={logo} alt="" className="w-[70px]  rounded-full " />
            <span className=" sm:ml-0 ">CubeIA</span>
          </div>

          <nav className="flex items-center  gap-4 xl:flex-row xl:w-[100%] xl:text-xl xl:mt-0 xl:mx-auto  xl:justify-end  ">
            <Link
              to="/"
              className="sm:border-b-2 sm:border-linea sm:p-1 xl:border-none "
            >
              Inicio
            </Link>
            <Link
              to="/documentos"
              className="sm:border-b-2 sm:border-linea sm:p-1 xl:border-none"
            >
              Documentación
            </Link>
            <Link
              to="/tutoriales"
              className="sm:border-b-2 sm:border-linea sm:p-1 xl:border-none"
            >
              Tutoriales
            </Link>
            <Button />
          </nav>
        </div>
      </header>
    </>
  );
};