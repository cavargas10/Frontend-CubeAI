import React, { useState, useEffect, useMemo } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

export const Model = ({ url, onLoad }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { camera } = useThree();

  useEffect(() => {
    setIsLoading(true);
    setError(null);
  }, [url]);

  const fileExtension = useMemo(() => {
    if (!url) {
      console.error("Model URL is undefined");
      return null;
    }
    return url.split(".").pop().toLowerCase();
  }, [url]);

  const loader = useMemo(() => {
    switch (fileExtension) {
      case "gltf":
      case "glb":
        return GLTFLoader;
      case "obj":
        return OBJLoader;
      default:
        console.error(`Unsupported file type: ${fileExtension}`);
        return null;
    }
  }, [fileExtension]);

  const model = useLoader(
    loader,
    url,
    undefined,
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.error("An error occurred loading the model:", error);
      setError(error);
      setIsLoading(false);
    }
  );

  useEffect(() => {
    if (model) {
      setIsLoading(false);
      if (onLoad) onLoad();
    }
  }, [model, camera, onLoad]);

  const object = fileExtension === "obj" ? model : model.scene;

  return (
    <primitive
      object={object}
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
      scale={[1, 1, 1]}
    />
  );
};
