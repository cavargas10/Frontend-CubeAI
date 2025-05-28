// src/features/documentacion/components/DocsSidebar.jsx
import React, { useEffect, useState } from "react";
import client from "../../../config/client";
import { GET_HYGRAPH } from "../../../lib/hygraph/queries";
import { Link, useLocation } from "react-router-dom";
import { List, X } from "@phosphor-icons/react";

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderLinks = (isMobile = false) => (
    <div className={`${isMobile ? 'mt-2 space-y-4 px-1' : 'space-y-4'}`}> {/* Aumentamos un poco space-y general */}
      {categorias.map((categoria) => (
        <div key={categoria.slug}>
          <h3
            className={`
              ${isMobile ? 'px-2' : 'px-0'}
              pt-2 pb-1.5 text-base font-bold uppercase tracking-wider 
              bg-clip-text text-transparent bg-gradient-to-r from-azul-gradient to-morado-gradient
              ${!isMobile ? 'border-b border-linea/25 mb-1.5' : ''} 
            `}
          >
            {categoria.titulo}
          </h3>
          <ul className="mt-1 space-y-0.5"> {/* Ajustamos el espaciado entre links */}
            {categoria.documentos.map((documento) => {
              const isActive = location.pathname === `/documentos/documento/${documento.slug}`;
              return (
                <li key={documento.slug}>
                  <Link
                    className={`
                      flex items-center py-2 px-3 rounded-md transition-all duration-150 ease-in-out
                      text-base group relative 
                      ${isMobile ? 'px-2' : 'px-0'}
                      ${isActive
                        ? "bg-gradient-to-r from-azul-gradient/30 to-morado-gradient/30 text-white font-semibold shadow-sm"
                        : "text-gray-300 hover:text-gray-100 hover:bg-linea/20"
                      }
                    `}
                    to={`/documentos/documento/${documento.slug}`}
                    onClick={isMobile ? toggleMenu : undefined}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-morado-gradient rounded-r-sm"></span>
                    )}
                    <span className={`${isActive ? 'ml-2.5' : 'ml-0'} transition-all duration-150`}>
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

  return (
    <div className="h-full">
      <div className="sm:hidden p-3 sticky top-16 bg-fondologin z-20 border-b border-linea/30">
        <button
          className={`
            flex items-center justify-between w-full p-2 rounded-md text-left
            text-gray-200 hover:bg-linea/20 transition-colors duration-200
            focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-offset-fondologin focus:ring-morado-gradient
            ${isMenuOpen ? "bg-linea/10" : ""}
          `}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-docs-nav"
        >
          <span className="text-sm font-semibold">Navegación</span> 
          {isMenuOpen ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {/* Menú móvil (condicional) */}
      {isMenuOpen && (
        <nav
          id="mobile-docs-nav"
          className="sm:hidden bg-fondologin p-3 border-b border-linea/30 shadow-lg"
        >
          {renderLinks(true)}
        </nav>
      )}

      {/* Sidebar para Desktop */}
      <nav className="
        hidden sm:block h-full overflow-y-auto 
        pb-10 
        pr-1 
        pl-4 sm:pl-6 lg:pl-8
        custom-scrollbar
      ">
        {renderLinks(false)}
      </nav>
    </div>
  );
};