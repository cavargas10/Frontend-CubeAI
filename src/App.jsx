// src/App.jsx
import React, { lazy, Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"; // Importa Navigate
import { useAuth } from "./features/auth/hooks/useAuth";
import { PredictionProvider } from "./features/prediction/context/PredictionContext";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import { ErrorBoundaryFallbackUI } from "./components/ui/ErrorBoundaryFallbackUI"; // Asegúrate de que este componente exista

// --- Lazy Loading ---
// Layouts

const PublicLayout = lazy(() =>
  import("./layouts/PublicLayout/PublicLayout").then((module) => ({
    default: module.PublicLayout,
  }))
);
const DocsLayout = lazy(() =>
  import("./layouts/DocsLayout").then((module) => ({
    default: module.DocsLayout,
  }))
);
const DashboardLayout = lazy(() =>
  import("./layouts/DashboardLayout").then((module) => ({
    default: module.DashboardLayout,
  }))
);

// Pages Públicas
const HomePage = lazy(() =>
  import("./pages/HomePage").then((module) => ({ default: module.HomePage }))
);
const TutorialsPage = lazy(() =>
  import("./pages/TutorialsPage").then((module) => ({
    default: module.TutorialsPage,
  }))
);

// Pages de Autenticación
const LoginPage = lazy(() =>
  import("./features/auth/pages/LoginPage").then((module) => ({
    default: module.LoginPage,
  }))
);
const RegisterPage = lazy(() =>
  import("./features/auth/pages/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  }))
);
const VerifyEmailPage = lazy(() =>
  import("./features/auth/pages/VerifyEmailPage").then((module) => ({
    default: module.VerifyEmailPage,
  }))
);
const ResetPasswordPage = lazy(() =>
  import("./features/auth/pages/ResetPasswordPage").then((module) => ({
    default: module.ResetPasswordPage,
  }))
);
const ChangePasswordPage = lazy(() =>
  import("./features/auth/pages/ChangePasswordPage").then((module) => ({
    default: module.ChangePasswordPage,
  }))
);
const CorrectEmailPage = lazy(() =>
  import("./features/auth/pages/CorrectEmailPage").then((module) => ({
    default: module.CorrectEmailPage,
  }))
);
const ActionHandlerPage = lazy(() =>
  import("./features/auth/pages/ActionHandlerPage").then((module) => ({
    default: module.ActionHandlerPage,
  }))
);
// --- Fin Lazy Loading ---

// --- Error Boundary (sin cambios) ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error: error, errorInfo: errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      // Renderiza el componente de fallback pasándole el error y errorInfo
      return (
        <ErrorBoundaryFallbackUI
          error={this.state.error}
          errorInfo={this.state.errorInfo}
        />
      );
    }
    return this.props.children;
  }
}
// --- Fin Error Boundary ---

// --- Loading Component ---
export const Loading = () => (
  <div className="fixed inset-0 z-[100] flex justify-center items-center bg-principal/80 backdrop-blur-sm">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-morado-gradient"></div>
  </div>
);
// --- Fin Loading Component ---

export function App() {
  // Solo obtiene el estado de carga inicial de la autenticación desde useAuth
  const { loadingAuth } = useAuth();

  // Muestra un loading global solo durante la verificación inicial de auth
  if (loadingAuth) {
    return <Loading />;
  }

  // Una vez verificado el estado de auth (cargado), renderiza las rutas
  return (
    <div className="text-white">
      {" "}
      {/* Contenedor principal */}
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            {" "}
            {/* Fallback para Carga Diferida */}
            <Routes>
              {/* --- Rutas Públicas --- */}
              <Route element={<PublicLayout />}>
                {" "}
                {/* Header público se renderiza aquí */}
                <Route path="/" element={<HomePage />} />
                <Route path="/tutoriales" element={<TutorialsPage />} />
                <Route path="documentos/*" element={<DocsLayout />} />
                {/* Rutas de Autenticación también usan el Layout Público */}
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/register"
                  element={
                    <RegisterPage BASE_URL={import.meta.env.VITE_BASE_URL} />
                  }
                />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/action-handler" element={<ActionHandlerPage />} />
                <Route
                  path="/change-password"
                  element={<ChangePasswordPage />}
                />
                <Route path="/correct-email" element={<CorrectEmailPage />} />
                {/* Si alguna página de Auth NO debe tener el Header Público, sácala de este Route padre */}
              </Route>

              {/* --- Ruta de Documentación --- */}
              {/* Rutas anidadas para documentos */}
              <Route path="documentos/*" element={<DocsLayout />} />

              {/* --- Ruta del Dashboard (Protegida) --- */}
              <Route
                path="/dashboard/*" // Captura todas las sub-rutas del dashboard
                element={
                  <ProtectedRoute>
                    {" "}
                    {/* 1. Protege la ruta */}
                    <PredictionProvider>
                      {" "}
                      {/* 2. Provee el contexto de predicción */}
                      <DashboardLayout />{" "}
                      {/* 3. Renderiza el layout del dashboard (SIN PROPS de predicción) */}
                    </PredictionProvider>
                  </ProtectedRoute>
                }
              />

              {/* --- Redirección si no coincide ninguna ruta (Opcional 404) --- */}
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
              {/* O <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
      <SpeedInsights /> {/* Analíticas Vercel */}
    </div>
  );
}
