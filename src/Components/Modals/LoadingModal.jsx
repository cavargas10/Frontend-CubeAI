import React from "react";
import { Modal } from "flowbite-react";

export const LoadingModal = ({ showLoadingModal }) => {
  return (
    <Modal
      show={showLoadingModal}
      size="md"
      popup={true}
    >
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-70">
        <Modal.Body>
          <div className="text-center z-50 bg-[#171735] rounded-xl py-8 px-6 w-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="mb-5 text-lg font-normal text-gray-50 dark:text-gray-400">
              Generando objeto 3D...
            </h3>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};