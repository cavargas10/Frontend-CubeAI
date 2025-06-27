import club from "../../../assets/club.webp";
import utpl from "../../../assets/utpl.webp";
import xrlab from "../../../assets/xrlab.webp";
import { useTranslation } from "react-i18next";

export function LogosSection() {
  const { t } = useTranslation();

  const logos = [
    { src: utpl, alt: "UTPL logo" },
    { src: club, alt: "Club logo" },
    { src: xrlab, alt: "XRLab logo" },
  ];

  return (
    <section className="w-full py-14 bg-transparent">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="inline-block rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-sm text-primary mb-2 bg-azul-gradient">
            {t("logos.badge")}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-azul-gradient to-morado-gradient bg-clip-text text-transparent">
            {t("logos.title")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {logos.map((logo, index) => (
            <div
              key={index}
              className={`
                relative group flex flex-col items-center justify-center h-40 
                rounded-xl 
                bg-secondary/10 
                backdrop-blur-xl 
                p-6 shadow-lg 
                transition-all duration-300
                border border-slate-300/70 dark:border-border/40                 
                hover:shadow-[0_10px_30px_rgba(51,51,234,0.2),0_0_15px_rgba(51,51,234,0.8)]
                hover:border-azul-gradient 
              `}
            >
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-20 w-auto object-contain transition-all duration-500 opacity-90 group-hover:opacity-100 group-hover:scale-125 group-hover:drop-shadow-[0_0_15px_rgba(51,51,234,0.8)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}