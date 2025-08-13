// src/features/prediction/hooks/useModelUpload.jsx

import { useState, useCallback } from "react";

export const useModelUpload = () => {
  const [modelFile, setModelFile] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [modelKey, setModelKey] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file) => {
    if (file && (file.name.endsWith(".glb") || file.name.endsWith(".obj"))) {
      setModelFile(file);
      const url = URL.createObjectURL(file);
      setModelUrl(url);
      setModelKey(prev => prev + 1);
    } else if (file) {
      console.warn("Tipo de archivo no soportado. Por favor, sube un .glb o .obj");
    }
  }, []);

  const handleModelChange = useCallback((event) => {
    processFile(event.target.files?.[0]);
  }, [processFile]);
  
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  }, [processFile]);

  // --- ¡NUEVA FUNCIÓN! ---
  const resetModelUpload = useCallback(() => {
    setModelFile(null);
    if (modelUrl) {
      URL.revokeObjectURL(modelUrl); // Libera memoria
    }
    setModelUrl(null);
    setIsDragging(false);
  }, [modelUrl]);

  return { 
    modelFile, 
    modelUrl, 
    modelKey, 
    isDragging, 
    handleModelChange, 
    handleDragOver, 
    handleDragLeave, 
    handleDrop,
    resetModelUpload // ¡Exportamos la nueva función!
  };
};