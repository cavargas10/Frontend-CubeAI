import React from "react";

const UserProfile = ({ userData }) => {
  return (
    userData && (
      <div className="flex justify-center items-center gap-2">
        <p>Bienvenido, {userData.name}</p>
        {userData.profile_picture && (
          <img
            src={userData.profile_picture}
            alt="Foto de perfil"
            className="w-[36px] rounded-2xl mr-2"
          />
        )}
      </div>
    )
  );
};

export default UserProfile;
