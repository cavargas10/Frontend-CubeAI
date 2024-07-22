import React, { useRef, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Button } from "../Ui/Button";
import { Model } from "../Prediction/Model"; 
import { HDREnvironment } from "../Prediction/HDREnvironment";

const RotatingModel = memo(({ url, rotationSpeed = 0.015 }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <Model url={url} />
    </group>
  );
});

const Canvas3D = memo(({ modelPath, cameraPosition }) => (
  <div className="h-[300px] w-full">
    <Canvas camera={{ position: cameraPosition }}>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} />
      <RotatingModel url={modelPath} />
      <HDREnvironment />
    </Canvas>
  </div>
));

const InputVisualization = memo(({ type, content }) => (
  <div className="bg-fondologin bg-opacity-75 p-2 rounded-md">
    <p className="text-xs text-gray-300 mb-1">{type === 'text' ? 'Texto de entrada:' : 'Imagen de referencia:'}</p>
    {type === 'text' ? (
      <p className="text-white text-sm">{content}</p>
    ) : (
      <img src={content} alt="Imagen de referencia" className="w-full h-auto max-h-[80px] object-contain" />
    )}
  </div>
));

const ModelSection = memo(({ title, description, modelPath, cameraPosition, inputType, inputContent, secondInputType, secondInputContent }) => (
  <div className="sm:flex xl:grid xl:grid-cols-4 xl:gap-4 mt-10">
    <div className="sm:w-96 xl:col-span-2 xl:w-full">
      <h3 className="text-center text-2xl sm:text-center sm:text-4xl xl:text-5xl bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text py-2">
        {title}
      </h3>
      <p className="sm:mt-5 sm:text-lg 2xl:text-2xl sm:text-center sm:mx-auto xl:mt-14 xl:whitespace-normal xl:text-left">
        {description}
      </p>
      <div className="flex justify-center mt-6 sm:mt-6 sm:flex sm:justify-center xl:mt-10 xl:justify-center-center">
        <Button />
      </div>
    </div>
    <div className="sm:ml-10 xl:ml-0 xl:flex xl:justify-center xl:items-center xl:col-span-2 relative">
      <Canvas3D modelPath={modelPath} cameraPosition={cameraPosition} />
      <div className="absolute bottom-4 left-4 flex flex-col space-y-2 max-w-[calc(100%-2rem)]">
        <InputVisualization type={inputType} content={inputContent} />
        {secondInputType && (
          <InputVisualization type={secondInputType} content={secondInputContent} />
        )}
      </div>
    </div>
  </div>
));

const modelSectionData = [
  {
    title: "Texto a 3D",
    description: "Nuestra herramienta de conversión de texto a 3D brinda a los creadores la capacidad de generar modelos tridimensionales en un minuto, incluso para aquellos sin experiencia previa en el ámbito, utilizando simplemente la entrada de texto.",
    modelPath: "/Hamburguesa.obj",
    cameraPosition: [0, 0, 1],
    inputType: "text",
    inputContent: "Una hamburguesa"
  },
  {
    title: "Imagen a 3D",
    description: "Nuestra herramienta de conversión de imagen a 3D permite a los usuarios transformar imágenes 2D en modelos tridimensionales detallados, abriendo nuevas posibilidades para diseñadores y creadores de contenido.",
    modelPath: "/Lion.glb",
    cameraPosition: [0, 0, 2],
    inputType: "image",
    inputContent: "/Tigre.webp"
  },
  {
    title: "Texto a Imagen a 3D",
    description: "Nuestro innovador proceso de texto a imagen a 3D permite a los usuarios describir una escena o objeto con palabras, generar una imagen basada en esa descripción, y luego transformar esa imagen en un modelo 3D completo.",
    modelPath: "/CristianoRonaldo.glb",
    cameraPosition: [0, 0, 2],
    inputType: "text",
    inputContent: "Cristiano Ronaldo",
    secondInputType: "image",
    secondInputContent: "/CristianoRonaldo.webp"
  },
  {
    title: "Único a 3D",
    description: "Nuestra herramienta de Único a 3D permite a los usuarios crear modelos tridimensionales personalizados y únicos, combinando diferentes técnicas de IA para generar resultados verdaderamente originales y creativos.",
    modelPath: "/Groot.glb",
    cameraPosition: [0, 0, -1.1],
    inputType: "image",
    inputContent: "/Groot.png"
  }
];

export const SeccionIA = () => {
  return (
    <div className="mt-48 sm:mt-10 xl:mt-40 text-white xl:font-inter font-bold">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text">
          Avanzando en el modelado 3D con IA
        </h2>
        <p className="sm:mt-4 mt-12 mb-14 text-lg 2xl:text-2xl">
          Convierte texto e imágenes en sorprendentes modelos tridimensionales y <br />
          activos para tus proyectos
        </p>
      </div>

      {modelSectionData.map((sectionData, index) => (
        <ModelSection key={index} {...sectionData} />
      ))}
    </div>
  );
};