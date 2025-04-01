import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Envelope, ArrowLeft } from "@phosphor-icons/react";
import { auth } from "../../Config/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import GeometricParticles from "../Ui/GeometryParticles";
import { ErrorModal } from "../Modals/ErrorModal";

export const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  };

  // Validación del correo electrónico
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (!canResend && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0) {
      setCanResend(true);
      setTimer(60);
    }
  }, [timer, canResend]);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const handleResetPassword = async () => {
    if (!isValidEmail) {
      setError("Por favor, ingresa un correo electrónico válido.");
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);
    setCanResend(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Se ha enviado un enlace para restablecer la contraseña a tu correo electrónico."
      );
    } catch (error) {
      setError(
        error.message ||
          "Hubo un error al enviar el correo. Por favor, inténtalo de nuevo."
      );
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setError(null);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen justify-center gap-8 items-center px-4 pt-16">
      {/* Contenedor principal */}
      <div className="w-full lg:w-2/5 rounded-lg border border-[#243166] bg-principal p-4 lg:px-8 lg:py-6">
        <div className="text-center">
          {/* Título con gradientes */}
          <h1
            className="text-xl lg:text-3xl font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r from-azul-gradient to-morado-gradient py-2"
            style={{ lineHeight: "1.2" }}
          >
            Restablecer contraseña
          </h1>

          <p className="text-gray-400 text-sm lg:text-base mb-5">
            Ingresa tu correo electrónico para recibir un enlace de
            restablecimiento.
          </p>

          {/* Bloque de información de correo electrónico */}
          <div className="py-4 px-3 border border-[#243166] rounded-lg mb-5 bg-fondologin">
            {/* Campo de correo electrónico */}
            <div className="relative my-2">
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-white bg-principal leading-tight focus:outline-none ${
                  email && !isValidEmail
                    ? "border-red-500"
                    : "focus:border-[#4a7dfc]"
                }`}
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Envelope className="h-5 w-5 text-[#4a7dfc]" weight="bold" />
              </div>
            </div>
            {/* Mensaje de error para el correo electrónico */}
            {email && !isValidEmail && (
              <p className="text-red-500 text-xs mt-1">
                Ingresa un correo electrónico válido.
              </p>
            )}
          </div>

          {/* Mensaje de éxito con tonos verdes */}
          {message && (
            <div className="p-3 mb-5 rounded-lg bg-green-900 border border-green-800 text-green-400 text-xs lg:text-sm flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{message}</span>
            </div>
          )}

          {/* Botón de envío */}
          <button
            className={`${
              isValidEmail
                ? "bg-[#18204a] border-transparent text-white"
                : "bg-transparent border border-[#243166] text-[#4a7dfc]"
            } w-full py-2 rounded-lg transition-colors mb-3 text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleResetPassword}
            disabled={isLoading || !canResend || !isValidEmail}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin mr-1 h-3 w-3 lg:h-4 lg:w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enviando...
              </span>
            ) : !canResend ? (
              `Reenviar enlace (${timer}s)`
            ) : (
              "Enviar enlace de recuperación"
            )}
          </button>

          {/* Botón para volver al inicio de sesión */}
          <button
            className="text-[#4a7dfc] hover:text-[#6a95ff] transition-colors flex items-center justify-center mx-auto text-sm lg:text-base"
            onClick={handleGoToLogin}
          >
            <ArrowLeft className="mr-1 h-3 w-3 lg:h-4 lg:w-4" weight="bold" />
            Volver a inicio de sesión
          </button>
        </div>
      </div>

      {/* Componente GeometricParticles */}
      <div className="hidden lg:block lg:w-2/5 lg:h-[400px] relative">
        <div className="absolute inset-0">
          <GeometricParticles />
        </div>
      </div>

      {/* Modal de error */}
      <ErrorModal
        showModal={showErrorModal}
        closeModal={closeErrorModal}
        errorMessage={
          error || "Error desconocido. Por favor, inténtalo de nuevo."
        }
      />
    </div>
  );
};
