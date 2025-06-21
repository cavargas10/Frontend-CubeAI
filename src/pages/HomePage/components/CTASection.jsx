import fondo from "../../../assets/fondo.webp";
import { Link } from "react-router-dom";
import { CaretRight } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export const CTASection = () => {
  const { t } = useTranslation();

  return (
    <div className="sm:mt-2 relative h-screen ">
      <img
        src={fondo}
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover  object-center opacity-20"
      />

      <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
        <h1 className="text-3xl w-2/3 text-center sm:text-5xl xl:text-6xl bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text font-inter font-bold mb-10">
          {t("cta.title")}
        </h1>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Link
            to="/login"
            className="inline-flex items-center justify-center py-3 px-6 rounded-md bg-gradient-to-r from-azul-gradient to-morado-gradient text-white text-base font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:scale-105 hover:brightness-110"
          >
            {t("cta.button")}
            <CaretRight className="ml-2 h-5 w-5 text-white" weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  );
};