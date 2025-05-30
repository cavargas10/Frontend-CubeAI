import { useEffect, useState } from "react";
import client from "../../../config/client";
import { GET_HYGRAPH } from "../../../lib/hygraph/queries";
import { Link, useLocation } from "react-router-dom";
import { CaretLineRight, CaretLineLeft } from "@phosphor-icons/react"; 

export const DocsSidebar = () => {
  const [categorias, setCategorias] = useState([]);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.request(GET_HYGRAPH);
        setCategorias(data.categorias || []);
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
        setCategorias([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClickMobile = () => {
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  const renderLinks = (isMobile = false) => (
    <div className={`${isMobile ? 'space-y-3 p-4' : 'space-y-3'}`}>
      {categorias.map((categoria) => (
        <div key={categoria.slug}>
          <h3
            className={`
              ${isMobile ? 'px-0' : 'px-0'}
              pt-3 pb-1.5 text-sm font-bold uppercase tracking-wider
              bg-clip-text text-transparent bg-gradient-to-r from-azul-gradient to-morado-gradient
              ${!isMobile ? 'border-b border-linea/25 mb-1.5' : 'mb-2'}
            `}
          >
            {categoria.titulo}
          </h3>
          <ul className="space-y-0.5">
            {categoria.documentos.map((documento) => {
              const isActive = location.pathname === `/documentos/documento/${documento.slug}`;
              return (
                <li key={documento.slug}>
                  <Link
                    className={`
                      flex items-center transition-all duration-200 ease-in-out
                      group relative block rounded-md
                      ${isMobile 
                        ? 'py-2.5 px-2 text-base' 
                        : 'py-2 px-3 text-sm'
                      }
                      ${isActive
                        ? "bg-gradient-to-r from-azul-gradient/25 to-morado-gradient/25 text-white font-semibold"
                        : "text-gray-300 hover:text-white hover:bg-linea/15 hover:translate-x-0.5"
                      }
                    `}
                    to={`/documentos/documento/${documento.slug}`}
                    onClick={isMobile ? handleLinkClickMobile : undefined}
                  >
                    {isActive && !isMobile && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-3/5 w-[3px] bg-morado-gradient rounded-r-full"></span>
                    )}
                    {isActive && isMobile && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-[3px] bg-morado-gradient "></span>
                    )}
                    <span className={`
                      transition-all duration-200
                      ${isActive && !isMobile ? 'ml-2' : 'ml-0'}
                      ${isActive && isMobile ? 'ml-2' : 'ml-0'} 
                    `}>
                      {documento.titulo}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  const headerHeightClass = "top-16"; 
  const buttonTopClass = "top-20"; 

  return (
    <div className="h-full">
      <div className="sm:hidden">
        <button
          onClick={toggleMenu}
          className={`
            fixed ${buttonTopClass} right-4 z-[60] 
            w-12 h-12 rounded-full shadow-2xl
            bg-gradient-to-r from-azul-gradient to-morado-gradient
            text-white transition-all duration-300 ease-in-out
            hover:scale-110 hover:from-morado-gradient hover:to-azul-gradient active:scale-95
            focus:outline-none focus:ring-4 focus:ring-morado-gradient/40
            flex items-center justify-center
          `}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-docs-drawer"
        >
          <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden"> 
            <CaretLineRight 
              size={20} 
              className={`
                absolute transition-all duration-300 ease-in-out
                ${isMenuOpen 
                  ? 'opacity-0 rotate-90 scale-75 transform -translate-x-full' 
                  : 'opacity-100 rotate-0 scale-100 transform translate-x-0'
                }
              `} 
            />
            <CaretLineLeft 
              size={20} 
              className={`
                absolute transition-all duration-300 ease-in-out
                ${isMenuOpen 
                  ? 'opacity-100 rotate-0 scale-100 transform translate-x-0' 
                  : 'opacity-0 -rotate-90 scale-75 transform translate-x-full' 
                }
              `} 
            />
          </div>
        </button>
      </div>

      <div 
        className={`
          sm:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40
          transition-opacity duration-300 ease-out
          ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={toggleMenu}
        aria-hidden="true"
      />
      
      <aside
        id="mobile-docs-drawer"
        className={`
          sm:hidden fixed left-0 bottom-0 z-50
          w-72 max-w-[80vw] bg-fondologin 
          shadow-2xl border-r border-linea/20
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${headerHeightClass} /* Aplicamos la clase para el top */
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-linea/20 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-white">Documentación</h2>
          <button onClick={toggleMenu} className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-linea/20">
          </button>
        </div>
        
        <nav className="flex-grow overflow-y-auto custom-scrollbar">
          {renderLinks(true)}
        </nav>
      </aside>

      <nav className="
        hidden sm:block h-full overflow-y-auto 
        pb-10 pr-1 
        pl-4 sm:pl-6 lg:pl-8 
        pt-4 
        custom-scrollbar
      ">
        {renderLinks(false)}
      </nav>
    </div>
  );
};