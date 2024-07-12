import React from "react";
const UserProfile = ({ userData }) => {
  return (
    userData && (
      <div className="flex justify-center items-center gap-2  sm:mr-0 ">
        <div className=" md:flex md:gap-2">
          <p className="sm:block hidden">Bienvenido, {userData.name}</p>
          {userData.profile_picture && (
            <img
              src={userData.profile_picture}
              alt="Foto de perfil"
              className="w-[36px] rounded-2xl sm:mr-2 ml-40  sm:ml-0"
            />
          )}
        </div>
      </div>
    )
  );
};

export default UserProfile;