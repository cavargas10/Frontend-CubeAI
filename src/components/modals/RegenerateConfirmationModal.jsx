import { Modal, Button } from "flowbite-react";
import { Warning, ArrowCounterClockwise } from "@phosphor-icons/react";

export const RegenerateConfirmationModal = ({
  showModal,
  closeModal,
  onConfirm,
  generationName,
}) => {
  return (
    <Modal show={showModal} size="md" popup={true} onClose={closeModal}>
      <Modal.Body className="p-0 bg-transparent">
        <div className="text-center bg-white dark:bg-principal rounded-2xl py-6 px-6 border-2 border-amber-200 dark:border-amber-500/30 shadow-2xl shadow-amber-500/10">
          <div className="flex flex-col items-center mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-3 shadow-lg">
              <Warning size={32} color="#fff" weight="bold" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Confirmar Regeneración
            </h3>
          </div>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
            Estás a punto de regenerar{" "}
            <strong className="text-amber-500 dark:text-amber-400">
              "{generationName}"
            </strong>
            .
            <br />
            <span className="font-semibold text-gray-800 dark:text-white mt-2 block">
              El modelo 3D actual será eliminado y reemplazado por el nuevo.
            </span>
          </p>
          <div className="flex justify-center gap-4">
            <Button
              className="flex-1 bg-amber-500 text-white font-semibold hover:bg-amber-600 rounded-xl transition-all flex items-center justify-center gap-2"
              onClick={onConfirm}
            >
              <ArrowCounterClockwise size={18} weight="bold" />
              Sí, Regenerar
            </Button>
            <Button
              className="flex-1 bg-gray-200 dark:bg-linea/50 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-linea/80 font-semibold rounded-xl transition-all"
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