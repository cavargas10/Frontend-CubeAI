import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Gear, SignOut, List, X } from "@phosphor-icons/react";
import logo from "../../../assets/logo.webp";
import { UserProfile } from "../../../features/auth/components/UserProfile";
import { useTranslation } from "react-i18next";

export const HeaderDash = ({ userData, toggleMenu, menuOpen, handleLogout }) => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed w-full top-0 left-0 z-50 bg-white dark:bg-principal backdrop-blur-lg">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 border-b-2 border-gray-200 dark:border-linea">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-[70px] rounded-full" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-white hover:text-[#A975FF] transition-colors duration-300">
            INSTANT3D
          </h1>
        </div>

        {userData && (
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <div onClick={toggleDropdown} className="group">
                <UserProfile userData={userData} />
              </div>
              <div
                className={`
                  absolute right-0 mt-2 w-56 rounded-xl border-2 shadow-lg
                  transform transition-all duration-300 ease-in-out origin-top
                  bg-white dark:bg-principal 
                  border-gray-200 dark:border-linea 
                  ${isDropdownOpen ? "opacity-100 scale-100 translate-y-0 z-50" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
                `}
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-linea">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("dashboard_layout.header.connected_as")}</p>
                  <p className="text-sm truncate text-gray-800 dark:text-white">{userData?.email || "Usuario"}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="configdash"
                    className="flex items-center px-4 py-3 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-bg-btn-dash transition-all duration-200 group/item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Gear size={20} color="#6666ff" className="mr-3 transition-transform duration-200 group-hover/item:rotate-90" />
                    <span>{t("dashboard_layout.header.settings")}</span>
                  </Link>
                  <div className="border-t border-gray-200 dark:border-linea my-1"></div>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-500 hover:text-white transition-colors duration-200 group/item"
                  >
                    <SignOut size={20} className="mr-3 transform scale-x-[-1] transition-transform duration-200 group-hover/item:translate-x-1" />
                    <span>{t("dashboard_layout.header.logout")}</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex sm:hidden items-center gap-3">  
              <button
                name="menu"
                aria-label={menuOpen ? t("dashboard_layout.header.close_menu") : t("dashboard_layout.header.open_menu")}
                className={`
                  w-11 h-11 rounded-lg shadow-lg
                  bg-gradient-to-br from-azul-gradient to-morado-gradient
                  text-white transition-all duration-300 ease-in-out
                  hover:scale-105
                  flex items-center justify-center relative overflow-hidden
                `}
                onClick={toggleMenu}
              >
                <List
                  size={24}
                  weight="bold"
                  className={`transition-all duration-300 ease-in-out ${menuOpen ? "opacity-0 transform rotate-45 scale-75" : "opacity-100 transform rotate-0 scale-100"}`}
                />
                <X
                  size={24}
                  weight="bold"
                  className={`absolute transition-all duration-300 ease-in-out ${menuOpen ? "opacity-100 transform rotate-0 scale-100" : "opacity-0 transform -rotate-45 scale-75"}`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};