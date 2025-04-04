import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  updatePassword,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { auth } from "../../../config/firebase"; 
import { Eye, EyeSlash, Lock } from "@phosphor-icons/react";

export const ChangePasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Obtiene el código oobCode de los parámetros de la URL
  const queryParams = new URLSearchParams(location.search);
  const oobCode = queryParams.get("oobCode");

  // Validación de formulario
  const validations = {
    passwordMatch: newPassword === confirmPassword,
    passwordLength: newPassword.length >= 6,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  const allPasswordRequirementsMet = Object.values(validations).every(Boolean);

  // Verificar que tenemos un oobCode válido
  useEffect(() => {
    if (!oobCode) {
      setError(
        "No se encontró un código de restablecimiento válido en la URL."
      );
    }
  }, [oobCode]);

  // Manejador para restablecer la contraseña
  const handleResetPassword = async () => {
    if (!oobCode) {
      setError("No se encontró un código de restablecimiento válido.");
      return;
    }

    if (!allPasswordRequirementsMet) {
      setError("La contraseña no cumple con todos los requisitos mínimos.");
      return;
    }

    setIsLoading(true);
    try {
      // Verifica el código de restablecimiento
      await verifyPasswordResetCode(auth, oobCode);

      // Confirma el restablecimiento de la contraseña
      await confirmPasswordReset(auth, oobCode, newPassword);

      setSuccess(true);
      setError(null);
      setTimeout(() => navigate("/login"), 3000); // Redirige al inicio de sesión después de 3 segundos
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {/* Contenedor principal */}
      <div className="w-full max-w-md p-8 bg-principal rounded-lg shadow-lg border border-[#243166]">
        <h1 className="text-2xl font-medium mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-azul-gradient to-morado-gradient">
          Restablecer Contraseña
        </h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Ingresa una nueva contraseña segura para tu cuenta.
        </p>

        {/* Mensaje de éxito */}
        {success && (
          <div className="bg-green-500/20 text-green-500 p-4 rounded-lg mb-4 text-center">
            ¡Contraseña restablecida con éxito! Serás redirigido al inicio de
            sesión en breve.
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-500/20 text-red-500 p-4 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Campo de nueva contraseña */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-10 text-white bg-fondologin leading-tight focus:outline-none focus:border-[#4a7dfc] ${
                newPassword && !validations.passwordLength
                  ? "border-red-500"
                  : ""
              }`}
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <EyeSlash className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Campo de confirmar contraseña */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-10 text-white bg-fondologin leading-tight focus:outline-none focus:border-[#4a7dfc] ${
                confirmPassword && !validations.passwordMatch
                  ? "border-red-500"
                  : ""
              }`}
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <EyeSlash className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Indicador de fortaleza de contraseña */}
          {newPassword.length > 0 && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Fortaleza:</span>
                <span className="text-xs font-medium">
                  {Object.values(validations).filter(Boolean).length === 0 &&
                    "Muy débil"}
                  {Object.values(validations).filter(Boolean).length === 1 &&
                    "Débil"}
                  {Object.values(validations).filter(Boolean).length === 2 &&
                    "Regular"}
                  {Object.values(validations).filter(Boolean).length === 3 &&
                    "Buena"}
                  {Object.values(validations).filter(Boolean).length === 4 &&
                    "Fuerte"}
                  {Object.values(validations).filter(Boolean).length === 5 &&
                    "Excelente"}
                </span>
              </div>
              <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    Object.values(validations).filter(Boolean).length === 0
                      ? "w-0 bg-red-500"
                      : Object.values(validations).filter(Boolean).length === 1
                        ? "w-1/5 bg-red-500"
                        : Object.values(validations).filter(Boolean).length ===
                            2
                          ? "w-2/5 bg-amber-500"
                          : Object.values(validations).filter(Boolean)
                                .length === 3
                            ? "w-3/5 bg-amber-500"
                            : Object.values(validations).filter(Boolean)
                                  .length === 4
                              ? "w-4/5 bg-green-500"
                              : "w-full bg-green-500"
                  }`}
                ></div>
              </div>
            </div>
          )}

          {/* Botón de restablecer contraseña */}
          <button
            type="button"
            className="bg-[#243166] hover:bg-[#1e2a5f] text-white w-full py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleResetPassword}
            disabled={isLoading || !allPasswordRequirementsMet || !oobCode}
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
                Restableciendo...
              </span>
            ) : (
              "Restablecer Contraseña"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};