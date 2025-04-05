import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";

export const ModelViewer = ({ url, onLoad, showWireframe = false, showTexture = true, onTextureLoad }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { camera } = useThree();
  const materialsRef = useRef({});

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
    (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
    (error) => {
      console.error("Error loading model:", error);
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

  useEffect(() => {
    if (!model) return;

    let textureFound = false;
    const scene = fileExtension === "obj" ? model : model.scene;

    scene.traverse((child) => {
      if (child.isMesh && !materialsRef.current[child.uuid]) {
        materialsRef.current[child.uuid] = child.material.clone();

        const textureTypes = ["albedo", "map", "normalMap", "roughnessMap", "metalnessMap"];

        textureTypes.forEach((type) => {
          if (child.material[type] && !textureFound) {
            const texture = child.material[type];

            if (texture && texture.image) {
              try {
                const canvas = document.createElement("canvas");
                canvas.width = texture.image.width;
                canvas.height = texture.image.height;
                const context = canvas.getContext("2d");
                context.drawImage(texture.image, 0, 0);
                
                const dataURL = canvas.toDataURL("image/png");
                
                if (dataURL && dataURL.length > 100) {
                  onTextureLoad?.(dataURL);
                  textureFound = true;
                }
              } catch (error) {
                console.error("Error extracting texture:", error);
              }
            }
          }
        });
      }
    });

    if (!textureFound) {
      console.warn("No texture found in the 3D model");
    }
  }, [model, onTextureLoad]);

  useEffect(() => {
    if (!model) return;
    
    const scene = fileExtension === "obj" ? model : model.scene;
    
    scene.traverse((child) => {
      if (child.isMesh) {
        if (showTexture && materialsRef.current[child.uuid]) {
          child.material = materialsRef.current[child.uuid];
        } else {
          child.material = new THREE.MeshStandardMaterial({
            color: "#808080",
            roughness: 0.5,
            metalness: 0.5,
          });
        }
      }
    });
  }, [model, showTexture]);

  const sceneObject = fileExtension === "obj" ? model : model.scene;

  return (
    <>
      <primitive object={sceneObject} position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={[1, 1, 1]} />
      {showWireframe && (
        <primitive
          object={sceneObject.clone()}
          onUpdate={(self) => {
            self.traverse((child) => {
              if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({
                  color: "#FFFFFF",
                  wireframe: true,
                  transparent: true,
                  opacity: 0.6,
                });
              }
            });
          }}
        />
      )}
    </>
  );
};