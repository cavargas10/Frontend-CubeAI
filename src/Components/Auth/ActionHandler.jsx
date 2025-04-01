import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAuth, applyActionCode } from "firebase/auth";

export const ActionHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = getAuth();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAction = async () => {
      const mode = searchParams.get("mode");
      const oobCode = searchParams.get("oobCode");

      if (!oobCode) {
        setError("No se encontró un código de acción válido en la URL.");
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      try {
        if (mode === "resetPassword") {
          // Para reseteo de contraseña, sí hacemos redirección
          navigate(`/change-password?oobCode=${oobCode}`);
        } else if (mode === "verifyEmail") {
          // Verifica que sea el usuario actual
          if (!auth.currentUser) {
            await new Promise((resolve) => {
              const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                  unsubscribe();
                  resolve();
                }
              });
              // Timeout para evitar espera infinita
              setTimeout(() => {
                unsubscribe();
                resolve();
              }, 5000);
            });
          }

          // Para verificación de correo, aplicamos el código directamente aquí
          await applyActionCode(auth, oobCode);

          // Esperar un momento antes de redirigir
          setTimeout(() => {
            setProcessing(false);
            // Redirigir al dashboard o a una página de éxito después de un tiempo
            setTimeout(() => navigate("/dashboard?verified=true"), 2000);
          }, 1000);
        } else {
          setError("Acción no reconocida.");
          setTimeout(() => navigate("/login"), 3000);
        }
      } finally {
        setProcessing(false);
      }
    };

    handleAction();
  }, [searchParams, navigate, auth]);

  // Renderizar UI según el estado
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-principal text-white p-4">
      {processing && (
        <>
          <h2 className="text-xl mb-4">Procesando tu solicitud...</h2>
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </>
      )}

      {!processing && !error && (
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
          <p className="text-gray-400 text-sm text-center">
            Redirigiendo al dashboard...
          </p>
        </>
      )}
    </div>
  );
};