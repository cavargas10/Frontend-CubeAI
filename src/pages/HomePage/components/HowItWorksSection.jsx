import { StackSimple, Lightning, Clock } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section id="como-funciona" className="py-20 bg-transparent">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-sm font-bold text-primary mb-2 bg-azul-gradient">
              {t("how_it_works.badge")}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-azul-gradient to-morado-gradient bg-clip-text text-transparent">
              {t("how_it_works.title")}
            </h2>
            <p className="max-w-[900px] text-slate-600 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t("how_it_works.subtitle")}
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="group relative flex flex-col items-center space-y-4 rounded-2xl bg-secondary/10 backdrop-blur-xl p-6 shadow-lg transition-all duration-300 
                         border border-slate-300/70 dark:border-border/40 
                         hover:border-azul-gradient hover:shadow-[0_10px_30px_rgba(51,51,234,0.2),0_0_15px_rgba(51,51,234,0.8)]">
            <div className="absolute top-[-1rem] left-1/2 transform -translate-x-1/2 rounded-full bg-azul-gradient px-3 py-1 text-base font-bold text-white font-heading">
              Paso 1
            </div>
            <div className="rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient p-6">
              <StackSimple
                className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-125"
                weight="bold"
              />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-white">
              {t("how_it_works.step1.title")}
            </h3>
            <p className="text-center text-slate-600 dark:text-gray-300">
              {t("how_it_works.step1.description")}
            </p>
          </div>

          <div className="group relative flex flex-col items-center space-y-4 rounded-2xl bg-secondary/10 backdrop-blur-xl p-6 shadow-lg transition-all duration-300
                         border border-slate-300/70 dark:border-border/40 
                         hover:border-azul-gradient hover:shadow-[0_10px_30px_rgba(51,51,234,0.2),0_0_15px_rgba(51,51,234,0.8)]">
            <div className="absolute top-[-1rem] left-1/2 transform -translate-x-1/2 rounded-full bg-azul-gradient px-3 py-1 text-base font-bold text-white font-heading">
              Paso 2
            </div>
            <div className="rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient p-6">
              <Lightning
                className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-125"
                weight="bold"
              />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-white">
              {t("how_it_works.step2.title")}
            </h3>
            <p className="text-center text-slate-600 dark:text-gray-300">
              {t("how_it_works.step2.description")}
            </p>
          </div>

          <div className="group relative flex flex-col items-center space-y-4 rounded-2xl bg-secondary/10 backdrop-blur-xl p-6 shadow-lg transition-all duration-300
                         border border-slate-300/70 dark:border-border/40 
                         hover:border-azul-gradient hover:shadow-[0_10px_30px_rgba(51,51,234,0.2),0_0_15px_rgba(51,51,234,0.8)]">
            <div className="absolute top-[-1rem] left-1/2 transform -translate-x-1/2 rounded-full bg-azul-gradient px-3 py-1 text-base font-bold text-white font-heading">
              Paso 3
            </div>
            <div className="rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient p-6">
              <Clock
                className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-125"
                weight="bold"
              />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-white">
              {t("how_it_works.step3.title")}
            </h3>
            <p className="text-center text-slate-600 dark:text-gray-300">
              {t("how_it_works.step3.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}