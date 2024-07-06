import React, { useState } from "react";
import History from "../Prediction/History";

export const Visualizador = () => {
  const [selectedTab, setSelectedTab] = useState("Texto3D");

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <section
      className="ml-60 w-full border-l-2 pr-8 border-linea bg-fondologin"
    >
      <div className="ml-10  fixed z-30 bg  w-full bg-fondologin ">
        <div className="mt-10">
          <h1 className="text-4xl">Mis Objetos</h1>
          <p className="mt-4 text-lg">
            Explore su repositorio de recursos de aprendizaje y obras de arte 3D
            generadas por IA.
          </p>
        </div>
        <hr className="mt-4" />

        <div className="mt-6 mb-3 ">
          <h2 className="text-2xl">Modelo 3D Creados</h2>

          <div className="w-2/5 mt-4">
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

      <div className="ml-10 mt-[280px] bg-fondologin ">
        <History selectedTab={selectedTab} />
      </div>
    </section>
  );
};
