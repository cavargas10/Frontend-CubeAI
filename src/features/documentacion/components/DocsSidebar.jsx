import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CaretLineRight, CaretLineLeft } from "@phosphor-icons/react";
import { useDocumentation } from "../context/DocumentationContext";
import { useTranslation } from "react-i18next";

export const DocsSidebar = () => {
  const { categorias, loading: contextLoading, error: contextError } = useDocumentation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

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

  if (contextLoading) {
    return <div className="p-4 text-white animate-pulse">{t('docs.sidebar.loading')}</div>;
  }

  if (contextError) {
    return <div className="p-4 text-red-400">{t('docs.sidebar.error')}</div>;
  }

  const renderLinks = (isMobile = false) => (
    <div className={`${isMobile ? 'space-y-3 p-4' : 'space-y-3'}`}>
      {(!categorias || categorias.length === 0) && !contextLoading && (
        <p className="text-gray-400 px-3 py-2">{t('docs.sidebar.no_categories')}</p>
      )}
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
                      flex items-center transition-all duration-200 ease-in-out group relative rounded-md
                      ${isMobile 
                        ? 'py-2.5 px-3 text-base' 
                        : 'py-2 px-3 text-sm'
                      }
                      ${isActive
                        ? "bg-gradient-to-r from-[#3333EA]/30 to-[#A975FF]/30 text-white font-semibold shadow-sm border-l-4 border-[#A975FF]"
                        : "text-white hover:bg-linea/15 hover:translate-x-0.5"
                      }
                    `}
                    to={`/documentos/documento/${documento.slug}`}
                    onClick={isMobile ? handleLinkClickMobile : undefined}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3333EA] to-[#A975FF] rounded-r-sm"></span>
                    )}
                    <span className={`
                      transition-all duration-200
                      ${isActive ? 'ml-2' : 'ml-0'}
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
          aria-label={isMenuOpen ? t('docs.mobile_menu.close_menu') : t('docs.mobile_menu.open_menu')}
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
          ${headerHeightClass} 
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ height: `calc(100vh - 4rem)` }} 
        aria-hidden={!isMenuOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-linea/20 sticky top-0 z-10 bg-fondologin">
          <h2 className="text-lg font-bold text-white">{t('docs.mobile_menu.title')}</h2>
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