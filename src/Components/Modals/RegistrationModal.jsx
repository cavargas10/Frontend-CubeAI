import React from "react";
import { XCircle } from "@phosphor-icons/react";
import { Modal, Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export const RegistrationModal = ({ showModal, closeModal, email }) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register", { state: { email } });
    closeModal();
  };

  return (
    <Modal
      show={showModal}
      size="md"
      popup={true}
      onClose={closeModal}
      className="flex items-center justify-center min-h-screen bg-slate-900 bg-opacity-70"
    >
      <div className="flex items-center justify-center w-full h-full mt-32">
        <Modal.Body>
          <div className="text-center z-100 bg-[#171735] rounded-xl py-8 px-6 w-96">
            <XCircle size={40} color="#ff0000" className="mx-auto mb-4" />
            <h3 className="mb-5 text-lg font-normal text-gray-50 dark:text-gray-400">
              El usuario necesita registrarse para continuar.
            </h3>
            <p className="mb-5 text-sm text-gray-300">
              Para acceder a nuestra plataforma, por favor complete el proceso
              de registro.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white rounded-xl"
                onClick={handleRegister}
              >
                Registrarse
              </Button>
              <Button
                className="bg-red-500 text-white hover:bg-red-700 rounded-xl"
                onClick={closeModal}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};
