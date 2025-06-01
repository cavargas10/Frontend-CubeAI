import { CarruselItem } from "../../../components/ui/CarruselItem";

export const MarqueeSection = () => {
  const upperMarquee = [
    "Boceto a 3D",
    "Creatividad",
    "Imagen a 3D",
    "Modelos 3D",
    "Texto a 3D",
    "Generación 3D",
    "Texto a Imagen a 3D",
    "Múltiples imágenes a 3D",
    "Único a 3D",
  ];

  const lowerMarquee = [
    "Boceto a 3D",
    "Creatividad",
    "Imagen a 3D",
    "Modelos 3D",
    "Texto a 3D",
    "Generación 3D",
    "Texto a Imagen a 3D",
    "Múltiples imágenes a 3D",
    "Único a 3D",
  ];

  return (
    <div className=" overflow-hidden font-inter font-bold my-12 ">
      <CarruselItem texts={upperMarquee} from={0} to={"-100%"} />
      <CarruselItem texts={lowerMarquee} from={"-100%"} to={0} />
    </div>
  );
};
