// src/features/prediction/components/shared/PredictionHistory.jsx

import { useState, useEffect, useCallback } from "react";
import { auth } from "../../../../config/firebase";
import { GenerationCard } from "./GenerationCard";
import { DeleteConfirmationModal } from "../../../../components/modals/DeleteConfirmationModal";
import { SuccessModal } from "../../../../components/modals/SuccessModal";
import { LoadingModal } from "../../../../components/modals/LoadingModal";
import { getGenerations, deleteGeneration } from "../../services/predictionApi";

export const PredictionHistory = ({ selectedTab, open3DViewer }) => {
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
        error.message || `Error al obtener el historial de ${selectedTab}.`
      );
      setGenerations([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTab]);

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
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-azul-gradient animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-4 border-b-transparent border-morado-gradient animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
          </div>
        </div>
      )}

      {apiError && (
        <div className="my-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-300 text-center">
          {apiError}
        </div>
      )}

      {!isLoading && generations.length === 0 && !apiError && (
        <div className="flex justify-center items-center h-60">
          <p className="text-xl text-gray-500 text-center px-4">
            Aún no has generado ningún objeto en esta categoría.
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
              open3DViewer={open3DViewer}
            />
          ))}
        </div>
      )}

      <DeleteConfirmationModal
        showModal={showDeleteModal}
        closeModal={closeDeleteModal}
        onConfirm={handleDeleteGeneration}
        message={
          generationToDelete
            ? `¿Seguro que deseas eliminar "${generationToDelete.generation_name}"?`
            : "¿Estás seguro de eliminar esta generación?"
        }
      />
      <LoadingModal
        showLoadingModal={deleteLoading}
        steps={["Eliminando objeto..."]}
      />
      <SuccessModal
        showSuccessModal={showSuccessModal}
        closeSuccessModal={closeSuccessModal}
        message="El objeto ha sido eliminado con éxito."
      />
    </div>
  );
};