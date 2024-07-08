import React from "react";
import { Modal, Button } from "flowbite-react";

export const ErrorModal = ({ showModal, closeModal, errorMessage }) => {
  return (
    <Modal 
      show={showModal} 
      size="md" 
      popup={true} 
      onClose={closeModal}
    >
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-70">
        <Modal.Body>
          <div className="text-center bg-[#171735] rounded-xl py-8 px-6 w-96">
            <h3 className="mb-5 text-lg font-normal text-gray-50 dark:text-gray-400">
              Error
            </h3>
            <p className="mb-5 text-gray-50 dark:text-gray-400">
              {errorMessage}
            </p>
            <div className="flex justify-center">
              <Button
                className="bg-red-600 text-white hover:bg-red-700 rounded-xl"
                onClick={closeModal}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};