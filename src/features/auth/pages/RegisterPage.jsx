import { useState } from "react";
import { auth, googleProvider } from "../../../config/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  updateProfile,
  getAdditionalUserInfo,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserCircle,
  Envelope,
  Lock,
  Eye,
  EyeSlash,
  Question,
} from "@phosphor-icons/react";
import { ErrorModal } from "../../../components/modals/ErrorModal";
import { RequirementsModal } from "../../../components/modals/RequirementsModal";
import { GeometricParticles } from "../../../components/ui/GeometricParticles";
import { usePasswordValidation } from "../hooks/usePasswordValidation";
import { useTranslation } from "react-i18next";
import { registerUserInBackend } from '../services/userApi';

export const RegisterPage = ({ BASE_URL }) => {
  const { t } = useTranslation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRequirementsModal, setShowRequirementsModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    allRequirementsMet: allPasswordRequirementsMet,
    strengthScore,
    strengthLabel,
  } = usePasswordValidation(password);
  const isNameValid = name.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const clearError = () => {
    setErrorMessages([]);
    setShowErrorModal(false);
  };

  const sendUserDataToBackend = async (
    user,
    nameFromInput = "",
    photoUrlFromInput = ""
  ) => {
    if (!user) {
      console.error("Usuario no válido para enviar al backend");
      throw new Error("Usuario no válido");
    }
    const token = await user.getIdToken();
    try {
      await registerUserInBackend(
        token,
        nameFromInput || user.displayName || "Usuario",
        photoUrlFromInput || user.photoURL || "/usuario.webp"
      );

      console.log(
        "Datos del usuario enviados/actualizados en el backend para UID:",
        user.uid
      );
    } catch (error) {
      console.error(
        "Error al enviar datos del usuario al backend:",
        error.response?.data || error.message
      );
      throw new Error("Error al registrar/actualizar datos en el backend.");
    }
  };

  const handleRegister = async () => {
    clearError();
    const currentErrors = [];
    if (!isNameValid) currentErrors.push("El nombre es obligatorio.");
    if (!isEmailValid)
      currentErrors.push("Ingresa un correo electrónico válido.");
    if (!allPasswordRequirementsMet)
      currentErrors.push(
        "La contraseña debe cumplir con todos los requisitos mínimos."
      );
    if (currentErrors.length > 0) {
      setErrorMessages(currentErrors);
      setShowErrorModal(true);
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Usuario creado en Firebase Auth:", user.uid);
      await updateProfile(user, { displayName: name });
      console.log("Perfil de Firebase Auth actualizado con nombre.");
      await sendUserDataToBackend(user, name);
      console.log("Datos enviados al backend para usuario de email.");
      await sendEmailVerification(user);
      console.log("Correo de verificación enviado.");
      navigate("/verify-email");
    } catch (error) {
      console.error("Error durante el registro con email:", error);
      let specificErrorMessage =
        "Error al registrar el usuario. Por favor, inténtalo de nuevo.";
      if (error.code === "auth/email-already-in-use") {
        specificErrorMessage =
          "Este correo electrónico ya está en uso. Intenta con otro o inicia sesión.";
      } else if (error.message.includes("backend")) {
        specificErrorMessage = error.message;
      }
      setErrorMessages([specificErrorMessage]);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    clearError();
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const additionalInfo = getAdditionalUserInfo(result);
      console.log("Firebase Google Auth Success. User UID:", user.uid);
      console.log("Es nuevo usuario?:", additionalInfo.isNewUser);
      await sendUserDataToBackend(user);
      console.log("Navegando al dashboard...");
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Error durante Google Sign Up o registro en backend:",
        error
      );
      let errorMessage = "Hubo un error durante el registro con Google.";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage =
          "El proceso de inicio de sesión con Google fue cancelado.";
      } else if (error.message.includes("backend")) {
        errorMessage =
          "No se pudieron guardar tus datos en nuestro sistema. Por favor, intenta de nuevo.";
      }
      setErrorMessages([errorMessage]);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen pt-16 bg-white text-gray-800 dark:bg-fondologin dark:text-gray-100 flex selection:bg-morado-gradient selection:text-white overflow-hidden">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden h-full">
        <div className="absolute inset-0">
          <GeometricParticles />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-azul-gradient/5 via-transparent to-morado-gradient/5 pointer-events-none"></div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 h-full">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-center text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-azul-gradient to-morado-gradient py-1">
              {t("auth.register.title")}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {t("auth.register.subtitle")}
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <UserCircle
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-md block w-full px-3 py-3 pl-10 border border-gray-300 bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-morado-gradient focus:border-morado-gradient sm:text-sm transition-colors dark:border-linea dark:bg-principal dark:text-white"
                placeholder={t("auth.register.name_placeholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Envelope
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md block w-full px-3 py-3 pl-10 border border-gray-300 bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-morado-gradient focus:border-morado-gradient sm:text-sm transition-colors dark:border-linea dark:bg-principal dark:text-white"
                placeholder={t("auth.login.email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none rounded-md block w-full px-3 py-3 pl-10 pr-20 border border-gray-300 bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-morado-gradient focus:border-morado-gradient sm:text-sm transition-colors dark:border-linea dark:bg-principal dark:text-white"
                placeholder={t("auth.login.password_placeholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {password.length > 0 && (
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
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-gradient-to-r from-azul-gradient to-morado-gradient hover:from-azul-gradient/90 hover:to-morado-gradient/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-fondologin disabled:opacity-60 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
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
                    {t("auth.register.register_loading_button")}
                  </span>
                ) : (
                  t("auth.register.register_button")
                )}
              </button>
            </div>
          </form>

          <div className="relative py-2">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300 dark:border-linea/70" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-fondologin text-gray-500 uppercase">
                {t("auth.login.or_separator")}
              </span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full group relative overflow-hidden inline-flex items-center justify-center py-3 px-4 rounded-xl shadow-lg bg-gray-50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-white/10 dark:hover:border-white/20 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-fondologin focus:ring-gray-300 dark:focus:ring-white/20 disabled:opacity-60 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out dark:via-white/5"></div>
              <div className="relative z-10 flex items-center">
                <div className="w-5 h-5 mr-2 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <span className="text-gray-800/90 group-hover:text-gray-900 dark:text-white/90 dark:group-hover:text-white transition-colors duration-200">
                  {t("auth.register.google_button")}
                </span>
              </div>
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {t("auth.register.has_account")}{" "}
            <button
              type="button"
              onClick={handleGoToLogin}
              className="font-bold text-azul-gradient hover:text-morado-gradient transition-colors"
            >
              {t("auth.register.login_link")}
            </button>
          </p>
        </div>
      </div>

      <RequirementsModal
        showModal={showRequirementsModal}
        closeModal={() => setShowRequirementsModal(false)}
        password={password}
      />
      <ErrorModal
        showModal={showErrorModal}
        closeModal={clearError}
        errorMessage={
          Array.isArray(errorMessages) && errorMessages.length > 0
            ? errorMessages.map((msg, index) => <p key={index}>{msg}</p>)
            : "Ocurrió un error desconocido."
        }
      />
    </div>
  );
};