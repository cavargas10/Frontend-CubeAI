import { Modal, Button } from "flowbite-react";
import { WarningCircle } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export const DeleteConfirmationModal = ({
  showModal,
  closeModal,
  onConfirm,
  message,
}) => {
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
              <WarningCircle size={32} color="#fff" weight="bold" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {t('config_dash_page.danger_zone.delete_modal_title')}
            </h3>
          </div>
          <p className="mb-6 text-sm text-gray-300">
            {message}
            <br />
            <span className="font-semibold text-red-400 mt-2 block">
              {t('config_dash_page.danger_zone.delete_modal_irreversible')}
            </span>
          </p>
          <div className="flex justify-center gap-4">
            <Button
              className="flex-1 bg-red-600 text-white font-semibold hover:bg-red-700 rounded-xl transition-all"
              onClick={onConfirm}
            >
              {t('config_dash_page.danger_zone.delete_modal_confirm')}
            </Button>
            <Button
              className="flex-1 bg-linea/50 text-white hover:bg-linea/80 font-semibold rounded-xl transition-all"
              onClick={closeModal}
            >
              {t('config_dash_page.danger_zone.delete_modal_cancel')}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};