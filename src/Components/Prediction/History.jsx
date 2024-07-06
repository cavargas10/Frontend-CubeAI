import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../Config/firebaseConfig";
import { GenerationCard } from "../Ui/GenerationCard";
import { DeleteConfirmationModal } from "../Modals/DeleteConfirmationModal";
import { SuccessModal } from "../Modals/SuccessModal";

const BASE_URL = "http://localhost:8080";

const History = ({ selectedTab }) => {
  const [generations, setGenerations] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generationToDelete, setGenerationToDelete] = useState(null);

  useEffect(() => {
    const fetchGenerations = async () => {
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
            const imagen3D = response.data.imagen3D.map((gen) => ({
              ...gen,
              generation_type: "Imagen3D",
            }));
            const texto3D = response.data.texto3D.map((gen) => ({
              ...gen,
              generation_type: "Texto3D",
            }));
            const textimg3D = response.data.textimg3D.map((gen) => ({
              ...gen,
              generation_type: "TextImg3D",
            }));
            const unico3D = response.data.unico3D.map((gen) => ({
              ...gen,
              generation_type: "Unico3D",
            }));
            const combinedGenerations = [
              ...imagen3D,
              ...texto3D,
              ...textimg3D,
              ...unico3D,
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
        console.error("Error fetching generations:", error);
      }
    };

    fetchGenerations();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleDeleteGeneration = async () => {
    try {
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
        setGenerations(
          generations.filter(
            (gen) => gen.generation_name !== generationToDelete.generation_name
          )
        );
        setShowModal(false);
        setShowSuccessModal(true);
      }
    } catch (error) {
      setError("Error al eliminar la generación.");
      console.error("Error deleting generation:", error);
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
    <div className="">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="flex gap-10 w-full flex-wrap">
        {filteredGenerations.map((generation, index) => (
          <GenerationCard
            key={index}
            generation={generation}
            formatDate={formatDate}
            openModal={openModal}
          />
        ))}
      </div>

      {generationToDelete && (
        <DeleteConfirmationModal
          showModal={showModal}
          closeModal={closeModal}
          handleDeleteGeneration={handleDeleteGeneration}
          generationToDelete={generationToDelete}
        />
      )}

      <SuccessModal
        showSuccessModal={showSuccessModal}
        closeSuccessModal={closeSuccessModal}
        generationToDelete={generationToDelete}
      />
    </div>
  );
};

export default History;
