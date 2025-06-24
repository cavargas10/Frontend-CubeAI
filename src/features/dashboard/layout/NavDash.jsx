import {
  Compass,
  Video,
  BookOpen,
  ArrowLineUpRight,
  CaretLeft,
  CaretRight,
  Gear,
  SignOut,
} from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GENERATION_TYPES } from "../../../features/prediction/config/generationTypes";

export const NavDash = ({
  menuOpen,
  toggleMenu,
  isCollapsed,
  setIsCollapsed,
  handleLogout,
}) => {
  const { t } = useTranslation();
  const location = useLocation();

  const isActiveRoute = (route) => {
    if (route === "/documentos") {
      return location.pathname.startsWith("/documentos");
    }
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

  const titleSectionVisibleHeight = "max-h-10";

  return (
    <section
      className={`
        fixed z-40 transition-all duration-300 ease-in-out sm:pt-0
        sm:border-r-2 h-screen
        bg-white dark:bg-principal
        sm:border-gray-200 dark:sm:border-linea  /* ✅ LÍNEA CORREGIDA AQUÍ */
        ${menuOpen ? "block w-full" : "hidden"} sm:block
        ${isCollapsed ? "w-[80px]" : "w-full 2xl:w-[300px] md:w-[267px]"}
      `}
    >
      <button
        onClick={toggleCollapse}
        className="absolute right-[-12px] top-[50%] translate-y-[-50%] z-50 bg-white dark:bg-principal p-2 rounded-full border border-gray-200 dark:border-linea/20 cursor-pointer hidden sm:block hover:bg-gray-100 dark:hover:bg-linea/15 transition-all duration-200"
      >
        {isCollapsed ? (
          <CaretRight size={16} className="text-gray-600 dark:text-white" />
        ) : (
          <CaretLeft size={16} className="text-gray-600 dark:text-white" />
        )}
      </button>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pb-4">
          <div
            className={`${isCollapsed ? "px-3" : "px-4 sm:px-5 lg:px-6"} pt-3 sm:pt-4`}
          >
            <ul className="space-y-1.5 sm:space-y-1">
              <li>
                <Link
                  to="visualizador"
                  className={`flex items-center transition-all duration-200 ease-in-out group relative rounded-lg ${isCollapsed ? "justify-center py-3 px-2" : "py-3.5 sm:py-3 px-4 sm:px-3"} ${isActiveRoute("/dashboard/visualizador") ? "bg-gradient-to-r from-[#3333EA]/30 to-[#A975FF]/30 text-gray-900 dark:text-white font-semibold shadow-sm border-l-4 border-[#A975FF]" : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-bg-btn-dash hover:translate-x-0.5"}`}
                  onClick={handleLinkClick}
                  title={
                    isCollapsed ? t("dashboard_layout.nav.my_objects") : ""
                  }
                >
                  {isActiveRoute("/dashboard/visualizador") && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3333EA] to-[#A975FF] rounded-r-sm"></span>
                  )}
                  <Compass
                    size={isCollapsed ? 26 : 24}
                    color="#6666ff"
                    className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? "" : "mr-4 sm:mr-3"}`}
                  />
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? "w-0 opacity-0 max-w-0" : "w-full opacity-100 max-w-full text-base sm:text-base font-medium"}`}
                  >
                    {t("dashboard_layout.nav.my_objects")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="tutorialdash"
                  className={`flex items-center transition-all duration-200 ease-in-out group relative rounded-lg ${isCollapsed ? "justify-center py-3 px-2" : "py-3.5 sm:py-3 px-4 sm:px-3"} ${isActiveRoute("/dashboard/tutorialdash") ? "bg-gradient-to-r from-[#3333EA]/30 to-[#A975FF]/30 text-gray-900 dark:text-white font-semibold shadow-sm border-l-4 border-[#A975FF]" : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-bg-btn-dash hover:translate-x-0.5"}`}
                  onClick={handleLinkClick}
                  title={isCollapsed ? t("dashboard_layout.nav.tutorials") : ""}
                >
                  {isActiveRoute("/dashboard/tutorialdash") && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3333EA] to-[#A975FF] rounded-r-sm"></span>
                  )}
                  <Video
                    size={isCollapsed ? 26 : 24}
                    color="#6666ff"
                    className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? "" : "mr-4 sm:mr-3"}`}
                  />
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? "w-0 opacity-0 max-w-0" : "w-full opacity-100 max-w-full text-base sm:text-base font-medium"}`}
                  >
                    {t("dashboard_layout.nav.tutorials")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/documentos"
                  target="_blank"
                  className={`flex items-center transition-all duration-200 ease-in-out group relative rounded-lg ${isCollapsed ? "justify-center py-3 px-2" : "py-3.5 sm:py-3 px-4 sm:px-3"} ${isActiveRoute("/documentos") ? "bg-gradient-to-r from-[#3333EA]/30 to-[#A975FF]/30 text-gray-900 dark:text-white font-semibold shadow-sm border-l-4 border-[#A975FF]" : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-bg-btn-dash hover:translate-x-0.5"}`}
                  onClick={handleLinkClick}
                  title={
                    isCollapsed ? t("dashboard_layout.nav.documentation") : ""
                  }
                >
                  {isActiveRoute("/documentos") && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3333EA] to-[#A975FF] rounded-r-sm"></span>
                  )}
                  <BookOpen
                    size={isCollapsed ? 26 : 24}
                    color="#6666ff"
                    className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? "" : "mr-4 sm:mr-3"}`}
                  />
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out flex items-center ${isCollapsed ? "w-0 opacity-0 max-w-0" : "w-full opacity-100 max-w-full text-base sm:text-base font-medium"}`}
                  >
                    {t("dashboard_layout.nav.documentation")}
                    <ArrowLineUpRight
                      size={18}
                      color="#6A6B77"
                      className="ml-2 flex-shrink-0"
                    />
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <div
            className={`${isCollapsed ? "px-3" : "px-4 sm:px-4 lg:px-5"} pt-4 sm:pt-6`}
          >
            <div className="border-t border-gray-200 dark:border-linea/25 pt-4 sm:pt-5">
              <h3
                className={`text-sm font-bold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-azul-gradient to-morado-gradient transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? "opacity-0 max-h-0 py-0 my-0" : `opacity-100 ${titleSectionVisibleHeight} pb-3 sm:pb-4 mb-1 sm:mb-1`}`}
              >
                {t("dashboard_layout.nav.ai_tools")}
              </h3>
              <ul
                className={`space-y-1 sm:space-y-1 transition-all duration-300 ease-in-out ${isCollapsed ? "mt-0" : "mt-2 sm:mt-2"}`}
              >
                {GENERATION_TYPES.map((type) => {
                  const IconComponent = type.icon;
                  const route = `/dashboard/${type.path}`;
                  const isActive = isActiveRoute(route);

                  return (
                    <li key={type.id}>
                      <Link
                        to={type.path}
                        className={`flex items-center transition-all duration-200 ease-in-out group relative rounded-lg ${isCollapsed ? "justify-center py-2.5 px-2" : "py-2.5 sm:py-2.5 px-4 sm:px-2"} ${isActive ? "bg-gradient-to-r from-[#3333EA]/30 to-[#A975FF]/30 text-gray-900 dark:text-white font-semibold shadow-sm border-l-4 border-[#A975FF]" : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-bg-btn-dash hover:translate-x-0.5"}`}
                        onClick={handleLinkClick}
                        title={isCollapsed ? t(type.labelKey) : ""}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3333EA] to-[#A975FF] rounded-r-sm"></span>
                        )}
                        <IconComponent
                          size={isCollapsed ? 22 : 20}
                          color="#6666ff"
                          className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? "" : "mr-3 sm:mr-2"}`}
                        />
                        <span
                          className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? "w-0 opacity-0 max-w-0" : "w-full opacity-100 max-w-full text-base sm:text-base font-medium"}`}
                        >
                          {t(type.labelKey)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="mt-6 block sm:hidden">
            <div className={`${isCollapsed ? "px-3" : "px-4"} pb-4`}>
              <div className="border-t border-gray-200 dark:border-linea/25 pt-4">
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="configdash"
                      className={`flex items-center transition-all duration-200 ease-in-out group relative rounded-lg py-3 px-4 ${isActiveRoute("/dashboard/configdash") ? "bg-gradient-to-r from-[#3333EA]/30 to-[#A975FF]/30 text-gray-900 dark:text-white font-semibold shadow-sm border-l-4 border-[#A975FF]" : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-bg-btn-dash hover:translate-x-0.5"}`}
                      onClick={handleLinkClick}
                    >
                      {isActiveRoute("/dashboard/configdash") && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3333EA] to-[#A975FF] rounded-r-sm"></span>
                      )}
                      <Gear
                        size={22}
                        color="#6666ff"
                        className="flex-shrink-0 mr-4"
                      />
                      <span className="text-base font-medium">
                        {t("dashboard_layout.header.settings")}
                      </span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLinkClick();
                        handleLogout();
                      }}
                      className="w-full flex items-center transition-all duration-200 ease-in-out group relative rounded-lg py-3 px-4 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-300"
                    >
                      <SignOut
                        size={22}
                        className="flex-shrink-0 transform scale-x-[-1] mr-4"
                      />
                      <span className="text-base font-medium text-left">
                        {t("dashboard_layout.header.logout")}
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
