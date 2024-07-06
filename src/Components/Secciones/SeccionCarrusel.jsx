import React from "react";

import { CarruselItem } from "../Ui/CarruselItem";

export const SeccionCarrusel = () => {
  const upperMarquee = [
    "Creatividad",
    "Imagen a 3D",
    "Modelos 3D",
    "Texto a 3D",
    "Generación 3D",
    "Creatividad",
    "Imagen a 3D",
    "Modelos 3D",
    "Texto a 3D",
    "Generación 3D",
  ];

  const lowerMarquee = [
    "Creatividad",
    "Imagen a 3D",
    "Modelos 3D",
    "Texto a 3D",
    "Generación 3D",
    "Creatividad",
    "Imagen a 3D",
    "Modelos 3D",
    "Texto a 3D",
    "Generación 3D",
  ];

  return (
    <div className=" overflow-hidden font-inter font-bold my-12 ">
      <CarruselItem texts={upperMarquee} from={0} to={"-100%"} />
      <CarruselItem texts={lowerMarquee} from={"-100%"} to={0} />
    </div>
  );
};
