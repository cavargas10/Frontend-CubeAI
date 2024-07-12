import React, { useState } from "react";

import History from "../Prediction/History";

export const Visualizador = ({ BASE_URL }) => {
  const [selectedTab, setSelectedTab] = useState("Texto3D");
  const [menuOpen, setMenuOpen] = useState(false);
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <section className=" 2xl:ml-72 sm:ml-52 w-full sm:border-l-2 px-4 sm:pr-8 border-linea bg-fondologin 2xl:text-xl text-lg">
      <div className="sm:px-4 sm:ml-10 fixed z-30 bg  w-full bg-fondologin ">
        <div className="mt-10 sm:w-3/5">
          <h1 className="text-4xl">Mis Objetos</h1>
          <p className="mt-4 text-lg">
            Explore su repositorio de recursos de aprendizaje y obras de arte 3D
            generadas por IA.
          </p>
        </div>

        <hr className="mt-4" />

        <div className="mt-6 mb-3 ">
          <h2 className="text-2xl">Modelo 3D Creados</h2>

          <div className="sm:w-4/6 xl:w-2/5  mt-4">
            <ul className="flex justify-between">
              <li
                className={`p-3 cursor-pointer hover:bg-bg-btn-dash rounded-lg   ${selectedTab === "Texto3D" ? "bg-bg-btn-dash rounded-lg" : ""}`}
                onClick={() => handleTabClick("Texto3D")}
              >
                <a href="#">Texto a 3D</a>
              </li>

              <li
                className={`p-3  cursor-pointer hover:bg-bg-btn-dash rounded-lg  ${selectedTab === "Imagen3D" ? "bg-bg-btn-dash rounded-lg" : ""}`}
                onClick={() => handleTabClick("Imagen3D")}
              >
                <a href="#">Imagen a 3D</a>
              </li>

              <li
                className={`p-3 cursor-pointer hover:bg-bg-btn-dash rounded-lg  ${selectedTab === "TextImg3D" ? "bg-bg-btn-dash rounded-lg" : ""}`}
                onClick={() => handleTabClick("TextImg3D")}
              >
                <a href="#">Texto a Imagen a 3D</a>
              </li>

              <li
                className={`p-3 cursor-pointer hover:bg-bg-btn-dash rounded-lg  ${selectedTab === "Unico3D" ? "bg-bg-btn-dash rounded-lg" : ""}`}
                onClick={() => handleTabClick("Unico3D")}
              >
                <a href="#">Unico 3D</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className=" sm:px-0 mt-20 sm:ml-10 sm:mt-[320px] xl:mt-[280px] bg-fondologin ">
        <History selectedTab={selectedTab} BASE_URL={BASE_URL} />
      </div>
    </section>
  );
};