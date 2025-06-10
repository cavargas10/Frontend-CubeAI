import { XCircle } from "@phosphor-icons/react";
import { Modal, Button } from "flowbite-react";

export const DeleteConfirmationModal = ({
  showModal,
  closeModal,
  onConfirm, 
  message
}) => {
  return (
    <Modal
      show={showModal}
      size="md"
      popup={true}
      onClose={closeModal}
      theme={{
        root: {
          base: "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm",
          backdrop: "fixed inset-0 z-40 bg-black bg-opacity-50"
        },
        content: {
          base: "relative w-full max-w-md m-auto",
          inner: "relative rounded-none bg-transparent"
        }
      }}
    >
      <Modal.Body className="flex items-center justify-center p-0 bg-transparent">
        <div className="text-center bg-[#171735] rounded-xl py-8 px-6 w-96 relative z-50">
          <XCircle size={40} color="#ff0000" className="mx-auto mb-4" />
          <h3 className="mb-5 text-lg font-normal text-gray-50 dark:text-gray-400">
            {message}
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              className="bg-red-600 text-white hover:bg-red-700 rounded-xl"
              onClick={onConfirm} 
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
    </Modal>
  );
};