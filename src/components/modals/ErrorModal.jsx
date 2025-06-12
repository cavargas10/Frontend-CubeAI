import { Modal, Button } from "flowbite-react";
import { XCircle } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export const ErrorModal = ({ showModal, closeModal, errorMessage }) => {
  const { t } = useTranslation();

  return (
    <Modal
      show={showModal}
      size="md"
      popup={true}
      onClose={closeModal}
      theme={{
        root: { base: "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" },
        content: { base: "relative w-full max-w-sm m-auto", inner: "relative rounded-none bg-transparent" },
      }}
    >
      <Modal.Body className="p-0 bg-transparent">
        <div className="text-center bg-principal rounded-2xl py-6 px-6 border-2 border-red-500/30 shadow-2xl shadow-red-500/10">
          <div className="flex flex-col items-center mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-3 shadow-lg">
              <XCircle size={32} color="#fff" weight="bold" />
            </div>
            <h3 className="text-xl font-bold text-red-400">
              {t('auth.modals.error_title')}
            </h3>
          </div>
          <div className="mb-6 text-sm text-gray-300">
            {errorMessage}
          </div>
          <div className="flex justify-center">
            <Button
              className="bg-red-600 text-white font-semibold hover:bg-red-700 rounded-xl w-full py-1.5 transition-all"
              onClick={closeModal}
            >
              {t('auth.modals.close_button')}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};