import React, { useEffect, useState } from "react";
import { BookOpen, Play, Clock } from "@phosphor-icons/react";
import hygraphClient from "../../../config/client";
import { GET_HYGRAPH } from "../../../lib/hygraph/queries";
import { TutorialCard } from "../../../components/ui/TutorialCard";

export const TutorialDash = ({ isCollapsed }) => {
  const [tutoriales, setTutoriales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutoriales = async () => {
      try {
        setLoading(true);
        const data = await hygraphClient.request(GET_HYGRAPH);
        setTutoriales(data.tutoriales);
      } catch (error) {
        console.error("Error fetching tutorials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutoriales();
  }, []);

  return (
    <section
      className={`min-h-screen bg-fondologin text-white transition-all duration-300 ease-in-out relative w-full ${
        isCollapsed
          ? "sm:pl-[80px]"
          : "md:pl-[267px] 2xl:pl-[300px]"
      }`}
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-6 pb-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-azul-gradient to-morado-gradient pb-2">
                Tutoriales
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full mt-2"></div>
            </div>
          </div>          
          <p className="text-lg leading-relaxed text-justify">
            Aprende a crear increíbles modelos 3D con nuestros tutoriales paso a paso. 
            Desde conceptos básicos hasta técnicas avanzadas, encuentra todo lo que necesitas.
          </p>
        </div>
        <hr className="border-t-2 border-linea/20 my-5" />
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-azul-gradient to-morado-gradient rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">Guías Disponibles</h2>
          </div>
          <div className="relative">
            <div className="relative bg-principal/30 backdrop-blur-sm border border-linea/20 rounded-2xl p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-azul-gradient"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-r-2 border-l-2 border-morado-gradient absolute inset-0 animate-reverse"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">Cargando tutoriales...</p>
                    <p className="text-gray-400 text-sm mt-1">Preparando el contenido educativo</p>
                  </div>
                </div>
              ) : tutoriales.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tutoriales.map((tutorial, index) => (
                    <div
                      key={tutorial.id || tutorial.titulo || index}
                      className="transform transition-all duration-300 hover:scale-105"
                    >
                      <TutorialCard tutorial={tutorial} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-azul-gradient/20 to-morado-gradient/20 flex items-center justify-center">
                    <BookOpen size={32} className="text-azul-gradient" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No hay tutoriales disponibles
                    </h3>
                    <p className="text-gray-400 max-w-md">
                      Los tutoriales se están preparando. Vuelve pronto para acceder 
                      a contenido educativo sobre generación 3D.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};