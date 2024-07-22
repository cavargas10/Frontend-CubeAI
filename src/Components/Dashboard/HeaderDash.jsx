import React from "react";
import logo from "../../Assets/logo.webp";

import UserProfile from "../Auth/UserProfile";

export const HeaderDash = ({ userData, toggleMenu }) => {
  return (
    <header className="fixed w-full top-0 left-0 z-50 overflow-hidden bg-principal">
      <div className="flex justify-between border-b-2 border-linea   ">
        <div className="flex items-center ml-3">
          <img src={logo} alt="" className="w-[70px]" />
          <div className="">
            <h1 className="items-center justify-center">Cu3d.IA</h1>
          </div>
        </div>

        {userData && <UserProfile userData={userData} toggleMenu={toggleMenu} />}

      
      </div>
    </header>
  );
};
