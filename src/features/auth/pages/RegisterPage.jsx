import React, { useState } from "react";
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
  GoogleChromeLogo,
} from "@phosphor-icons/react";
import { ErrorModal } from "../../../components/modals/ErrorModal";
import { GeometricParticles } from "../../../components/ui/GeometricParticles";

export const RegisterPage = ({ BASE_URL }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]); // Estado para errores (array)
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Para indicar carga en botones/form
  const navigate = useNavigate();

  const validations = {
    name: name.trim().length > 0,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    password: {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    },
  };
  const allPasswordRequirementsMet = Object.values(validations.password).every(
    Boolean
  );

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
      await axios.post(
        `${BASE_URL}/register_user`,
        {
          name: nameFromInput || user.displayName || "Usuario",
          profile_picture:
            photoUrlFromInput || user.photoURL || "/usuario.webp",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
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
    if (!validations.name) currentErrors.push("El nombre es obligatorio.");
    if (!validations.email)
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

      await sendUserDataToBackend(user, name); // Pasa el nombre del input
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
    <div className="flex flex-col lg:flex-row h-screen justify-center gap-8 items-center px-4 pt-16">
      <div className="w-full lg:w-2/5 rounded-lg border border-[#243166] bg-principal p-4 lg:px-8 lg:py-6">
        <div className="text-center">
          <h1
            className="text-xl lg:text-3xl font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r from-azul-gradient to-morado-gradient py-2"
            style={{ lineHeight: "1.2" }}
          >
            Registro
          </h1>
          <p className="text-gray-400 text-sm lg:text-base mb-5">
            Introduce tus datos para crear tu cuenta aquí
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                className={`shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-white bg-fondologin leading-tight focus:outline-none focus:border-[#4a7dfc] ${!validations.name && name ? "border-red-500" : "border-linea"}`}
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Envelope className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                className={`shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-white bg-fondologin leading-tight focus:outline-none focus:border-[#4a7dfc] ${!validations.email && email ? "border-red-500" : "border-linea"}`}
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                className={`shadow appearance-none border rounded w-full py-2 pl-10 pr-10 text-white bg-fondologin leading-tight focus:outline-none focus:border-[#4a7dfc] ${!allPasswordRequirementsMet && password ? "border-red-500" : "border-linea"}`}
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeSlash className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Fortaleza:</span>
                  <span className="text-xs font-medium">
                    {Object.values(validations.password).filter(Boolean)
                      .length === 0 && "Muy débil"}
                    {Object.values(validations.password).filter(Boolean)
                      .length === 1 && "Débil"}
                    {Object.values(validations.password).filter(Boolean)
                      .length === 2 && "Regular"}
                    {Object.values(validations.password).filter(Boolean)
                      .length === 3 && "Buena"}
                    {Object.values(validations.password).filter(Boolean)
                      .length === 4 && "Fuerte"}
                    {Object.values(validations.password).filter(Boolean)
                      .length === 5 && "Excelente"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      Object.values(validations.password).filter(Boolean)
                        .length === 0
                        ? "w-0 bg-red-500"
                        : Object.values(validations.password).filter(Boolean)
                              .length === 1
                          ? "w-1/5 bg-red-500"
                          : Object.values(validations.password).filter(Boolean)
                                .length === 2
                            ? "w-2/5 bg-amber-500"
                            : Object.values(validations.password).filter(
                                  Boolean
                                ).length === 3
                              ? "w-3/5 bg-amber-500"
                              : Object.values(validations.password).filter(
                                    Boolean
                                  ).length === 4
                                ? "w-4/5 bg-green-500"
                                : "w-full bg-green-500"
                    }`}
                  ></div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleRegister}
              className="bg-[#243166] hover:bg-[#1e2a5f] text-white w-full py-2 rounded-lg transition-colors mb-3 text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin mr-1 h-4 w-4 text-white" /* ... svg spinner ... */
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
                  Registrando...
                </span>
              ) : (
                "Registrarse"
              )}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <hr className="w-full border-t border-[#243166]" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400">
              <span className="bg-principal px-2">O CONTINÚA CON</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={handleGoogleSignUp}
              className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <GoogleChromeLogo className="h-6 w-6 mr-2 text-[#4285F4]" />
              Regístrate con Google
            </button>
          </div>

          <div className="text-center text-sm text-gray-400 mt-4">
            ¿Ya tienes una cuenta?{" "}
            <button
              className="text-[#4a7dfc] hover:text-[#6a95ff] focus:outline-none"
              onClick={handleGoToLogin}
              disabled={isLoading}
            >
              Inicia sesión aquí
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-2/5 lg:h-[400px] relative">
        <div className="absolute inset-0">
          <GeometricParticles />
        </div>
      </div>

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