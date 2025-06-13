import logo from "../../../assets/logo.webp";
import { Button } from "../../../components/ui/Button";
import { CaretRight } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export const FooterSection = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative py-12 px-4 sm:px-8 bg-transparent">
      <div className="absolute inset-0 z-0
                      bg-gradient-to-b from-white/0 
                      dark:from-background dark:via-secondary/30 dark:to-primary/10"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
        <div className="sm:col-span-1 flex flex-col items-center justify-center 
                       sm:border-r-4 border-slate-300/50 dark:border-white"
        >
          <img
            src={logo}
            alt="Logo"
            className="w-40 h-auto object-contain transition-all duration-300 transform hover:scale-110"
          />
        </div>
        <div className="sm:col-span-2 flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0 sm:space-x-12">
            <div className="text-center sm:text-left max-w-md">
              <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-azul-gradient via-primary to-morado-gradient animate-text-glow">
                {t("footer.title")}
              </h2>
              <p className="leading-relaxed text-slate-700 dark:text-white" style={{ textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)' }}>
                {t("footer.subtitle")}
              </p>
            </div>

            <div className="flex items-center justify-center">
              <Button
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-azul-gradient via-primary to-morado-gradient rounded-md shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:scale-105 hover:brightness-110"
              >
                {t("footer.button")}
                <CaretRight className="ml-2 h-5 w-5 text-white" weight="bold" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-12 pt-6 relative z-10">
        <p className="text-sm text-slate-600 dark:text-white" style={{ textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)' }}>
          {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
};