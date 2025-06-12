import { useEffect, useState } from "react";
import hygraphClient from "../config/client";
import { GET_HYGRAPH } from "../lib/hygraph/queries";
import { TutorialCard } from "../components/ui/TutorialCard";
import { useTranslation } from "react-i18next";

export const TutorialsPage = () => {
  const [tutoriales, setTutoriales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setIsLoading(true);
    const fetchTutoriales = async () => {
      try {
        const currentLanguage = i18n.language || 'es';
        const variables = { locales: [currentLanguage, 'es'] };
        const data = await hygraphClient.request(GET_HYGRAPH, variables);

        setTutoriales(Array.isArray(data?.tutoriales) ? data.tutoriales : []);
      } catch (error) {
        console.error("Error fetching tutorials:", error);
        setTutoriales([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTutoriales();
  }, [i18n.language]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-24 pb-16 bg-fondologin">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`h-10 sm:h-12 bg-linea/30 rounded-md mx-auto mb-3 animate-pulse ${t('tutorials_page.loading.title_placeholder_width')}`}></div>
            <div className="mt-3 w-32 md:w-40 h-1 bg-linea/20 rounded-full mx-auto mb-6 animate-pulse"></div>
            <div className={`h-6 bg-linea/20 rounded-md mx-auto mb-12 animate-pulse ${t('tutorials_page.loading.subtitle_placeholder_width')}`}></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-principal rounded-xl h-72 animate-pulse border border-linea/30"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-24 pb-16 bg-fondologin">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 md:mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            {t("tutorials_page.title")}
          </h1>
          <div className="mt-3 w-32 md:w-40 h-1 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full mx-auto shadow-md shadow-morado-gradient/30" />
          <p className="text-lg text-white max-w-2xl mx-auto mt-6">
            {t("tutorials_page.subtitle")}
          </p>
        </div>
        <div className="pb-10 md:pb-16">
          {tutoriales.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {tutoriales.map((tutorial, index) => (
                <div
                  key={tutorial.id || tutorial.titulo}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <TutorialCard tutorial={tutorial} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg
                  className="mx-auto h-16 w-16 text-white mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z"
                  />
                </svg>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {t("tutorials_page.empty.title")}
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  {t("tutorials_page.empty.subtitle")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};