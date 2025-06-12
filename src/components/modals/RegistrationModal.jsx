import { Modal, Button } from "flowbite-react";
import { UserPlus, Sparkle } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const RegistrationModal = ({ showModal, closeModal, email }) => {
  const { t } = useTranslation();
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
      theme={{
        root: { base: "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" },
        content: { base: "relative w-full max-w-sm m-auto", inner: "relative rounded-none bg-transparent" },
      }}
    >
      <Modal.Body className="p-0 bg-transparent">
        <div className="text-center bg-principal rounded-2xl py-6 px-6 border-2 border-linea/50 shadow-2xl shadow-morado-gradient/10">
          <div className="relative flex flex-col items-center mb-5">
            <Sparkle size={20} className="text-azul-gradient absolute top-0 left-10 opacity-70 animate-pulse" />
            <Sparkle size={16} className="text-morado-gradient absolute top-8 right-8 opacity-60 animate-pulse [animation-delay:0.5s]" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-azul-gradient to-morado-gradient flex items-center justify-center mb-3 shadow-lg">
              <UserPlus size={32} color="#fff" weight="bold" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {t('auth.modals.registration_required_title')}
            </h3>
          </div>
          <p className="mb-6 text-sm text-gray-300">
            {t('auth.modals.registration_required_text')}
          </p>
          <div className="flex flex-col gap-3">
            <Button
              className="bg-gradient-to-r from-azul-gradient to-morado-gradient text-white font-semibold hover:brightness-110 rounded-xl w-full py-1.5 transition-all transform hover:scale-105"
              onClick={handleRegister}
            >
              {t('auth.modals.complete_registration_button')}
            </Button>
            <Button
              className="bg-linea/50 text-white hover:bg-linea/80 font-semibold rounded-xl w-full py-1.5 transition-all"
              onClick={closeModal}
            >
              {t('global.cancel')}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};