import React from "react";
import { List } from "@phosphor-icons/react";

const UserProfile = ({ userData, toggleMenu }) => {
  return (
    userData && (
      <div className="flex justify-center items-center gap-2  sm:mr-0 ">
        <div className="flex gap-2">
          <p className="sm:block hidden">Bienvenido, {userData.name}</p>
          {userData.profile_picture && (
            <img
              src={userData.profile_picture}
              alt="Foto de perfil"
              className="w-[36px] rounded-2xl "
            />
          )}
          <button name="menu dashboard" aria-label="Open menu dashboard" onClick={toggleMenu} className="block md:hidden ">
            <List size={32} color="#ffffff" />
          </button>
        </div>
      </div>
    )
  );
};

export default UserProfile;
