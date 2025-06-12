import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Envelope, ArrowLeft, CheckCircle, XCircle } from "@phosphor-icons/react";
import { auth } from "../../../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { GeometricParticles } from "../../../components/ui/GeometricParticles";
import { useTranslation } from "react-i18next";

export const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const handleResetPassword = async () => {
    if (!isValidEmail) {
      setErrorMessage("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    setIsLoading(true);
    setCanResend(false);
    setErrorMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Se ha enviado un enlace para restablecer la contraseña.");
      setCountdown(60);
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Hubo un error al enviar el correo. Por favor, inténtalo de nuevo."
      );
      setCanResend(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen pt-16 bg-fondologin text-gray-100 flex overflow-hidden">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 h-full">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient p-0.5">
              <div className="w-full h-full rounded-full bg-fondologin flex items-center justify-center">
                <Envelope className="h-10 w-10 text-azul-gradient" weight="bold" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-azul-gradient to-morado-gradient mb-2">
              {t("auth.reset_password.title")}
            </h1>
            <p className="text-base">
              {t("auth.reset_password.subtitle")}
            </p>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Envelope className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                className={`appearance-none rounded-md block w-full px-3 py-3 pl-10 border bg-principal placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-morado-gradient sm:text-sm transition-colors ${
                  email && !isValidEmail
                    ? "border-red-500 focus:border-red-500"
                    : "border-linea focus:border-morado-gradient"
                }`}
                type="email"
                placeholder={t("auth.reset_password.email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {email && !isValidEmail && (
              <p className="text-red-400 text-sm mt-1">
                Ingresa un correo electrónico válido.
              </p>
            )}
          </div>
          {errorMessage && (
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" weight="fill" />
              <p className="text-red-200 text-sm">{errorMessage}</p>
            </div>
          )}

          {message && (
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" weight="fill" />
              <p className="text-green-200 text-sm">{message}</p>
            </div>
          )}
          <div className="space-y-3">
            <button
              onClick={handleResetPassword}
              disabled={isLoading || !canResend || !isValidEmail}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-azul-gradient to-morado-gradient hover:from-azul-gradient/90 hover:to-morado-gradient/90 text-white font-medium text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t("auth.reset_password.send_loading_button")}
                </div>
              ) : countdown > 0 ? (
                t("auth.reset_password.resend_in", { seconds: countdown })
              ) : (
                t("auth.reset_password.send_button")
              )}
            </button>
            <button
              onClick={handleGoToLogin}
              className="w-full py-3 px-4 rounded-lg border border-linea/50 bg-transparent hover:bg-secondary/10 text-gray-300 hover:text-white font-medium text-sm transition-all flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t("auth.reset_password.back_to_login")}</span>
            </button>
          </div>
          <div className="text-center">
            <p className="text-xs">
              {t("auth.reset_password.spam_note")}
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden h-full">
        <div className="absolute inset-0">
          <GeometricParticles />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-azul-gradient/5 via-transparent to-morado-gradient/5 pointer-events-none"></div>
      </div>
    </div>
  );
};