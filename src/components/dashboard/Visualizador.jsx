import React, { useState } from "react";
import { History } from "../prediction/History";

export const Visualizador = ({ BASE_URL, isCollapsed }) => {
  const [selectedTab, setSelectedTab] = useState("Texto3D");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <section
      className={`2xl:ml-72 sm:ml-56 w-full bg-fondologin 2xl:text-xl text-lg 
    transition-all duration-300 ease-in-out ${
      isCollapsed
        ? "sm:ml-[80px] xl:ml-[50px] 2xl:ml-[80px]"
        : "sm:ml-[254px] md:ml-[260px] xl:ml-[260px] 2xl:ml-[300px]"
    }`}
    >
      <div className="px-4 sm:ml-10 fixed z-40 w-full bg-fondologin">
        <div className="mt-10 sm:w-3/5">
          <h1 className="text-4xl">Mis Objetos</h1>
          <p className="mt-4 text-lg">
            Explore su repositorio de recursos de aprendizaje y obras de arte 3D
            generadas por IA.
          </p>
        </div>

        <hr className="mt-4" />

        <div className="mt-6 mb-3">
          <h2 className="text-2xl">Modelo 3D Creados</h2>

          <div className="w-full mt-4 overflow-x-auto">
            <div className="min-w-max pb-2">
              <ul className="flex space-x-4">
                <li
                  className={`p-3 whitespace-nowrap cursor-pointer hover:bg-bg-btn-dash rounded-lg min-w-fit ${
                    selectedTab === "Texto3D" ? "bg-bg-btn-dash rounded-lg" : ""
                  }`}
                  onClick={() => handleTabClick("Texto3D")}
                >
                  <a href="#" className="px-2">
                    Texto a 3D
                  </a>
                </li>

                <li
                  className={`p-3 whitespace-nowrap cursor-pointer hover:bg-bg-btn-dash rounded-lg min-w-fit ${
                    selectedTab === "Imagen3D"
                      ? "bg-bg-btn-dash rounded-lg"
                      : ""
                  }`}
                  onClick={() => handleTabClick("Imagen3D")}
                >
                  <a href="#" className="px-2">
                    Imagen a 3D
                  </a>
                </li>

                <li
                  className={`p-3 whitespace-nowrap cursor-pointer hover:bg-bg-btn-dash rounded-lg min-w-fit ${
                    selectedTab === "TextImg3D"
                      ? "bg-bg-btn-dash rounded-lg"
                      : ""
                  }`}
                  onClick={() => handleTabClick("TextImg3D")}
                >
                  <a href="#" className="px-2">
                    Texto a Imagen a 3D
                  </a>
                </li>

                <li
                  className={`p-3 whitespace-nowrap cursor-pointer hover:bg-bg-btn-dash rounded-lg min-w-fit ${
                    selectedTab === "Unico3D" ? "bg-bg-btn-dash rounded-lg" : ""
                  }`}
                  onClick={() => handleTabClick("Unico3D")}
                >
                  <a href="#" className="px-2">
                    Unico 3D
                  </a>
                </li>

                <li
                  className={`p-3 whitespace-nowrap cursor-pointer hover:bg-bg-btn-dash rounded-lg min-w-fit ${
                    selectedTab === "MultiImagen3D"
                      ? "bg-bg-btn-dash rounded-lg"
                      : ""
                  }`}
                  onClick={() => handleTabClick("MultiImagen3D")}
                >
                  <a href="#" className="px-2">
                    Multi Imagen a 3D
                  </a>
                </li>

                <li
                  className={`p-3 whitespace-nowrap cursor-pointer hover:bg-bg-btn-dash rounded-lg min-w-fit ${
                    selectedTab === "Boceto3D"
                      ? "bg-bg-btn-dash rounded-lg"
                      : ""
                  }`}
                  onClick={() => handleTabClick("Boceto3D")}
                >
                  <a href="#" className="px-2">
                    Boceto a 3D
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-0 mt-[390px] telefono:mt-[345px] sm:ml-14 md:mt-[335px] lg:mt-[310px] sm:mt-[340px] xl:mt-[280px] bg-fondologin">
        <History selectedTab={selectedTab} BASE_URL={BASE_URL} />
      </div>
    </section>
  );
};