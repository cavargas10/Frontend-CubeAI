import { useState, useEffect } from "react";
import { getAuth, applyActionCode } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

export const CorrectEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const oobCode = searchParams.get("oobCode");

      if (!oobCode) {
        setStatus("error");
        setErrorMessage("No se encontró un código de acción válido en la URL.");
        return;
      }

      try {
        // Intentar aplicar el código de verificación
        await applyActionCode(auth, oobCode);

        setStatus("success");

        // Esperar 3 segundos y luego redirigir
        setTimeout(() => {
          navigate("/dashboard"); // O la ruta que prefieras después de verificar
        }, 3000);
      } catch (error) {
        setStatus("error");

        // Manejar el error específico
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

  // Renderizar UI según el estado
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-principal text-white p-4">
      {status === "loading" && (
        <>
          <h1 className="text-2xl font-medium mb-4 text-center">
            Verificando tu correo electrónico...
          </h1>
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
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
          <h1 className="text-2xl font-medium mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-700">
            ¡Correo verificado con éxito!
          </h1>
          <p className="text-gray-400 text-sm text-center mb-6">
            Tu cuenta ha sido activada correctamente.
          </p>
          <p className="text-gray-400 text-xs text-center">
            Redirigiendo al inicio...
          </p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4">
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
          <h1 className="text-2xl font-medium mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
            Error de verificación
          </h1>
          <p className="text-gray-400 text-sm text-center mb-6">
            {errorMessage}
          </p>
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors"
            onClick={() => navigate("/verify-email")}
          >
            Solicitar nuevo enlace
          </button>
        </>
      )}
    </div>
  );
};
