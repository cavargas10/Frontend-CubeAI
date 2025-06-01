import {
  Clock,
  Cpu,
  DownloadSimple,
  Database,
  PaintBrush,
  Image,
} from "@phosphor-icons/react";

export function BenefitsSection() {
  const beneficios = [
    {
      icon: Clock,
      title: "Ahorra Tiempo",
      description:
        "Deja de perder días modelando. El 3D se puede hacer en sólo unos minutos utilizando nuestra IA.",
      gradient: "from-primary/10 to-purple-500/10",
      iconGradient: "from-azul-gradient to-morado-gradient",
    },
    {
      icon: Cpu,
      title: "Interfaz Intuitiva",
      description:
        "Interfaz sencilla e intuitiva. No es necesario convertirse en un experto en modelaje o en avisos.",
      gradient: "from-blue-500/10 to-primary/10",
      iconGradient: "from-azul-gradient to-morado-gradient",
    },
    {
      icon: DownloadSimple,
      title: "Exportación Flexible",
      description:
        "Exporte su modelo 3D como un archivo OBJ o GLB para usarlo sin problemas donde quiera.",
      gradient: "from-primary/10 to-purple-500/10",
      iconGradient: "from-azul-gradient to-morado-gradient",
    },
    {
      icon: Database,
      title: "Almacenamiento",
      description:
        "Genera el objeto 3D que necesites y guárdalo en nuestra base de datos, para que lo puedas utilizar en un futuro.",
      gradient: "from-blue-500/10 to-primary/10",
      iconGradient: "from-azul-gradient to-morado-gradient",
    },
    {
      icon: PaintBrush,
      title: "Múltiples Estilos",
      description:
        "Elige entre varios estilos como: Anime, Pixar, Disney, Realista, Chibi para personalizar tus creaciones 3D.",
      gradient: "from-primary/10 to-purple-500/10",
      iconGradient: "from-azul-gradient to-morado-gradient",
    },
    {
      icon: Image,
      title: "Extracción de Texturas",
      description:
        "Descarga y utiliza las texturas generadas por la IA para tus proyectos. Ideal para desarrolladores de juegos y diseñadores 3D.",
      gradient: "from-blue-500/10 to-primary/10",
      iconGradient: "from-azul-gradient to-morado-gradient",
    },
  ];

  return (
    <section className="py-20 bg-secondary/5 overflow-hidden relative">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-sm font-bold text-primary mb-2 bg-azul-gradient">
              Ventajas
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-azul-gradient via-primary to-morado-gradient bg-clip-text text-transparent text-glow">
              Beneficios de Nuestra Plataforma
            </h2>
            <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Descubre por qué los profesionales y entusiastas eligen nuestra
              tecnología para sus necesidades de creación 3D.
            </p>
          </div>
        </div>

        <div className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {beneficios.map((beneficio, index) => (
            <div
              key={index}
              className={`
                group
                flex flex-col rounded-xl border border-border/40 
                bg-secondary/10 backdrop-blur-xl 
                overflow-hidden shadow-lg 
                transition-all duration-300 
                hover:border-azul-gradient 
                hover:shadow-[0_10px_30px_rgba(51,51,234,0.2),0_0_15px_rgba(51,51,234,0.8)]
                ${index === 4 ? "md:col-span-2 lg:col-span-1" : ""}
              `}
            >
              <div
                className={`
                  p-6 
                  bg-gradient-to-r ${beneficio.gradient}
                  h-full flex flex-col
                `}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div
                      className={`
                        absolute -inset-1 rounded-full 
                        bg-gradient-to-r ${beneficio.iconGradient}
                      `}
                    ></div>
                    <div
                      className={`
                        relative z-10 rounded-full bg-primary/20 
                        p-3 shadow-inner
                        transition-transform duration-300 group-hover:scale-125
                      `}
                    >
                      <beneficio.icon
                        className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-125"
                        weight="bold"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-heading">
                    {beneficio.title}
                  </h3>
                </div>
                <p className="text-foreground/80 flex-grow">
                  {beneficio.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}