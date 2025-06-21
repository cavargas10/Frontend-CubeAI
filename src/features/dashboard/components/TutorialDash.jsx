import { useEffect, useState } from "react";
import { BookOpen } from "@phosphor-icons/react";
import hygraphClient from "../../../config/client";
import { GET_HYGRAPH } from "../../../lib/hygraph/queries";
import { TutorialCard } from "../../../components/ui/TutorialCard";
import { useTranslation } from "react-i18next";
import { BrandedSpinner } from '../../../components/ui/BrandedSpinner';

export const TutorialDash = ({ isCollapsed }) => {
  const { t, i18n } = useTranslation();
  const [tutoriales, setTutoriales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutoriales = async () => {
      try {
        setLoading(true);
        const currentLanguage = i18n.language || "es";
        const variables = { locales: [currentLanguage, "es"] };
        const data = await hygraphClient.request(GET_HYGRAPH, variables);
        setTutoriales(data.tutoriales);
      } catch (error) {
        console.error("Error fetching tutorials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutoriales();
  }, [i18n.language]);

  return (
    <section
      className={`min-h-screen bg-white dark:bg-fondologin text-gray-800 dark:text-white transition-all duration-300 ease-in-out relative w-full ${
        isCollapsed ? "sm:pl-[80px]" : "md:pl-[267px] 2xl:pl-[300px]"
      }`}
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-6 pb-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-azul-gradient to-morado-gradient pb-2">
                {t("tutorial_dash_page.title")}
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full mt-2"></div>
            </div>
          </div>
          <p className="text-lg leading-relaxed text-justify">
            {t("tutorial_dash_page.subtitle")}
          </p>
        </div>
        <hr className="border-t-2 border-gray-200 dark:border-linea/20 my-5" />
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-azul-gradient to-morado-gradient rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {t("tutorial_dash_page.section_title")}
            </h2>
          </div>
          <div className="relative">
            <div className="relative bg-gray-50 dark:bg-principal/30 backdrop-blur-sm border border-gray-200 dark:border-linea/20 rounded-2xl p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <BrandedSpinner size="md" />
                  <div className="text-center">
                    <p className="text-gray-800 dark:text-white font-medium">
                      {t("tutorial_dash_page.loading.title")}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      {t("tutorial_dash_page.loading.subtitle")}
                    </p>
                  </div>
                </div>
              ) : tutoriales.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tutoriales.map((tutorial, index) => (
                    <div
                      key={tutorial.id || tutorial.titulo || index}
                      className="transform transition-all duration-300 hover:scale-105"
                    >
                      <TutorialCard tutorial={tutorial} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gradient-to-br from-azul-gradient/20 to-morado-gradient/20 flex items-center justify-center">
                    <BookOpen size={32} className="text-azul-gradient" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {t("tutorial_dash_page.empty.title")}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      {t("tutorial_dash_page.empty.subtitle")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
