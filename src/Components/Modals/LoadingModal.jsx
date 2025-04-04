import React, { useEffect, useState } from "react";
import { Modal } from "flowbite-react";

export const LoadingModal = ({ showLoadingModal, onComplete }) => {
  const [progress, setProgress] = useState(0); // Estado para el progreso de la barra
  const [message, setMessage] = useState("Iniciando proceso..."); // Estado para los mensajes dinámicos

  useEffect(() => {
    if (showLoadingModal) {
      setProgress(0); // Reiniciar el progreso cuando se abre el modal
      simulateProgress();
    }
  }, [showLoadingModal]);

  const simulateProgress = () => {
    let currentProgress = 0;
    const totalTimeInSeconds = 200 + Math.random() * 80; // Tiempo total entre 100 y 180 segundos
    const intervalTime = 1000; // Actualizar cada segundo (1000ms)
    const incrementPerStep = 100 / (totalTimeInSeconds); // Incremento por paso para llegar al 100%
    const messages = [
      "Iniciando proceso...",
      "Generando datos...",
      "Procesando información...",
      "Cargando recursos...",
      "Finalizando...",
    ];

    const interval = setInterval(() => {
      currentProgress += incrementPerStep; // Incrementa el progreso en pequeños pasos
      const randomMessageIndex = Math.floor(Math.random() * messages.length);

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setMessage("¡Proceso completado!");
        setTimeout(() => {
          onComplete(); // Llama a la función onComplete cuando termina
        }, 1000); // Espera 1 segundo antes de cerrar
      } else {
        setMessage(messages[randomMessageIndex]); // Actualiza el mensaje dinámicamente
      }

      setProgress(currentProgress);
    }, intervalTime);
  };

  return (
    <Modal show={showLoadingModal} size="md" popup={true}>
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-70">
        <Modal.Body>
          <div className="text-center z-50 bg-[#171735] rounded-xl py-8 px-6 w-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="mb-5 text-lg font-normal text-gray-50 dark:text-gray-400">
              {message}
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};