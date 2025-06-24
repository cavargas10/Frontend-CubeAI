import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { X } from "@phosphor-icons/react";
import { PredictionHistory } from "../../../features/prediction/components/shared/PredictionHistory";
import { ModelResultViewer } from "../../../features/prediction/components/shared/ModelResultViewer";
import { useTranslation } from "react-i18next";
import { getGenerations } from "../../../features/prediction/services/predictionApi";
import { useAuthContext } from "../../../features/auth/context/AuthContext";
import { GENERATION_TYPES } from "../../../features/prediction/config/generationTypes";

export const Visualizador = ({ isCollapsed }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthContext();
  const [selectedTab, setSelectedTab] = useState(
    searchParams.get("type") || "Texto3D"
  );
  const [selectedGenerationForViewer, setSelectedGenerationForViewer] =
    useState(null);
  const [isLoadingViewer, setIsLoadingViewer] = useState(false);
  const viewParam = searchParams.get("view");
  const typeParam = searchParams.get("type");

  useEffect(() => {
    const loadGenerationFromUrl = async () => {
      if (viewParam && typeParam && user) {
        setIsLoadingViewer(true);
        try {
          const token = await user.getIdToken();
          const generations = await getGenerations(token, typeParam);
          const generationToView = generations.find(
            (g) => g.generation_name === decodeURIComponent(viewParam)
          );
          if (generationToView) {
            setSelectedGenerationForViewer(generationToView);
            if (selectedTab !== typeParam) {
              setSelectedTab(typeParam);
            }
          } else {
            navigate("/dashboard/visualizador", { replace: true });
          }
        } catch (error) {
          console.error("Error loading generation from URL:", error);
          navigate("/dashboard/visualizador", { replace: true });
        } finally {
          setIsLoadingViewer(false);
        }
      } else {
        setSelectedGenerationForViewer(null);
      }
    };

    loadGenerationFromUrl();
  }, [viewParam, typeParam, user, navigate, selectedTab]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    navigate("/dashboard/visualizador", { replace: true });
  };

  const close3DViewer = () => {
    navigate("/dashboard/visualizador", { replace: true });
  };

  const isViewerOpen = !!viewParam && !!selectedGenerationForViewer;

  const ViewerLoading = () => (
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-morado-gradient"></div>
      <p className="mt-4 text-white">Cargando modelo...</p>
    </div>
  );

  return (
    <section
      className={`min-h-screen bg-white dark:bg-fondologin transition-all duration-300 ease-in-out relative w-full flex flex-col ${
        isCollapsed ? "sm:pl-[80px]" : "md:pl-[267px] 2xl:pl-[300px]"
      }`}
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-6 pb-8 flex flex-col flex-grow">
        {isLoadingViewer ? (
          <ViewerLoading />
        ) : isViewerOpen ? (
          <div className="flex-grow flex flex-col bg-white dark:bg-gradient-to-br from-principal via-[#0F102F] to-principal border-2 border-gray-200 dark:border-linea/20 rounded-3xl shadow-lg dark:shadow-2xl dark:shadow-morado-gradient/10 overflow-hidden">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-linea/30 flex-shrink-0">
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text truncate pr-4">
                {selectedGenerationForViewer.generation_name}
              </h3>
              <button
                onClick={close3DViewer}
                aria-label={t("visualizer_page.close_viewer_label")}
                className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-linea/30 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                <X size={20} weight="bold" />
              </button>
            </div>
            <div className="flex-grow p-2 sm:p-4 min-h-0">
              <div className="w-full h-full bg-gray-100 dark:bg-black/20 rounded-2xl overflow-hidden">
                <ModelResultViewer
                  modelUrl={selectedGenerationForViewer.modelUrl}
                  downloadFilename={`${selectedGenerationForViewer.generation_name}.glb`}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex-shrink-0">
              <div className="flex items-center gap-4 mb-3">
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-azul-gradient to-morado-gradient pb-2">
                    {t("visualizer_page.title")}
                  </h1>
                  <div className="h-1 w-32 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full mt-2"></div>
                </div>
              </div>
              <p className="text-lg leading-relaxed text-justify text-gray-800 dark:text-white">
                {t("visualizer_page.subtitle")}
              </p>
            </div>
            <hr className="border-t-2 border-gray-200 dark:border-linea/20 my-5 flex-shrink-0" />
            <div className="mb-6 flex-shrink-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-azul-gradient to-morado-gradient rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {t("visualizer_page.section_title")}
                </h2>
              </div>
              <div className="w-full">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-azul-gradient/20 scrollbar-track-transparent">
                  <div className="flex gap-2 p-2 bg-gray-100 dark:bg-principal/50 rounded-2xl border border-gray-200 dark:border-linea/20 backdrop-blur-sm w-full">
                    {GENERATION_TYPES.map((type) => {
                      const IconComponent = type.icon;
                      const isActive = selectedTab === type.id;
                      const tabTranslations = t(type.tabLabelKey, {
                        returnObjects: true,
                      });

                      return (
                        <button
                          key={type.id}
                          className={`relative flex items-center gap-1.5 px-2 lg:px-3 py-3 rounded-xl font-medium text-xs lg:text-sm transition-all duration-300 ease-in-out transform group whitespace-nowrap flex-1 min-w-0 justify-center
                          ${
                            isActive
                              ? "bg-gradient-to-r from-azul-gradient to-morado-gradient text-white shadow-xl border border-white/20"
                              : "bg-white dark:bg-bg-btn-dash/30 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-bg-btn-dash hover:text-gray-800 dark:hover:text-white hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-transparent dark:hover:border-linea/30"
                          }`}
                          onClick={() => handleTabClick(type.id)}
                        >
                          <IconComponent
                            size={16}
                            className={`transition-all duration-300 flex-shrink-0 ${isActive ? "text-white drop-shadow-sm" : "text-azul-gradient group-hover:text-white"}`}
                          />
                          <span
                            className={`font-semibold tracking-wide truncate text-center ${isCollapsed ? "hidden sm:inline" : "hidden lg:inline"}`}
                          >
                            {isCollapsed
                              ? tabTranslations.label
                              : tabTranslations.short_label}
                          </span>
                          {!isActive && (
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-azul-gradient/0 via-azul-gradient/5 to-morado-gradient/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex-grow">
              <div className="relative bg-gray-50 dark:bg-principal/30 backdrop-blur-sm border border-gray-200 dark:border-linea/20 rounded-2xl p-6 h-full">
                <PredictionHistory selectedTab={selectedTab} />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};