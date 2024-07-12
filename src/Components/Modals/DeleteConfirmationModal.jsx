import React from "react";
import { XCircle } from "@phosphor-icons/react";
import { Modal, Button } from "flowbite-react";

export const DeleteConfirmationModal = ({
  showModal,
  closeModal,
  handleDeleteGeneration,
  confirmDelete,
  message
}) => {
  return (
    <Modal
      show={showModal}
      size="md"
      popup={true}
      onClose={closeModal}
    >
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-70">
        <Modal.Body>
          <div className="text-center z-50 bg-[#171735] rounded-xl py-8 px-6 w-96">
            <XCircle size={40} color="#ff0000" className="mx-auto mb-4" />
            <h3 className="mb-5 text-lg font-normal text-gray-50 dark:text-gray-400">
              {message}
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                className="bg-red-600 text-white hover:bg-red-700 rounded-xl"
                onClick={handleDeleteGeneration||confirmDelete}
              >
                Sí, claro
              </Button>
              <Button
                className="bg-[#111127] text-white hover:bg-[#171735] rounded-xl"
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