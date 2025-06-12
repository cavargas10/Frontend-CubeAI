import { useState, useCallback } from "react";

const IMAGE_TYPES = ["frontal", "lateral", "trasera"];

export const useMultiImageUpload = () => {
  const [imageFiles, setImageFiles] = useState({
    frontal: null,
    lateral: null,
    trasera: null,
  });
  const [imagePreviews, setImagePreviews] = useState({
    frontal: null,
    lateral: null,
    trasera: null,
  });
  const [currentImageType, setCurrentImageType] = useState(IMAGE_TYPES[0]);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file, type) => {
    if (file && file.type.startsWith("image/")) {
      setImageFiles((prev) => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
      const currentIndex = IMAGE_TYPES.indexOf(type);
      if (currentIndex < IMAGE_TYPES.length - 1) {
        setCurrentImageType(IMAGE_TYPES[currentIndex + 1]);
      } else {
        setCurrentImageType(IMAGE_TYPES[0]);
      }
    } else {
      console.warn("Archivo no válido:", file?.name);
    }
  }, []);

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      processFile(file, currentImageType);
    },
    [processFile, currentImageType]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      processFile(file, currentImageType);
    },
    [processFile, currentImageType]
  );

  const selectImageType = useCallback((type) => {
    if (IMAGE_TYPES.includes(type)) {
      setCurrentImageType(type);
    }
  }, []);

  const resetMultiImageState = useCallback(() => {
    setImageFiles({ frontal: null, lateral: null, trasera: null });
    setImagePreviews({ frontal: null, lateral: null, trasera: null });
    setCurrentImageType(IMAGE_TYPES[0]);
    setIsDragging(false);
  }, []);

  return {
    imageFiles,
    imagePreviews,
    currentImageType,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    selectImageType,
    resetMultiImageState,
  };
};
