import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

export const Model = ({ url }) => {
  if (!url) {
    console.error("Model URL is undefined");
    return null;
  }

  const fileExtension = url.split(".").pop().toLowerCase();

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

  if (!loader) {
    return null;
  }

  const model = useLoader(loader, url);

  const object = fileExtension === "obj" ? model : model.scene;

  return (
    <primitive
      object={object}
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
};
