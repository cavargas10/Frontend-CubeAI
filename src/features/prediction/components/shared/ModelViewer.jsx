import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { SkeletonUtils } from 'three-stdlib';

export const ModelViewer = ({ url, showWireframe = false, showTexture = true, onTextureLoad }) => {
  const [error, setError] = useState(null);
  const materialsRef = useRef({});

  const gltf = useLoader(
    GLTFLoader,
    url,
    undefined,
    (error) => {
      console.error("Error loading model:", error);
      setError(error);
    }
  );

  const clonedScene = useMemo(() => {
    if (gltf.scene) {
      return SkeletonUtils.clone(gltf.scene);
    }
    return null;
  }, [gltf]);


  useEffect(() => {
    if (!clonedScene) return;
    
    materialsRef.current = {}; 
    
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        materialsRef.current[child.uuid] = child.material;

        if (child.material.map && onTextureLoad) {
          try {
            const texture = child.material.map;
            if (texture && texture.image) {
              const canvas = document.createElement("canvas");
              canvas.width = texture.image.width;
              canvas.height = texture.image.height;
              const context = canvas.getContext("2d");
              context.drawImage(texture.image, 0, 0);
              onTextureLoad(canvas.toDataURL("image/png"));
            }
          } catch (e) {
            console.error("Error extracting texture", e);
          }
        }
      }
    });
  }, [clonedScene, onTextureLoad]);

  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child.isMesh && materialsRef.current[child.uuid]) {
        if (showTexture) {
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
  }, [clonedScene, showTexture]);


  if (error || !clonedScene) return null;

  return (
    <>
      <primitive object={clonedScene} position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={[1, 1, 1]} />
      {showWireframe && (
        <primitive
          object={clonedScene.clone()} 
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