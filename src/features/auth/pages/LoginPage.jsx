import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import { GeometricParticles } from "../../../components/ui/GeometricParticles"; // Componente de partículas
import {
  Eye,
  EyeSlash,
  Envelope,
  Lock,
  GoogleChromeLogo,
} from "@phosphor-icons/react"; // Íconos de Phosphor Icons
import { auth, googleProvider, db } from "../../../config/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { RegistrationModal } from "../../../components/modals/RegistrationModal"; // Modal de registro
import { ErrorModal } from "../../../components/modals/ErrorModal";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [rememberMe, setRememberMe] = useState(false); // Estado para "Recordar sesión"
  const [isLoading, setIsLoading] = useState(false); // Estado para spinner
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const navigate = useNavigate(); // Uso de useNavigate

  // Funciones para navegar a otras rutas
  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleResetPasswordClick = () => {
    navigate("/reset-password");
  };

  // Verificar si el usuario existe en Firestore
  const checkUserInFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  };

  // Inicio de sesión con Google
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userExists = await checkUserInFirestore(user);

      if (!userExists) {
        setGoogleEmail(user.email);
        setShowModal(true);
      } else {
        if (user.emailVerified) {
          navigate("/dashboard");
        } else {
          setError(
            "Por favor, verifica tu correo electrónico antes de iniciar sesión."
          );
          setShowErrorModal(true);
        }
      }
    } catch (error) {
      setError(
        "Hubo un error al intentar iniciar sesión con Google. Por favor, inténtalo de nuevo."
      );
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Inicio de sesión con correo y contraseña
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Todos los campos son obligatorios.");
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Guardar sesión si "Recordar mi sesión" está activado
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      if (user.emailVerified) {
        navigate("/dashboard");
      } else {
        setError(
          "Por favor, verifica tu correo electrónico antes de iniciar sesión."
        );
        setShowErrorModal(true);
      }
    } catch (error) {
      setError("Acceso denegado: Verifica tu correo y contraseña.");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar correo guardado si "Recordar mi sesión" estaba activado previamente
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Cerrar modal de registro
  const closeModal = () => {
    setShowModal(false);
    setGoogleEmail("");
  };

  // Cerrar modal de error
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
            Bienvenido de nuevo
          </h1>
          <p className="text-gray-400 text-sm lg:text-base mb-5">
            Ingresa tu correo y contraseña para comenzar
          </p>
          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Campo de correo electrónico */}
            <div className="relative">
              <Envelope className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                className="shadow appearance-none border rounded w-full py-2 px-10 text-white bg-fondologin leading-tight focus:outline-none focus:border-[#4a7dfc]"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Campo de contraseña */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                className="shadow appearance-none border rounded w-full py-2 px-10 pr-10 text-white bg-fondologin leading-tight focus:outline-none focus:border-[#4a7dfc]"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {/* Opciones adicionales */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label>Recordar mi sesión</label>
              </div>
              {/* Enlace para restablecer contraseña */}
              <button
                className="text-[#4a7dfc] hover:text-[#6a95ff] focus:outline-none"
                onClick={handleResetPasswordClick}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            {/* Botón de inicio de sesión */}
            <button
              type="submit"
              className="bg-[#243166] hover:bg-[#1e2a5f] text-white w-full py-2 rounded-lg transition-colors mb-3 text-sm lg:text-base"
              disabled={isLoading}
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
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
          {/* Separador */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <hr className="w-full border-t border-[#243166]" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400">
              <span className="bg-principal px-2">O CONTINÚA CON</span>
            </div>
          </div>
          {/* Botones de redes sociales */}
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full"
              disabled={isLoading}
            >
              <GoogleChromeLogo className="h-6 w-6 mr-2 text-[#4285F4]" />
              Google
            </button>
          </div>
          {/* Enlace para registrarse */}
          <div className="text-center text-sm text-gray-400 mt-4">
            ¿No tienes una cuenta?{" "}
            <button
              className="text-[#4a7dfc] hover:text-[#6a95ff] focus:outline-none"
              onClick={handleRegisterClick}
            >
              Regístrate aquí
            </button>
          </div>
        </div>
      </div>
      {/* Componente GeometricParticles */}
      <div className="hidden lg:block lg:w-2/5 lg:h-[400px] relative">
        <div className="absolute inset-0">
          <GeometricParticles />
        </div>
      </div>
      {/* Modal de registro */}
      <RegistrationModal
        showModal={showModal}
        closeModal={closeModal}
        email={googleEmail}
      />
      {/* Modal de error */}
      <ErrorModal
        showModal={showErrorModal}
        closeModal={closeErrorModal}
        errorMessage={
          error || "Acceso denegado: Verifica tu correo y contraseña"
        }
      />
    </div>
  );
};