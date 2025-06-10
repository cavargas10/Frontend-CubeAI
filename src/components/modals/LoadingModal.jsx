import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";

const defaultSteps = [
  "Iniciando...",
  "Procesando...",
  "Un momento, por favor...",
  "Casi listo...",
];

export const LoadingModal = ({ showLoadingModal, steps }) => {
  const activeSteps = steps && steps.length > 0 ? steps : defaultSteps;
  const [currentMessage, setCurrentMessage] = useState(activeSteps[0]);

  useEffect(() => {
    if (!showLoadingModal) {
      setCurrentMessage(activeSteps[0]);
      return;
    }

    let stepIndex = 0;
    setCurrentMessage(activeSteps[0]);
    const intervalTime = 10000; 

    const interval = setInterval(() => {
      stepIndex++;
      
      if (stepIndex >= activeSteps.length) {
        clearInterval(interval);
      } else {
        setCurrentMessage(activeSteps[stepIndex]);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [showLoadingModal, activeSteps]);

  return (
    <Modal
      show={showLoadingModal}
      size="md"
      popup={true}
      onClose={() => {}} 
      theme={{
        root: {
          base: "fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm",
        },
        content: {
          base: "relative w-full max-w-sm m-auto",
          inner: "relative rounded-none bg-transparent",
        },
      }}
    >
      <Modal.Body className="p-0 bg-transparent">
        <div className="text-center bg-principal rounded-2xl py-8 px-6 border-2 border-linea/50 shadow-2xl shadow-azul-gradient/10">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-azul-gradient animate-spin"></div>
              <div className="absolute inset-0 rounded-full border-4 border-b-transparent border-morado-gradient animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
            </div>
            <h3 key={currentMessage} className="mb-2 text-lg font-semibold text-white animate-[fadeIn_0.5s_ease-in-out]">
              {currentMessage}
            </h3>
            <p className="text-sm text-gray-400">
              Esta operación puede tardar varios minutos.
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};