import { useState, useEffect, useCallback } from "react";
import { auth } from "../../../../config/firebase";
import { GenerationCard } from "./GenerationCard";
import { DeleteConfirmationModal } from "../../../../components/modals/DeleteConfirmationModal";
import { SuccessModal } from "../../../../components/modals/SuccessModal";
import { LoadingModal } from "../../../../components/modals/LoadingModal";
import { getGenerations, deleteGeneration } from "../../services/predictionApi";

export const PredictionHistory = ({ selectedTab }) => {
  const [generations, setGenerations] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [generationToDelete, setGenerationToDelete] = useState(null);

  const fetchGenerations = useCallback(async () => {
    setApiError(null);
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        const data = await getGenerations(token);
        const combinedGenerations = [
          ...(data.imagen3D || []).map((gen) => ({
            ...gen,
            generation_type: "Imagen3D",
          })),
          ...(data.texto3D || []).map((gen) => ({
            ...gen,
            generation_type: "Texto3D",
          })),
          ...(data.textimg3D || []).map((gen) => ({
            ...gen,
            generation_type: "TextImg3D",
          })),
          ...(data.unico3D || []).map((gen) => ({
            ...gen,
            generation_type: "Unico3D",
          })),
          ...(data.multiimg3D || []).map((gen) => ({
            ...gen,
            generation_type: "MultiImagen3D",
          })),
          ...(data.boceto3D || []).map((gen) => ({
            ...gen,
            generation_type: "Boceto3D",
          })),
        ];
        const sortedGenerations = combinedGenerations.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setGenerations(sortedGenerations);
      } else {
        setGenerations([]);
      }
    } catch (error) {
      console.error("Error fetching generations:", error);
      setApiError(error.message || "Error al obtener el historial.");
      setGenerations([]);
    }
  }, []);

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
    setApiError(null);
  };

  const closeModal = () => {
    setGenerationToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDeleteGeneration = async () => {
    if (!generationToDelete || !auth.currentUser) {
      setApiError(
        "No se pudo identificar la generación a eliminar o el usuario."
      );
      setShowDeleteModal(false);
      return;
    }
    setShowDeleteModal(false);
    setShowLoadingModal(true);
    setApiError(null);
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      const generationType = generationToDelete.generation_type;
      const generationName = generationToDelete.generation_name;
      await deleteGeneration(token, generationType, generationName);
      await fetchGenerations();
      setShowLoadingModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error deleting generation:", error);
      setShowLoadingModal(false);
      setApiError(error.message || "Error al eliminar la generación.");
    } finally {
      setGenerationToDelete(null);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const filteredGenerations = generations.filter(
    (generation) => generation.generation_type === selectedTab
  );

  return (
    <div className="w-full px-4 sm:px-0">
      {apiError && (
        <div className="my-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-300 text-center">
          {apiError}
        </div>
      )}
      {filteredGenerations.length === 0 && !apiError && (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-500 text-center px-4">
            Aún no has generado ningún objeto en la categoría "{selectedTab}".
          </p>
        </div>
      )}
      {filteredGenerations.length > 0 && (
        <div className="sm:flex sm:gap-8 gap-4 w-full sm:flex-wrap justify-center sm:justify-start">
          {filteredGenerations.map((generation, index) => (
            <GenerationCard
              key={
                generation.id ||
                `${generation.generation_type}-${generation.generation_name}-${index}`
              }
              generation={generation}
              formatDate={formatDate}
              openModal={openDeleteModal}
            />
          ))}
        </div>
      )}
      <DeleteConfirmationModal
        showModal={showDeleteModal}
        closeModal={closeModal}
        confirmDelete={handleDeleteGeneration}
        message={
          generationToDelete
            ? `¿Seguro que deseas eliminar "${generationToDelete.generation_name}"?`
            : "¿Estás seguro de eliminar esta generación?"
        }
      />
      <LoadingModal
        showLoadingModal={showLoadingModal}
        message="Eliminando objeto..."
      />
      <SuccessModal
        showSuccessModal={showSuccessModal}
        closeSuccessModal={closeSuccessModal}
        message="El objeto ha sido eliminado con éxito."
      />
    </div>
  );
};