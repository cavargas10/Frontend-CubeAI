import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Gear, SignOut } from "@phosphor-icons/react";
import logo from "../../../assets/logo.webp";
import { UserProfile } from "../../../features/auth/components/UserProfile";

export const HeaderDash = ({ userData, toggleMenu, handleLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
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
    <header className="fixed w-full top-0 left-0 z-50 bg-principal">
      <div className="flex justify-between border-b-2 border-linea">
        <div className="flex items-center ml-3">
          <img src={logo} alt="Logo" className="w-[70px]" />
          <div>
            <h1 className="items-center justify-center">INSTANT3D</h1>
          </div>
        </div>

        {userData && (
          <div className="relative" ref={dropdownRef}>
            <div onClick={toggleDropdown} className="cursor-pointer">
              <UserProfile userData={userData} toggleMenu={toggleMenu} />
            </div>

            {/* Dropdown Menu */}
            <div
              className={`
                mr-6 absolute right-0 mt-2 w-56 rounded-xl bg-principal border-2 border-linea shadow-lg
                transform transition-all duration-200 origin-top
                ${
                  isDropdownOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }
              `}
            >
              {/* Dropdown Header */}
              <div className="px-4 py-3 border-b border-linea">
                <p className="text-sm font-medium text-gray-400">
                  Conectado como
                </p>
                <p className="text-sm truncate">
                  {userData?.email || "Usuario"}
                </p>
              </div>

              {/* Dropdown Items */}
              <div className="py-1">
                <Link
                  to="configdash"
                  className="flex items-center px-4 py-3 text-sm hover:bg-bg-btn-dash transition-colors duration-200 group"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Gear
                    size={20}
                    color="#6666ff"
                    className="mr-3 transition-transform duration-200 group-hover:rotate-90"
                  />
                  <span>Configuración</span>
                </Link>

                <div className="border-t border-linea my-1"></div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 group"
                >
                  <SignOut
                    size={20}
                    className="mr-3 transform scale-x-[-1] transition-transform duration-200 group-hover:translate-x-1"
                  />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};