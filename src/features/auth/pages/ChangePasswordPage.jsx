import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { Eye, EyeSlash, Lock, Question } from "@phosphor-icons/react";
import { GeometricParticles } from "../../../components/ui/GeometricParticles";
import { usePasswordValidation } from "../hooks/usePasswordValidation";
import { RequirementsModal } from "../../../components/modals/RequirementsModal";
import { useTranslation } from "react-i18next";

export const ChangePasswordPage = () => {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRequirementsModal, setShowRequirementsModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const oobCode = queryParams.get("oobCode");

  const {
    allRequirementsMet: allPasswordRequirementsMet,
    strengthScore,
    strengthLabel,
  } = usePasswordValidation(newPassword);
  const passwordMatch = newPassword === confirmPassword;
  const isFormValid = allPasswordRequirementsMet && passwordMatch;

  useEffect(() => {
    if (!oobCode) {
      setError(
        "No se encontró un código de restablecimiento válido en la URL."
      );
    }
  }, [oobCode]);

  const handleResetPassword = async () => {
    if (!oobCode) {
      setError("No se encontró un código de restablecimiento válido.");
      return;
    }
    if (!isFormValid) {
      setError(
        "La contraseña no cumple con todos los requisitos o no coincide."
      );
      return;
    }
    setIsLoading(true);
    try {
      await verifyPasswordResetCode(auth, oobCode);
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
      setError(null);
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      let errorMessage =
        "Error al restablecer la contraseña. Por favor, inténtalo de nuevo.";
      if (error.code === "auth/invalid-action-code") {
        errorMessage =
          "El enlace de restablecimiento ha expirado o no es válido.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "La contraseña es demasiado débil. Debe tener al menos 6 caracteres.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen pt-16 bg-white dark:bg-fondologin text-gray-800 dark:text-gray-100 flex items-center justify-center overflow-hidden">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden h-full">
        <div className="absolute inset-0">
          <GeometricParticles />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-azul-gradient/5 via-transparent to-morado-gradient/5 pointer-events-none"></div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 h-full">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-azul-gradient to-morado-gradient mb-2">
              {t("auth.change_password.title")}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 text-center">
              {t("auth.change_password.subtitle")}
            </p>
          </div>
          {success && (
            <div className="p-4 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-sm text-center">
              ¡Contraseña restablecida con éxito! Serás redirigido al inicio de
              sesión en breve.
            </div>
          )}
          {error && (
            <div className="p-4 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                className={`appearance-none rounded-md block w-full px-3 py-3 pl-10 pr-20 border bg-gray-50 dark:bg-principal placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-morado-gradient focus:border-morado-gradient sm:text-sm transition-colors border-gray-300 dark:border-linea`}
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.change_password.new_password_placeholder")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2 z-20">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                  onClick={() => setShowRequirementsModal(true)}
                  aria-label="Mostrar requisitos de contraseña"
                >
                  <Question className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeSlash className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                className={`appearance-none rounded-md block w-full px-3 py-3 pl-10 pr-10 border bg-gray-50 dark:bg-principal placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-morado-gradient focus:border-morado-gradient sm:text-sm transition-colors ${
                  confirmPassword && !passwordMatch
                    ? "border-red-500"
                    : "border-gray-300 dark:border-linea"
                }`}
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.change_password.confirm_password_placeholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none z-20"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <EyeSlash className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {newPassword.length > 0 && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t("auth.register.password_strength")}</span>
                  <span className="text-xs font-medium text-gray-800 dark:text-white">{strengthLabel}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 dark:bg-secondary/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strengthScore <= 1
                        ? "w-1/5 bg-red-500"
                        : strengthScore === 2
                          ? "w-2/5 bg-amber-500"
                          : strengthScore === 3
                            ? "w-3/5 bg-amber-500"
                            : strengthScore === 4
                              ? "w-4/5 bg-green-500"
                              : "w-full bg-green-500"
                    }`}
                  ></div>
                </div>
              </div>
            )}
            <button
              type="button"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-gradient-to-r from-azul-gradient to-morado-gradient hover:from-azul-gradient/90 hover:to-morado-gradient/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-fondologin disabled:opacity-60 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={handleResetPassword}
              disabled={isLoading || !isFormValid || !oobCode}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
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
                  {t("auth.change_password.reset_loading_button")}
                </span>
              ) : (
                t("auth.change_password.reset_button")
              )}
            </button>
          </form>
        </div>
      </div>

      <RequirementsModal
        showModal={showRequirementsModal}
        closeModal={() => setShowRequirementsModal(false)}
        password={newPassword}
      />
    </div>
  );
};