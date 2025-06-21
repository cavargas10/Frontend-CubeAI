import { useState, useEffect, useCallback } from "react";
import { auth } from "../../../../config/firebase";
import { GenerationCard } from "./GenerationCard";
import { DeleteConfirmationModal } from "../../../../components/modals/DeleteConfirmationModal";
import { SuccessModal } from "../../../../components/modals/SuccessModal";
import { LoadingModal } from "../../../../components/modals/LoadingModal";
import { getGenerations, deleteGeneration } from "../../services/predictionApi";
import { useTranslation } from "react-i18next";
import { BrandedSpinner } from '../../../../components/ui/BrandedSpinner';

export const PredictionHistory = ({ selectedTab }) => {
  const { t } = useTranslation();
  const [generations, setGenerations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [generationToDelete, setGenerationToDelete] = useState(null);

  const fetchGenerations = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        const data = await getGenerations(token, selectedTab);
        const sortedGenerations = data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setGenerations(sortedGenerations);
      } else {
        setGenerations([]);
      }
    } catch (error) {
      console.error(`Error fetching ${selectedTab} generations:`, error);
      setApiError(
        `${t("visualizer_page.history.error_prefix")}${selectedTab}.`
      );
      setGenerations([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTab, t]);

  useEffect(() => {
    fetchGenerations();
  }, [fetchGenerations]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Fecha desconocida";
    try {
      const date = new Date(timestamp);
      return isNaN(date.getTime())
        ? "Fecha inválida"
        : date.toLocaleDateString();
    } catch (e) {
      return "Fecha inválida";
    }
  };

  const openDeleteModal = (generation) => {
    setGenerationToDelete(generation);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setGenerationToDelete(null);
    setShowDeleteModal(false);
  };

  const getDeleteConfirmationMessage = () => {
    if (generationToDelete) {
      return `${t("visualizer_page.history.delete_confirm_prefix")} "${generationToDelete.generation_name}"${t("visualizer_page.history.delete_confirm_suffix")}`;
    }
    return t("visualizer_page.history.delete_confirm_generic");
  };

  const handleDeleteGeneration = async () => {
    if (!generationToDelete || !auth.currentUser) return;
    closeDeleteModal();
    setDeleteLoading(true);
    setApiError(null);
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      await deleteGeneration(token, generationToDelete);
      await fetchGenerations();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error deleting generation:", error);
      setApiError(error.message || "Error al eliminar la generación.");
    } finally {
      setDeleteLoading(false);
      setGenerationToDelete(null);
    }
  };

  const closeSuccessModal = () => setShowSuccessModal(false);

  return (
    <div className="w-full px-4 sm:px-0">
      {isLoading && (
        <div className="flex justify-center items-center h-60">
          <BrandedSpinner size="md" />
        </div>
      )}

      {apiError && (
        <div className="my-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-md text-red-700 dark:text-red-300 text-center">
          {apiError}
        </div>
      )}

      {!isLoading && generations.length === 0 && !apiError && (
        <div className="flex justify-center items-center h-60">
          <p className="text-xl text-gray-400 dark:text-gray-500 text-center px-4">
            {t("visualizer_page.history.empty")}
          </p>
        </div>
      )}

      {!isLoading && generations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {generations.map((generation, index) => (
            <GenerationCard
              key={`${generation.generation_name}-${index}`}
              generation={generation}
              formatDate={formatDate}
              openModal={openDeleteModal}
              predictionType={selectedTab}
            />
          ))}
        </div>
      )}

      <DeleteConfirmationModal
        showModal={showDeleteModal}
        closeModal={closeDeleteModal}
        onConfirm={handleDeleteGeneration}
        message={getDeleteConfirmationMessage()}
      />
      <LoadingModal
        showLoadingModal={deleteLoading}
        steps={[t("visualizer_page.history.delete_loading")]}
      />
      <SuccessModal
        showSuccessModal={showSuccessModal}
        closeSuccessModal={closeSuccessModal}
        message={t("visualizer_page.history.delete_success")}
      />
    </div>
  );
};
