import { List } from "@phosphor-icons/react";

export const UserProfile = ({ userData, toggleMenu }) => {
  const handleImageError = (event) => {
    event.target.src = "/usuario.webp"; 
    event.target.alt = "Imagen no disponible";
    event.target.onerror = null; 
  };

  return (
    userData && (
      <div className="flex items-center justify-center gap-2 sm:mr-0 px-6">
        <div className="flex items-center gap-2">
          <p className="sm:block hidden text-white mt-5 z-50">
            Bienvenido, {userData.name}
          </p>

          {userData.profile_picture ? (
            <img
              src={userData.profile_picture}
              alt={`Foto de perfil de ${userData.name}`}
              className="w-[36px] h-[36px] rounded-full object-cover ml-2 mt-4"
              onError={handleImageError} 
            />
          ) : (
            
            <div className="w-[36px] h-[36px] rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-bold">
              {userData.name?.charAt(0).toUpperCase()}
            </div>
          )}

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