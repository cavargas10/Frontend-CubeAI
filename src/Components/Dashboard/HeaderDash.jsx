import React, { useState } from "react";
import logo from "../../Assets/logo.png";
import { List } from "@phosphor-icons/react";
import UserProfile from "../Auth/UserProfile";

export const HeaderDash = ({ userData, toggleMenu}) => {

  return (
    <header className="fixed w-full top-0 left-0 z-50 overflow-hidden bg-principal">
      <div className="flex justify-between border-b-2 border-linea  telefono:justify-between">
        <div className="flex items-center ml-3">
          <img src={logo} alt="" className="w-[70px]" />
          <div className="">
            <h1 className="items-center justify-center">Cu3d.IA</h1>
          </div>
        </div>

        {userData && <UserProfile userData={userData} />}

        <button onClick={toggleMenu} className="block md:hidden ">
          <List size={32} color="#ffffff" />
        </button>
      </div>
    </header>
  );
};