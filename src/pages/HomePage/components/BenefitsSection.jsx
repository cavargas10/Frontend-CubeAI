import {
  Clock,
  Cpu,
  DownloadSimple,
  Database,
  PaintBrush,
  Image,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export function BenefitsSection() {
  const { t } = useTranslation();
  const beneficios = [
    {
      icon: Clock,
      title: t("benefits.item1.title"),
      description: t("benefits.item1.description"),
      gradient: "from-primary/10 to-purple-500/10",
      iconGradient: "from-azul-gradient to-morado-gradient",
    },
    {
      icon: Cpu,
      title: t("benefits.item2.title"),
      description: t("benefits.item2.description"),
      gradient: "from-blue-500/10 to-primary/10",
      iconGradient: "from-azul-gradient to-morado-gradient",
    },
    {
      icon: DownloadSimple,
      title: t("benefits.item3.title"),
      description: t("benefits.item3.description"),
      gradient: "from-primary/10 to-purple-500/10",
      iconGradient: "from-azul-gradient to-morado-gradient",
    },
    {
      icon: Database,
      title: t("benefits.item4.title"),
      description: t("benefits.item4.description"),
      gradient: "from-blue-500/10 to-primary/10",
      iconGradient: "from-azul-gradient to-morado-gradient",
    },
    {
      icon: PaintBrush,
      title: t("benefits.item5.title"),
      description: t("benefits.item5.description"),
      gradient: "from-primary/10 to-purple-500/10",
      iconGradient: "from-azul-gradient to-morado-gradient",
    },
    {
      icon: Image,
      title: t("benefits.item6.title"),
      description: t("benefits.item6.description"),
      gradient: "from-blue-500/10 to-primary/10",
      iconGradient: "from-azul-gradient to-morado-gradient",
    },
  ];

  return (
    <section className="py-20 bg-transparent">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-sm font-bold text-primary mb-2 bg-azul-gradient">
              {t("benefits.badge")}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-azul-gradient via-primary to-morado-gradient bg-clip-text text-transparent text-glow">
              {t("benefits.title")}
            </h2>
            <p className="max-w-[900px] text-slate-600 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t("benefits.subtitle")}
            </p>
          </div>
        </div>

        <div className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {beneficios.map((beneficio, index) => (
            <div
              key={index}
              className={`
                group
                flex flex-col rounded-xl 
                bg-secondary/10 backdrop-blur-xl 
                overflow-hidden shadow-lg 
                transition-all duration-300 
                border border-slate-300/70 dark:border-border/40 
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
                        className="h-5 w-5 text-white dark:text-primary transition-transform duration-300 group-hover:scale-125"
                        weight="bold"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-white">
                    {beneficio.title}
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-gray-300 flex-grow">
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