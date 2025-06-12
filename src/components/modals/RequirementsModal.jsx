import { Modal, Button } from "flowbite-react";
import { XCircle, CheckCircle, ShieldCheck } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

const RequirementItem = ({ isMet, text }) => {
  const Icon = isMet ? CheckCircle : XCircle;
  const colorClass = isMet ? "text-green-400" : "text-red-400";
  const textClass = isMet ? "text-gray-300" : "text-gray-200 font-semibold";

  return (
    <li className="flex items-center transition-all duration-300">
      <Icon
        className={`flex-shrink-0 mr-3 transition-colors duration-300 ${colorClass}`}
        size={20}
        weight="fill"
      />
      <span className={`text-sm ${textClass}`}>{text}</span>
    </li>
  );
};

export const RequirementsModal = ({
  showModal,
  closeModal,
  password,
}) => {
  const { t } = useTranslation();

  const validations = {
    length: /.{6,}/.test(password),
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  return (
    <Modal
      show={showModal}
      size="md"
      popup={true}
      onClose={closeModal}
      theme={{
        root: {
          base: "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm",
        },
        content: {
          base: "relative w-full max-w-sm m-auto", 
          inner: "relative rounded-none bg-transparent",
        },
      }}
    >
      <Modal.Body className="p-0 bg-transparent">
        <div className="text-center bg-principal rounded-2xl py-6 px-6 border-2 border-linea/50 shadow-2xl shadow-morado-gradient/10">
          <div className="flex flex-col items-center mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-azul-gradient to-morado-gradient flex items-center justify-center mb-3 shadow-lg">
              <ShieldCheck size={32} color="#fff" weight="bold" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {t("auth.modals.requirements_title")}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {t("auth.modals.requirements_subtitle")}
            </p>
          </div>

          <ul className="space-y-3 text-left mb-6">
            <RequirementItem
              isMet={validations.length}
              text={t("auth.modals.req_length")}
            />
            <RequirementItem
              isMet={validations.uppercase}
              text={t("auth.modals.req_uppercase")}
            />
            <RequirementItem
              isMet={validations.lowercase}
              text={t("auth.modals.req_lowercase")}
            />
            <RequirementItem
              isMet={validations.number}
              text={t("auth.modals.req_number")}
            />
            <RequirementItem
              isMet={validations.special}
              text={t("auth.modals.req_special")}
            />
          </ul>

          <div className="flex justify-center">
            <Button
              className="bg-gradient-to-r from-azul-gradient to-morado-gradient text-white font-semibold hover:brightness-110 rounded-xl w-full py-1.5 transition-all transform hover:scale-105"
              onClick={closeModal}
            >
              {t("auth.modals.understood_button")}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};