import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAuth, applyActionCode, checkActionCode } from "firebase/auth";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export const ActionHandlerPage = () => {
  const { t } = useTranslation();
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
        setProcessing(false);
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      try {
        if (mode === "resetPassword") {
          navigate(`/change-password?oobCode=${oobCode}`);
        } else if (mode === "verifyEmail") {
          try {
            await checkActionCode(auth, oobCode);
          } catch (codeError) {
            console.error("Error al validar el código de acción:", codeError);
            if (codeError.code === "auth/invalid-action-code") {
              setError("El código de acción no es válido o ha expirado.");
            } else {
              setError("Hubo un problema al validar el código de acción.");
            }
            setProcessing(false);
            setTimeout(() => navigate("/login"), 3000);
            return;
          }
          await applyActionCode(auth, oobCode);
          setTimeout(() => {
            setProcessing(false);
            setTimeout(() => navigate("/dashboard?verified=true"), 2000);
          }, 1000);
        } else {
          setError("Acción no reconocida.");
          setProcessing(false);
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (err) {
        console.error("Error al procesar la solicitud:", err);
        if (err.code === "auth/invalid-action-code") {
          setError("El código de acción no es válido o ha expirado.");
        } else {
          setError("Error al procesar la solicitud. Inténtalo de nuevo.");
        }
        setProcessing(false);
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleAction();
  }, [searchParams, navigate, auth]); 

  return (
    <div className="h-screen pt-16 bg-fondologin text-gray-100 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md space-y-8 p-6 sm:p-12">
        {processing && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient p-0.5">
              <div className="w-full h-full rounded-full bg-fondologin flex items-center justify-center">
                <svg
                  className="animate-spin h-10 w-10 text-azul-gradient"
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
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-azul-gradient to-morado-gradient mb-2">
              {t("auth.action_handler.processing")}
            </h1>
            <p className="text-base">{t("auth.action_handler.wait")}</p>
          </div>
        )}

        {!processing && !error && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-green-600 p-0.5">
              <div className="w-full h-full rounded-full bg-fondologin flex items-center justify-center">
                <CheckCircle
                  className="h-10 w-10 text-green-500"
                  weight="fill"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-600 mb-2">
              {t("auth.action_handler.success_title")}
            </h1>
            <p className="text-base mb-4">
              {t("auth.action_handler.success_subtitle")}
            </p>
            <p className="text-sm text-gray-400">
              {t("auth.action_handler.redirecting_dashboard")}
            </p>
          </div>
        )}

        {!processing && error && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-red-600 p-0.5">
              <div className="w-full h-full rounded-full bg-fondologin flex items-center justify-center">
                <XCircle className="h-10 w-10 text-red-500" weight="fill" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600 mb-2">
                {t("auth.action_handler.error_title")}
              </h1>
              <p className="text-base mb-4">{error}</p>
              <p className="text-sm text-gray-400">
                {t("auth.action_handler.redirecting_login")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};