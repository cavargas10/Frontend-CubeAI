import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { auth } from "../../Config/firebaseConfig";
import { GenerationCard } from "../Ui/GenerationCard";
import { DeleteConfirmationModal } from "../Modals/DeleteConfirmationModal";
import { SuccessModal } from "../Modals/SuccessModal";
import { LoadingModal } from "../Modals/LoadingModal";

const History = ({ selectedTab, BASE_URL }) => {
  const [generations, setGenerations] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [generationToDelete, setGenerationToDelete] = useState(null);

  const fetchGenerations = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        const response = await axios.get(`${BASE_URL}/generations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (
          response.data &&
          Array.isArray(response.data.imagen3D) &&
          Array.isArray(response.data.texto3D) &&
          Array.isArray(response.data.textimg3D) &&
          Array.isArray(response.data.unico3D)
        ) {
          const combinedGenerations = [
            ...response.data.imagen3D.map(gen => ({ ...gen, generation_type: "Imagen3D" })),
            ...response.data.texto3D.map(gen => ({ ...gen, generation_type: "Texto3D" })),
            ...response.data.textimg3D.map(gen => ({ ...gen, generation_type: "TextImg3D" })),
            ...response.data.unico3D.map(gen => ({ ...gen, generation_type: "Unico3D" })),
          ];
          const sortedGenerations = combinedGenerations.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          setGenerations(sortedGenerations);
        } else {
          setError("Los datos recibidos no son válidos.");
        }
      }
    } catch (error) {
      setError("Error al obtener el historial de generaciones.");
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchGenerations();
  }, [fetchGenerations]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleDeleteGeneration = async () => {
    try {
      setShowModal(false);
      setShowLoadingModal(true);

      const user = auth.currentUser;
      if (user && generationToDelete) {
        const token = await user.getIdToken();
        const generationType = generationToDelete.generation_type;
        const generationName = encodeURIComponent(
          generationToDelete.generation_name
        );

        await axios.delete(
          `${BASE_URL}/generation/${generationType}/${generationName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Refresh the generations after deletion
        await fetchGenerations();

        setShowLoadingModal(false);
        setShowSuccessModal(true);
      }
    } catch (error) {
      setShowLoadingModal(false);
      setError("Error al eliminar la generación.");
    }
  };

  const openModal = (generation) => {
    setGenerationToDelete(generation);
    setShowModal(true);
  };

  const closeModal = () => {
    setGenerationToDelete(null);
    setShowModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const filteredGenerations = generations.filter(
    (generation) => generation.generation_type === selectedTab
  );

  return (
    <div className="w-full">
      {error && <p style={{ color: "red" }}>{error}</p>}

      {filteredGenerations.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-500">
            Aún no se ha generado ningún objeto en la categoría {selectedTab}.
          </p>
        </div>
      ) : (
        <div className="sm:flex sm:gap-8 gap-0 w-full sm:flex-wrap">
          {filteredGenerations.map((generation, index) => (
            <GenerationCard
              key={`${generation.generation_name}-${index}`}
              generation={generation}
              formatDate={formatDate}
              openModal={openModal}
            />
          ))}
        </div>
      )}

      {generationToDelete && (
        <DeleteConfirmationModal
          showModal={showModal}
          closeModal={closeModal}
          handleDeleteGeneration={handleDeleteGeneration}
          generationToDelete={generationToDelete}
          message={`¿Estás seguro de que deseas eliminar el objeto llamado: ${generationToDelete.generation_name}?`}
        />
      )}

      <LoadingModal
        showLoadingModal={showLoadingModal}
        message="Eliminando objeto..."
      />

      <SuccessModal
        showSuccessModal={showSuccessModal}
        closeSuccessModal={closeSuccessModal}
        generationToDelete={generationToDelete}
        message="El objeto ha sido eliminado con exito"
      />
    </div>
  );
};

export default History;