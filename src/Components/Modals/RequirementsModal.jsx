import React from "react";
import { Modal, Button } from "flowbite-react";
import { XCircle, CheckCircle } from "@phosphor-icons/react";

export const RequirementsModal = ({
  showModal,
  closeModal,
  email,
  password,
  name,
  emailRegex,
  passwordLengthRegex,
  passwordUppercaseRegex,
  passwordLowercaseRegex,
  passwordNumberRegex,
  passwordSpecialCharRegex,
}) => {
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
              Requisitos de Registro
            </h3>
            <ul className="mb-5 text-left text-gray-50 dark:text-gray-400">
              <li className="flex items-center">
                {name ? (
                  <CheckCircle className="text-green-500 mr-2" />
                ) : (
                  <XCircle className="text-red-500 mr-2" />
                )}
                Nombre (requerido)
              </li>
              <li className="flex items-center">
                {emailRegex.test(email) ? (
                  <CheckCircle className="text-green-500 mr-2" />
                ) : (
                  <XCircle className="text-red-500 mr-2" />
                )}
                Email válido (requerido)
              </li>
              <li className="flex items-center">
                {passwordLengthRegex.test(password) ? (
                  <CheckCircle className="text-green-500 mr-2" />
                ) : (
                  <XCircle className="text-red-500 mr-2" />
                )}
                Contraseña de al menos 6 caracteres
              </li>
              <li className="flex items-center">
                {passwordUppercaseRegex.test(password) ? (
                  <CheckCircle className="text-green-500 mr-2" />
                ) : (
                  <XCircle className="text-red-500 mr-2" />
                )}
                Contraseña con al menos una mayúscula
              </li>
              <li className="flex items-center">
                {passwordLowercaseRegex.test(password) ? (
                  <CheckCircle className="text-green-500 mr-2" />
                ) : (
                  <XCircle className="text-red-500 mr-2" />
                )}
                Contraseña con al menos una minúscula
              </li>
              <li className="flex items-center">
                {passwordNumberRegex.test(password) ? (
                  <CheckCircle className="text-green-500 mr-2" />
                ) : (
                  <XCircle className="text-red-500 mr-2" />
                )}
                Contraseña con al menos un número
              </li>
              <li className="flex items-center">
                {passwordSpecialCharRegex.test(password) ? (
                  <CheckCircle className="text-green-500 mr-2" />
                ) : (
                  <XCircle className="text-red-500 mr-2" />
                )}
                Contraseña con al menos un carácter especial
              </li>
            </ul>
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
