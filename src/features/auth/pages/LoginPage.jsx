import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { GeometricParticles } from "../../../components/ui/GeometricParticles";
import {
  Eye,
  EyeSlash,
  EnvelopeSimple,
  LockSimple,
} from "@phosphor-icons/react";
import { auth, googleProvider, db } from "../../../config/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { RegistrationModal } from "../../../components/modals/RegistrationModal";
import { ErrorModal } from "../../../components/modals/ErrorModal";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../context/AuthContext";
import { InlineSpinner } from "../../../components/ui/InlineSpinner";

export const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, loadingAuth } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");

  if (loadingAuth) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-fondologin">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-morado-gradient"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRegisterClick = () => navigate("/register");
  const handleResetPasswordClick = () => navigate("/reset-password");

  const checkUserInFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
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
      console.error("Google login error:", error);
      setError("Error al iniciar sesión con Google. Inténtalo de nuevo.");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Todos los campos son obligatorios.");
      setShowErrorModal(true);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

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
      console.error("Email/Pass login error:", error);
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setError("Correo electrónico o contraseña incorrectos.");
      } else {
        setError("Error al iniciar sesión. Verifica tus credenciales.");
      }
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setGoogleEmail("");
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setError(null);
  };

  return (
    <div className="h-screen pt-16 bg-white text-gray-800 dark:bg-fondologin dark:text-gray-100 flex selection:bg-morado-gradient selection:text-white overflow-hidden">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 h-full">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-center text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-azul-gradient to-morado-gradient py-1">
              {t("auth.login.title")}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {t("auth.login.subtitle")}
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <EnvelopeSimple
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
                <LockSimple
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none rounded-md block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-morado-gradient focus:border-morado-gradient sm:text-sm transition-colors dark:border-linea dark:bg-principal dark:text-white"
                placeholder={t("auth.login.password_placeholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none z-20"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlash className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-morado-gradient bg-gray-100 border-gray-300 rounded focus:ring-morado-gradient focus:ring-offset-2 focus:ring-offset-white dark:bg-principal dark:border-linea dark:focus:ring-offset-fondologin"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-gray-700 dark:text-gray-300"
                >
                  {t("auth.login.remember_me")}
                </label>
              </div>

              <div className="font-medium">
                <button
                  type="button"
                  onClick={handleResetPasswordClick}
                  className="text-azul-gradient hover:text-morado-gradient transition-colors"
                >
                  {t("auth.login.forgot_password")}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-gradient-to-r from-azul-gradient to-morado-gradient hover:from-azul-gradient/90 hover:to-morado-gradient/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-fondologin disabled:opacity-60 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <InlineSpinner className="h-5 w-5 mr-3" />
                    {t("auth.login.login_loading_button")}
                  </span>
                ) : (
                  t("auth.login.login_button")
                )}
              </button>
            </div>
          </form>

          <div className="relative my-6">
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
              onClick={handleGoogleLogin}
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
                  {t("auth.login.google_button")}
                </span>
              </div>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            {t("auth.login.no_account")}{" "}
            <button
              type="button"
              onClick={handleRegisterClick}
              className="font-bold text-azul-gradient hover:text-morado-gradient transition-colors"
            >
              {t("auth.login.register_link")}
            </button>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden h-full">
        <div className="absolute inset-0">
          <GeometricParticles />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-azul-gradient/5 via-transparent to-morado-gradient/5 pointer-events-none"></div>
      </div>

      <RegistrationModal
        showModal={showModal}
        closeModal={closeModal}
        email={googleEmail}
      />
      <ErrorModal
        showModal={showErrorModal}
        closeModal={closeErrorModal}
        errorMessage={error}
      />
    </div>
  );
};
