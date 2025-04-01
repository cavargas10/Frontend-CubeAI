import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Envelope, ArrowLeft } from "@phosphor-icons/react";
import {
  getAuth,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import GeometricParticles from "../Ui/GeometryParticles";

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const auth = getAuth();

  // Efecto para obtener el usuario actual y su correo electrónico
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  // Verificar si hay un error en la URL
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "invalid-code") {
      setErrorMessage(
        "El enlace de verificación ha expirado o ya ha sido utilizado. Por favor, solicita un nuevo correo de verificación."
      );
    } else if (error) {
      setErrorMessage(
        "Ocurrió un error al verificar tu correo electrónico. Por favor, intenta nuevamente."
      );
    }
  }, [searchParams]);

  // Efecto para manejar el contador de reenvío
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleResendEmail = async () => {
    if (!email || countdown > 0) return;

    setIsResending(true);
    setErrorMessage("");

    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user, {
          url: window.location.origin + "/action-handler",
          handleCodeInApp: true,
        });
        setResendSuccess(true);
        setCountdown(60);
        setTimeout(() => setResendSuccess(false), 5000);
      }
    } catch (error) {
      setErrorMessage(
        "Hubo un error al reenviar el correo. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsResending(false);
    }
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
            Verifica tu correo electrónico
          </h1>

          <p className="text-gray-400 text-sm lg:text-base mb-5">
            Hemos enviado un enlace de verificación a tu correo electrónico
          </p>

          <div className="py-4 px-3 border border-[#243166] rounded-lg mb-5 bg-fondologin">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-principal flex items-center justify-center">
                <Envelope
                  className="h-5 w-5 lg:h-6 lg:w-6 text-[#4a7dfc]"
                  weight="bold"
                />
              </div>
            </div>

            <p className="text-gray-400 text-xs lg:text-sm">
              Hemos enviado un correo a:
            </p>
            <p className="font-medium text-white text-sm lg:text-base mb-2">
              {email}
            </p>

            <p className="text-gray-400 text-xs lg:text-sm">
              Por favor, revisa tu bandeja de entrada y haz clic en el enlace de
              verificación para activar tu cuenta.
            </p>
          </div>

          {/* Mensaje de error si existe */}
          {errorMessage && (
            <div className="p-3 mb-5 rounded-lg bg-red-900 border border-red-800 text-red-300 text-xs lg:text-sm flex items-center space-x-2">
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Mensaje de éxito con tonos verdes */}
          {resendSuccess && (
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
              <span>Correo de verificación reenviado con éxito</span>
            </div>
          )}

          {/* Botón para reenviar correo */}
          <button
            className="bg-transparent border border-[#243166] hover:bg-[#18204a] text-white w-full py-2 rounded-lg transition-colors mb-3 text-sm lg:text-base"
            onClick={handleResendEmail}
            disabled={isResending || countdown > 0}
          >
            {isResending ? (
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
                Reenviando...
              </span>
            ) : countdown > 0 ? (
              `Reenviar correo (${countdown}s)`
            ) : (
              "Reenviar correo de verificación"
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
    </div>
  );
};
