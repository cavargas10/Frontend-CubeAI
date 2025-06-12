import { Modal, Button } from "flowbite-react";
import { CheckCircle, Sparkle } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export const SuccessModal = ({
  showSuccessModal,
  closeSuccessModal,
  message,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      show={showSuccessModal}
      size="md"
      popup={true}
      onClose={closeSuccessModal}
      theme={{
        root: { base: "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" },
        content: { base: "relative w-full max-w-sm m-auto", inner: "relative rounded-none bg-transparent" },
      }}
    >
      <Modal.Body className="p-0 bg-transparent">
        <div className="text-center bg-principal rounded-2xl py-6 px-6 border-2 border-linea/50 shadow-2xl shadow-green-500/10">
          <div className="relative flex flex-col items-center mb-5">
            <Sparkle size={20} className="text-green-400 absolute top-0 left-10 opacity-70 animate-pulse" />
            <Sparkle size={16} className="text-green-500 absolute top-8 right-8 opacity-60 animate-pulse [animation-delay:0.5s]" />
            <Sparkle size={12} className="text-green-300 absolute bottom-0 left-16 opacity-80 animate-pulse [animation-delay:0.2s]" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-3 shadow-lg">
              <CheckCircle size={32} color="#fff" weight="bold" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {t('config_dash_page.modals.success_title')}
            </h3>
          </div>
          <p className="mb-6 text-sm text-gray-300">
            {message}
          </p>
          <div className="flex justify-center">
            <Button
              className="bg-gradient-to-r from-azul-gradient to-morado-gradient text-white font-semibold hover:brightness-110 rounded-xl w-full py-1.5 transition-all transform hover:scale-105"
              onClick={closeSuccessModal}
            >
              {t('config_dash_page.modals.accept_button')}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};