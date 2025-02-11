import React from "react";
import { List } from "@phosphor-icons/react";

const UserProfile = ({ userData, toggleMenu }) => {
  // Manejador para errores de imagen
  const handleImageError = (event) => {
    event.target.src = "/usuario.webp"; // Imagen por defecto
    event.target.alt = "Imagen no disponible";
    event.target.onerror = null; // Prevenir bucle infinito en caso de que la imagen por defecto también falle
  };

  return (
    userData && (
      <div className="flex items-center justify-center gap-2 sm:mr-0 px-6">
        {/* Contenedor principal */}
        <div className="flex items-center gap-2">
          {/* Nombre de usuario */}
          <p className="sm:block hidden text-white mt-5">
            Bienvenido, {userData.name}
          </p>
          
          {/* Imagen de perfil */}
          {userData.profile_picture ? (
            <img
              src={userData.profile_picture}
              alt={`Foto de perfil de ${userData.name}`}
              className="w-[36px] h-[36px] rounded-full object-cover ml-2 mt-4"
              onError={handleImageError} // Manejo de errores de imagen
            />
          ) : (
            // Imagen por defecto si no hay profile_picture
            <div className="w-[36px] h-[36px] rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-bold">
              {userData.name?.charAt(0).toUpperCase()}
            </div>
          )}
          
          {/* Botón de menú */}
          <button
            name="menu dashboard"
            aria-label="Open menu dashboard"
            onClick={toggleMenu}
            className="block md:hidden focus:outline-none"
          >
            <List size={32} color="#ffffff" />
          </button>
        </div>
      </div>
    )
  );
};

export default UserProfile;