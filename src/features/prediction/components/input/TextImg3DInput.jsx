import React, { useState, useEffect, useCallback } from "react";
import { Sparkle } from "@phosphor-icons/react";
import { Button } from "flowbite-react";
import { ErrorModal } from "../../../../components/modals/ErrorModal";
import { LoadingModal } from "../../../../components/modals/LoadingModal";
import { TextImg3DResult } from "../results/TextImg3DResult"; 
import { usePredictionHandler } from "../../hooks/usePredictionHandler";

const styles = [ 
  { name: "Disney", value: "disney" },
  { name: "Pixar", value: "pixar" },
  { name: "Realista", value: "realista" },
  { name: "Anime", value: "anime" },
  { name: "Chibi", value: "chibi" },
];

export const TextImg3DInput = ({
  user,
  setPrediction_textimg3d_result, 
  BASE_URL,
  prediction_textimg3d_result, 
  activeTab,
  isCollapsed,
}) => {
  const [generationName, setGenerationName] = useState("");
  const [subject, setSubject] = useState(""); 
  const [selectedStyle, setSelectedStyle] = useState(null); 
  const [additionalDetails, setAdditionalDetails] = useState("");

  const {
    isLoading: predictionLoading,
    error: predictionError,
    submitPrediction,
    clearError: clearPredictionError,
    clearResult: clearPredictionResult,
    setError: setPredictionError,
    setIsLoading: setPredictionLoading,
  } = usePredictionHandler(user, BASE_URL);

  const resetComponentState = useCallback(() => {
    setGenerationName("");
    setSubject("");
    setSelectedStyle(null);
    setAdditionalDetails("");
    clearPredictionError();
    clearPredictionResult();
    setPrediction_textimg3d_result(null);
    setPredictionLoading(false);
  }, [clearPredictionError, clearPredictionResult, setPrediction_textimg3d_result, setPredictionLoading]);

  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, [activeTab, resetComponentState]);

  const handleLocalPrediction = async () => {
    if (!generationName || !subject || !selectedStyle || !additionalDetails) {
      setPredictionError("Todos los campos son obligatorios");
      return;
    }

    const result = await submitPrediction("textimg3D", { 
      generationName,
      subject, 
      style: selectedStyle, 
      additionalDetails,
    });

     if (result && typeof setPrediction_textimg3d_result === 'function') {
        setPrediction_textimg3d_result(result);
    }
  };

  return (
     <div className={`w-full bg-fondologin transition-all duration-300 ease-in-out ${
        isCollapsed ? "sm:ml-[80px] xl:ml-[80px] 2xl:ml-[80px]" : "sm:ml-[264px] xl:ml-[265px] 2xl:ml-[300px]"
      }`}>
       <div className="bg-principal pt-6 pb-4 border-b-2 border-linea">
         <p className="text-center text-2xl">Texto e Imagen a 3D</p>
       </div>

       <div className="flex flex-col xl:flex-row w-full min-h-[calc(100vh-200px)] bg-fondologin">
         {/* Formulario (Izquierda) */}
         <div className="w-full xl:w-1/3 p-6 border-r border-linea">
           <div className="flex flex-col gap-4"> 
              {/* Nombre */}
             <div className="flex flex-col gap-3">
               <label className="text-base">Nombre de la generación</label>
               <input
                 type="text"
                 placeholder="Ingrese un nombre"
                 value={generationName}
                 onChange={(e) => setGenerationName(e.target.value)}
                 disabled={predictionLoading}
                 className="bg-transparent border p-2 rounded-md w-full text-sm"
               />
             </div>

              {/* Prompt */}
             <div className="flex flex-col gap-3">
               <label className="text-base">Prompt</label>
               <input
                 type="text"
                 placeholder="Ingrese descripción"
                 value={subject}
                 onChange={(e) => setSubject(e.target.value)}
                 disabled={predictionLoading}
                 className="bg-transparent border p-2 rounded-md w-full text-sm"
               />
             </div>

             <div className="flex flex-col gap-3">
               <label className="text-base">Detalles adicionales</label>
               <input
                 type="text"
                 placeholder="Ingrese detalles adicionales"
                 value={additionalDetails}
                 onChange={(e) => setAdditionalDetails(e.target.value)}
                 disabled={predictionLoading}
                 className="bg-transparent border p-2 rounded-md w-full text-sm"
               />
             </div>
             <div className="flex flex-col gap-2">
               <label className="text-base">Estilo</label>
               <div className="grid grid-cols-3 gap-2">
                 {styles.map((s) => (
                   <button
                     key={s.value}
                     onClick={() => setSelectedStyle(s.value)}
                     disabled={predictionLoading}
                     className={`relative border rounded-md p-2 flex flex-col items-center justify-center transition-all text-sm ${
                       selectedStyle === s.value
                         ? "border-azul-gradient shadow-md scale-105"
                         : "border-gray-500 hover:border-azul-gradient"
                     }`}
                   >
                     <span className="">{s.name}</span>
                   </button>
                 ))}
               </div>
             </div>
             <Button
               onClick={handleLocalPrediction}
               disabled={predictionLoading}
               className="w-full text-base bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient py-2 rounded-lg border-none flex items-center justify-center gap-1"
             >
               <Sparkle size={20} weight="fill" />
               Generar
             </Button>
           </div>
         </div>
         <div className="w-full xl:w-2/3">
           <TextImg3DResult prediction_textimg3d_result={prediction_textimg3d_result} />
         </div>
       </div>

       <ErrorModal
         showModal={!!predictionError}
         closeModal={clearPredictionError}
         errorMessage={predictionError || ""}
       />
       <LoadingModal
         showLoadingModal={predictionLoading}
         message="Generando el modelo 3D..."
       />
     </div>
  );
};