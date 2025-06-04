import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Envelope, ArrowLeft, CheckCircle, XCircle } from "@phosphor-icons/react";
import {
  getAuth,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { GeometricParticles } from "../../../components/ui/GeometricParticles";

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "invalid-code") {
      setErrorMessage(
        "El enlace de verificación ha expirado o ya ha sido utilizado. Por favor, solicita un nuevo correo de verificación."
      );
    } else if (error) {
      setErrorMessage(
        "Ocurrió un error al verificar tu correo electrónico. Por favor, intenta nuevamente."
      );
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleResendEmail = async () => {
    if (!email || countdown > 0) return;

    setIsResending(true);
    setErrorMessage("");

    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user, {
          url: window.location.origin + "/action-handler",
          handleCodeInApp: true,
        });
        setResendSuccess(true);
        setCountdown(60);
        setTimeout(() => setResendSuccess(false), 5000);
      }
    } catch (error) {
      setErrorMessage(
        "Hubo un error al reenviar el correo. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="h-screen pt-16 bg-fondologin text-gray-100 flex overflow-hidden">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden h-full">
        <div className="absolute inset-0">
          <GeometricParticles />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-azul-gradient/5 via-transparent to-morado-gradient/5 pointer-events-none"></div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 h-full">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient p-0.5">
              <div className="w-full h-full rounded-full bg-fondologin flex items-center justify-center">
                <Envelope className="h-10 w-10 text-azul-gradient" weight="bold" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-azul-gradient to-morado-gradient mb-2">
              Revisa tu correo
            </h1>
            <p className="text-base">
              Te hemos enviado un enlace de verificación
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-secondary/20 border border-linea/50">
              <span className="text-white font-medium text-sm">
                {email}
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm mx-auto">
              Haz clic en el enlace que acabamos de enviarte para verificar tu cuenta y continuar.
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" weight="fill" />
              <p className="text-red-200 text-sm">{errorMessage}</p>
            </div>
          )}

          {resendSuccess && (
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" weight="fill" />
              <p className="text-green-200 text-sm">¡Correo reenviado correctamente!</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleResendEmail}
              disabled={isResending || countdown > 0}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-azul-gradient to-morado-gradient hover:from-azul-gradient/90 hover:to-morado-gradient/90 text-white font-medium text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isResending ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </div>
              ) : countdown > 0 ? (
                `Reenviar en ${countdown}s`
              ) : (
                "Reenviar correo"
              )}
            </button>

            <button
              onClick={handleGoToLogin}
              className="w-full py-3 px-4 rounded-lg border border-linea/50 bg-transparent hover:bg-secondary/10 text-gray-300 hover:text-white font-medium text-sm transition-all flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver al inicio</span>
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs">
              ¿No encuentras el correo? Revisa tu carpeta de spam
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};