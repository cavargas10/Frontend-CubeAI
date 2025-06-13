import { ArrowRight, ArrowDown } from "@phosphor-icons/react";
import React from "react";

export function GenerationMethod({
  title,
  description,
  inputType,
  inputText,
  inputImage,
  inputImages,
  intermediateImage,
  intermediateLabel,
  outputImage,
  outputLabel,
  icon,
  index = 0,
  views,
}) {
  const isEven = index % 2 === 0;

  return (
    <div className="flex flex-col rounded-2xl bg-secondary/10 backdrop-blur-xl overflow-hidden shadow-lg transition-all duration-300 group
                    border border-slate-300/70 dark:border-border/40
                    hover:shadow-[0_10px_30px_rgba(51,51,234,0.2),0_0_15px_rgba(51,51,234,0.8)] 
                    hover:border-azul-gradient"
    >
      <div
        className={`p-6 border-b border-slate-300/70 dark:border-border/40 group-hover:border-azul-gradient transition-all duration-300 ${
          isEven
            ? "bg-gradient-to-r from-[#3333EA]/10 to-[#A975FF]/10"
            : "bg-gradient-to-r from-[#A975FF]/10 to-[#3333EA]/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`
                absolute -inset-1 rounded-full 
                bg-gradient-to-r from-azul-gradient to-morado-gradient 
                opacity-70 group-hover:opacity-100 transition-opacity duration-300
              `}
            ></div>
            <div
              className={`
                relative z-10 rounded-full bg-primary/20 
                p-3 shadow-inner
                flex items-center justify-center
                transition-transform duration-300 group-hover:scale-125
              `}
            >
              {React.isValidElement(icon)
                ? React.cloneElement(icon, {
                    className:
                      `${icon.props.className || ""} transition-transform duration-300 group-hover:scale-125`.trim(),
                  })
                : icon}
            </div>
          </div>
          <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-white tracking-wide">
            {title}
          </h3>
        </div>
        <p className="text-slate-600 dark:text-gray-300 mt-3 text-sm lg:text-base">
          {description}
        </p>
      </div>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {inputImages ? (
            <div className="flex flex-wrap lg:flex-nowrap justify-center gap-4 w-full">
              {inputImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-full max-w-[250px] aspect-square rounded-2xl overflow-hidden shadow-md flex-shrink-0 transition-all duration-300
                               border border-slate-300/70 dark:border-border/40 group-hover:border-azul-gradient"
                >
                  <img
                    src={img}
                    alt={`Vista ${views[idx]}`}
                    className="w-[80%] h-[80%] object-cover mx-auto my-4"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center text-xs py-1">
                    {views[idx]}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative w-full max-w-[250px] aspect-square rounded-2xl overflow-hidden shadow-md flex-shrink-0 transition-all duration-300
                           border border-slate-300/70 dark:border-border/40 group-hover:border-azul-gradient"
            >
              {inputText ? (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="bg-slate-100 dark:bg-black/90 p-6 rounded-lg text-center max-w-[80%]">
                    <strong className="text-slate-800 dark:text-white block mb-2">
                      Prompt de usuario:
                    </strong>
                    <span className="text-slate-600 dark:text-gray-300 text-sm lg:text-base font-medium">
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
          <div className="flex justify-center items-center py-2 relative">
            <div className="lg:hidden w-16 h-16 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient flex items-center justify-center shadow-md group-hover:bg-gradient-to-r group-hover:from-azul-gradient group-hover:to-morado-gradient transition-all duration-300 animate-fade-down">
              <ArrowDown
                className="h-6 w-6 text-white group-hover:scale-125 transition-all duration-300"
                weight="bold"
              />
            </div>
            <div className="hidden lg:flex w-16 h-16 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient items-center justify-center shadow-md group-hover:bg-gradient-to-r group-hover:from-azul-gradient group-hover:to-morado-gradient transition-all duration-300 animate-fade-right">
              <ArrowRight
                className="h-6 w-6 text-white group-hover:scale-125 transition-all duration-300"
                weight="bold"
              />
            </div>
            <div className="absolute -z-10 w-20 h-20 rounded-full bg-gradient-to-r from-[#3333EA]/10 to-[#A975FF]/10 animate-pulse"></div>
          </div>
          {intermediateImage && (
            <>
              <div className="relative w-full max-w-[250px] aspect-square rounded-2xl overflow-hidden shadow-md flex-shrink-0 transition-all duration-300
                             border border-slate-300/70 dark:border-border/40 group-hover:border-azul-gradient"
              >
                <img
                  src={intermediateImage}
                  alt={`Imagen intermedia para ${title}`}
                  className="w-[80%] h-[80%] object-cover mx-auto my-4"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center text-xs py-1">
                  {intermediateLabel}
                </div>
              </div>
              <div className="flex justify-center items-center py-2 relative">
                <div className="lg:hidden w-16 h-16 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient flex items-center justify-center shadow-md group-hover:bg-gradient-to-r group-hover:from-azul-gradient group-hover:to-morado-gradient transition-all duration-300 animate-fade-down">
                  <ArrowDown
                    className="h-6 w-6 text-white group-hover:scale-125 transition-all duration-300"
                    weight="bold"
                  />
                </div>
                <div className="hidden lg:flex w-16 h-16 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient items-center justify-center shadow-md group-hover:bg-gradient-to-r group-hover:from-azul-gradient group-hover:to-morado-gradient transition-all duration-300 animate-fade-right">
                  <ArrowRight
                    className="h-6 w-6 text-white group-hover:scale-125 transition-all duration-300"
                    weight="bold"
                  />
                </div>
                <div className="absolute -z-10 w-20 h-20 rounded-full bg-gradient-to-r from-azul-gradient/20 to-morado-gradient/20 animate-pulse"></div>
              </div>
            </>
          )}
          <div className="relative w-full max-w-[250px] aspect-square rounded-2xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-lg flex-shrink-0
                         border border-slate-300/70 dark:border-border/40 group-hover:border-azul-gradient"
          >
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
              {outputLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}