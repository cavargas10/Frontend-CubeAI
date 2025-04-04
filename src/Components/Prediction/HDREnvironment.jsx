import React, { useEffect} from "react";
import * as THREE from 'three';
import { Environment } from "@react-three/drei";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { useLoader, useThree } from "@react-three/fiber";
import environmentHDR from '../../assets/venice_sunset_1k.hdr' 


export function HDREnvironment() {
    const { gl } = useThree();
    const texture = useLoader(RGBELoader, environmentHDR);
    
    useEffect(() => {
      const gen = gl.capabilities.isWebGL2 ? 1 : 0;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 3;
      gl.outputEncoding = THREE.sRGBEncoding;
    }, [texture, gl]);
  
    return <Environment map={texture} />;
  }