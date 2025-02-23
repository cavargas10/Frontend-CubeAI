import React from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { Modal, Button } from "flowbite-react";

export const SuccessModal = ({
  showSuccessModal,
  closeSuccessModal,
  message
}) => {
  return (
    <Modal
      show={showSuccessModal}
      size="md"
      popup={true}
      onClose={closeSuccessModal}
    >
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-70">
        <Modal.Body>
          <div className="text-center z-50 bg-[#171735] rounded-xl py-8 px-6 w-96">
            <CheckCircle size={40} color="#00ff00" className="mx-auto mb-4" />
            <h3 className="mb-5 text-lg font-normal text-gray-50 dark:text-gray-400">
              {message}
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
      </div>
    </Modal>
  );
};