import { useState, useEffect } from "react";
import { getAuth, applyActionCode } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

export const CorrectEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const oobCode = searchParams.get("oobCode");

      if (!oobCode) {
        setStatus("error");
        setErrorMessage(
          "No se encontró un código de acción válido en la URL."
        );
        return;
      }

      try {
        await applyActionCode(auth, oobCode);
        setStatus("success");
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } catch (error) {
        setStatus("error");

        if (error.code === "auth/invalid-action-code") {
          setErrorMessage(
            "El enlace de verificación ha expirado o ya ha sido utilizado. Por favor, solicita un nuevo correo de verificación."
          );
        } else if (error.code === "auth/user-disabled") {
          setErrorMessage("La cuenta del usuario ha sido deshabilitada.");
        } else {
          setErrorMessage(
            "Ocurrió un error al verificar tu correo electrónico."
          );
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate, auth]);

  return (
    <div className="h-screen pt-16 bg-fondologin text-gray-100 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md space-y-8 p-6 sm:p-12">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-azul-gradient to-morado-gradient py-1 mb-4">
              Verificando tu correo electrónico...
            </h1>
            <div className="w-10 h-10 border-4 border-t-transparent border-linea rounded-full animate-spin"></div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
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
            </div>
            <h1 className="text-2xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-700 py-1">
              ¡Correo verificado con éxito!
            </h1>
            <p className="text-gray-400 text-sm text-center mt-2">
              Tu cuenta ha sido activada correctamente.
            </p>
            <p className="text-gray-400 text-xs text-center mt-1">
              Redirigiendo al inicio...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
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
            </div>
            <h1 className="text-2xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 py-1">
              Error de verificación
            </h1>
            <p className="text-gray-400 text-sm text-center mt-2">
              {errorMessage}
            </p>
            <button
              className="mt-4 w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-gradient-to-r from-azul-gradient to-morado-gradient hover:from-azul-gradient/90 hover:to-morado-gradient/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-fondologin focus:ring-morado-gradient disabled:opacity-60 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => navigate("/verify-email")}
            >
              Solicitar nuevo enlace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};