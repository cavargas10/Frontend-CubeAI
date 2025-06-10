// src/features/dashboard/components/Visualizador.jsx

import { useState } from "react";
import {
  Textbox, Image, FileImage, Cube, Images, Scribble, X
} from "@phosphor-icons/react";
import { PredictionHistory } from "../../../features/prediction/components/shared/PredictionHistory";
import { ModelResultViewer } from "../../../features/prediction/components/shared/ModelResultViewer";

export const Visualizador = ({ isCollapsed }) => {
  const [selectedTab, setSelectedTab] = useState("Texto3D");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedGenerationForViewer, setSelectedGenerationForViewer] = useState(null);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const open3DViewer = (generation) => {
    setSelectedGenerationForViewer(generation);
    setIsViewerOpen(true);
  };

  const close3DViewer = () => {
    setIsViewerOpen(false);
    setSelectedGenerationForViewer(null);
  };

  const tabsConfig = [
    { id: "Texto3D", label: "Texto a 3D", shortLabel: "Texto 3D", icon: Textbox },
    { id: "Imagen3D", label: "Imagen a 3D", shortLabel: "Imagen 3D", icon: Image },
    { id: "TextImg3D", label: "Texto a Imagen a 3D", shortLabel: "Texto→Img 3D", icon: FileImage },
    { id: "Unico3D", label: "Único 3D", shortLabel: "Único 3D", icon: Cube },
    { id: "MultiImagen3D", label: "Multi Imagen a 3D", shortLabel: "Multi 3D", icon: Images },
    { id: "Boceto3D", label: "Boceto a 3D", shortLabel: "Boceto 3D", icon: Scribble },
  ];

  return (
    <section
      className={`min-h-screen bg-fondologin text-white transition-all duration-300 ease-in-out relative w-full flex flex-col ${
        isCollapsed ? "sm:pl-[80px]" : "md:pl-[267px] 2xl:pl-[300px]"
      }`}
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-6 pb-8 flex flex-col flex-grow">
        {isViewerOpen && selectedGenerationForViewer ? (
          // --- VISTA DEL VISOR 3D CON ESTILO MEJORADO ---
          <div className="flex-grow flex flex-col bg-gradient-to-br from-principal via-[#0F102F] to-principal border-2 border-linea/20 rounded-3xl shadow-2xl shadow-morado-gradient/10 overflow-hidden">
            
            {/* Encabezado del Visor */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-black/20 border-b border-linea/30 flex-shrink-0">
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text truncate pr-4">
                {selectedGenerationForViewer.generation_name}
              </h3>
              <button
                onClick={close3DViewer}
                aria-label="Cerrar visor"
                className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-linea/30 rounded-full text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X size={20} weight="bold" />
              </button>
            </div>
            
            {/* Contenedor del Modelo 3D */}
            <div className="flex-grow p-2 sm:p-4 min-h-0">
              <div className="w-full h-full bg-black/20 rounded-2xl overflow-hidden">
                <ModelResultViewer
                  modelUrl={selectedGenerationForViewer.modelUrl}
                  downloadFilename={`${selectedGenerationForViewer.generation_name}.glb`}
                />
              </div>
            </div>
          </div>
        ) : (
          // --- VISTA NORMAL (título, tabs, historial) ---
          <>
            <div className="mb-8 flex-shrink-0">
              <div className="flex items-center gap-4 mb-3">
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-azul-gradient to-morado-gradient pb-2">
                    Mis Objetos
                  </h1>
                  <div className="h-1 w-32 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full mt-2"></div>
                </div>
              </div>
              <p className="text-lg leading-relaxed text-justify">
                Bienvenido a tu espacio de creación 3D. Aquí puedes gestionar y visualizar tus modelos 3D generados por IA.
                Explora las diferentes categorías y accede a tus objetos de manera rápida y sencilla.
              </p>
            </div>
            <hr className="border-t-2 border-linea/20 my-5 flex-shrink-0" />
            <div className="mb-6 flex-shrink-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-azul-gradient to-morado-gradient rounded-full"></div>
                <h2 className="text-2xl font-bold text-white">Modelos 3D Creados</h2>
              </div>
              <div className="w-full">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-azul-gradient/20 scrollbar-track-transparent">
                  <div className="flex gap-2 p-2 bg-principal/50 rounded-2xl border border-linea/20 backdrop-blur-sm w-full">
                    {tabsConfig.map((tab) => {
                      const IconComponent = tab.icon;
                      const isActive = selectedTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          className={`relative flex items-center gap-1.5 px-2 lg:px-3 py-3 rounded-xl font-medium text-xs lg:text-sm transition-all duration-300 ease-in-out transform ${
                            isActive ? "bg-gradient-to-r from-azul-gradient to-morado-gradient text-white shadow-xl border border-white/20" : "bg-bg-btn-dash/30 text-gray-300 hover:bg-bg-btn-dash hover:text-white hover:scale-105 hover:shadow-lg border border-transparent hover:border-linea/30"
                          } group whitespace-nowrap flex-1 min-w-0 justify-center`}
                          onClick={() => handleTabClick(tab.id)}
                        >
                          <IconComponent size={16} className={`transition-all duration-300 flex-shrink-0 ${isActive ? "text-white drop-shadow-sm" : "text-azul-gradient group-hover:text-white"}`} />
                          <span className={`font-semibold tracking-wide truncate text-center ${isCollapsed ? 'hidden sm:inline' : 'hidden lg:inline'}`}>
                            {isCollapsed ? tab.label : tab.shortLabel}
                          </span>
                          {!isActive && (
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-azul-gradient/0 via-azul-gradient/5 to-morado-gradient/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex-grow">
              <div className="relative bg-principal/30 backdrop-blur-sm border border-linea/20 rounded-2xl p-6 h-full">
                <PredictionHistory selectedTab={selectedTab} open3DViewer={open3DViewer} />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};