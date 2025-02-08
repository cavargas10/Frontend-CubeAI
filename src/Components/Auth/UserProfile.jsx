import React from "react";
import { List } from "@phosphor-icons/react";

const UserProfile = ({ userData, toggleMenu }) => {
  return (
    userData && (
      <div className="flex justify-center gap-2 sm:mr-0 px-6">
        <div className="flex gap-2">
          <p className="sm:block hidden mt-5">Bienvenido, {userData.name}</p>
          {userData.profile_picture && (
            <img
              src={userData.profile_picture}
              alt="Foto de perfil"
              className="w-[36px] rounded-full mt-3"
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
