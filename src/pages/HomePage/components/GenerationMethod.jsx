import { ArrowRight, ArrowDown } from "@phosphor-icons/react";

export function GenerationMethod({
  title,
  description,
  inputType,
  inputText,
  inputImage,
  inputImages,
  intermediateImage,
  outputImage,
  icon,
  index = 0,
}) {
  const isEven = index % 2 === 0;

  return (
    <div className="flex flex-col rounded-2xl border border-border/40 bg-secondary/10 backdrop-blur-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_10px_30px_rgba(51,51,234,0.2)] group">
      {/* Encabezado con gradiente */}
      <div
        className={`p-6 border-b border-border/40 ${
          isEven
            ? "bg-gradient-to-r from-[#3333EA]/10 to-[#A975FF]/10"
            : "bg-gradient-to-r from-[#A975FF]/10 to-[#3333EA]/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/20 p-3 shadow-inner">{icon}</div>
          <h3 className="text-xl font-bold font-heading text-primary tracking-wide">
            {title}
          </h3>
        </div>
        <p className="text-foreground/80 mt-3 text-sm lg:text-base">{description}</p>
      </div>

      {/* Secuencia de transformación */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Entrada */}
          {inputImages ? (
            <div className="flex flex-wrap lg:flex-nowrap justify-center gap-4 w-full">
              {inputImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-full max-w-[250px] aspect-square rounded-2xl overflow-hidden border border-border/40 shadow-md flex-shrink-0"
                >
                  <img
                    src={img}
                    alt={`Vista ${['Frontal', 'Lateral', 'Trasera'][idx]}`}
                    className="w-[80%] h-[80%] object-cover mx-auto my-4"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center text-xs py-1">
                    {['Frontal', 'Lateral', 'Trasera'][idx]}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative w-full max-w-[250px] aspect-square rounded-2xl overflow-hidden border border-border/40 shadow-md flex-shrink-0">
              {inputText ? (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="bg-black/90 p-6 rounded-lg text-center max-w-[80%]">
                    <strong className="text-white block mb-2">Prompt de usuario:</strong>
                    <span className="text-white/80 text-sm lg:text-base font-medium">
                      {inputText}
                    </span>
                  </div>
                </div>
              ) : (
                <img
                  src={inputImage || "/placeholder.svg"}
                  alt={`Entrada para ${title}`}
                  className="w-[80%] h-[80%] object-cover mx-auto my-4"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center text-xs py-1">
                {inputType}
              </div>
            </div>
          )}

          {/* Flecha animada */}
          <div className="flex justify-center items-center py-2 relative">
            <div className="lg:hidden w-16 h-16 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient flex items-center justify-center shadow-md group-hover:bg-gradient-to-r group-hover:from-azul-gradient group-hover:to-morado-gradient transition-all duration-300 animate-fade-down">
              <ArrowDown className="h-6 w-6 text-primary group-hover:scale-110 transition-all duration-300" weight="bold" />
            </div>
            <div className="hidden lg:flex w-16 h-16 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient items-center justify-center shadow-md group-hover:bg-gradient-to-r group-hover:from-azul-gradient group-hover:to-morado-gradient transition-all duration-300 animate-fade-right">
              <ArrowRight className="h-6 w-6 text-primary group-hover:scale-110 transition-all duration-300" weight="bold" />
            </div>
            <div className="absolute -z-10 w-20 h-20 rounded-full bg-gradient-to-r from-[#3333EA]/10 to-[#A975FF]/10 animate-pulse"></div>
          </div>

          {/* Imagen Intermedia (si existe) */}
          {intermediateImage && (
            <>
              <div className="relative w-full max-w-[250px] aspect-square rounded-2xl overflow-hidden border border-border/40 shadow-md flex-shrink-0">
                <img
                  src={intermediateImage}
                  alt={`Imagen intermedia para ${title}`}
                  className="w-[80%] h-[80%] object-cover mx-auto my-4"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center text-xs py-1">
                  Imagen Intermedia
                </div>
              </div>

              {/* Flecha animada */}
              <div className="flex justify-center items-center py-2 relative">
                <div className="lg:hidden w-16 h-16 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient flex items-center justify-center shadow-md group-hover:bg-gradient-to-r group-hover:from-azul-gradient group-hover:to-morado-gradient transition-all duration-300 animate-fade-down">
                  <ArrowDown className="h-6 w-6 text-primary group-hover:scale-110 transition-all duration-300" weight="bold" />
                </div>
                <div className="hidden lg:flex w-16 h-16 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient items-center justify-center shadow-md group-hover:bg-gradient-to-r group-hover:from-azul-gradient group-hover:to-morado-gradient transition-all duration-300 animate-fade-right">
                  <ArrowRight className="h-6 w-6 text-primary group-hover:scale-110 transition-all duration-300" weight="bold" />
                </div>
                <div className="absolute -z-10 w-20 h-20 rounded-full bg-gradient-to-r from-azul-gradient/20 to-morado-gradient/20 animate-pulse"></div>
              </div>
            </>
          )}

          {/* Salida */}
          <div className="relative w-full max-w-[250px] aspect-square rounded-2xl overflow-hidden border border-border/40 shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:border-primary/30 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/5 z-10"></div>
            {outputImage.endsWith(".webm") ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover mx-auto transition-all duration-500"
              >
                <source src={outputImage} type="video/webm" />
                Tu navegador no soporta el formato de video.
              </video>
            ) : (
              <img
                src={outputImage || "/placeholder.svg"}
                alt={`Resultado para ${title}`}
                className="w-full h-full object-cover mx-auto transition-all duration-500"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center text-xs py-1">
              Modelo 3D
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Animaciones personalizadas
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
  @keyframes fadeDown {
    0% { transform: translateY(0); }
    50% { transform: translateY(5px); }
    100% { transform: translateY(0); }
  }
  @keyframes fadeRight {
    0% { transform: translateX(0); }
    50% { transform: translateX(5px); }
    100% { transform: translateX(0); }
  }
  .animate-fade-down {
    animation: fadeDown 1.5s infinite ease-in-out;
  }
  .animate-fade-right {
    animation: fadeRight 1.5s infinite ease-in-out;
  }
  /* Hover effect for input/output images */
  .group:hover .input-output-image {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
`;
document.head.appendChild(styleSheet);