import React from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { Modal, Button } from "flowbite-react";

export const SuccessModal = ({
  showSuccessModal,
  closeSuccessModal,
  generationToDelete,
}) => {
  return (
    <Modal
      show={showSuccessModal}
      size="md"
      popup={true}
      onClose={closeSuccessModal}
    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center z-50 bg-[#171735] rounded-xl py-8 px-6 w-96 mt-36 ml-[500px]">
          <CheckCircle size={40} color="#00ff00" className="mx-auto mb-4" />
          <h3 className="mb-5 text-lg font-normal text-gray-50 dark:text-gray-400">
            El objeto {generationToDelete?.generation_name} ha sido eliminado
            con éxito.
          </h3>
          <div className="flex justify-center">
            <Button
              className="bg-[#111127] text-white hover:bg-[#171735] rounded-xl"
              onClick={closeSuccessModal}
            >
              Aceptar
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
