import React, { lazy, Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./features/auth/hooks/useAuth";
import { PredictionProvider } from "./features/prediction/context/PredictionContext";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import { ErrorBoundaryFallbackUI } from "./components/ui/ErrorBoundaryFallbackUI";

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

const HomePage = lazy(() =>
  import("./pages/HomePage").then((module) => ({ default: module.HomePage }))
);
const TutorialsPage = lazy(() =>
  import("./pages/TutorialsPage").then((module) => ({
    default: module.TutorialsPage,
  }))
);
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

const DocsViewer = lazy(() =>
  import("./features/documentacion/components/DocsViewer").then((module) => ({
    default: module.DocsViewer,
  }))
);
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

export const Loading = () => (
  <div className="fixed inset-0 z-[200] flex justify-center items-center bg-principal/90 backdrop-blur-md">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-morado-gradient"></div>
  </div>
);

export function App() {
  const { loadingAuth } = useAuth();

  if (loadingAuth) {
    return <Loading />;
  }

  return (
    <div className="text-white ">
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<PublicLayout />}> 
                <Route index element={<HomePage />} /> 
                <Route path="tutoriales" element={<TutorialsPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route
                  path="register"
                  element={
                    <RegisterPage BASE_URL={import.meta.env.VITE_BASE_URL} />
                  }
                />
                <Route path="verify-email" element={<VerifyEmailPage />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
                <Route path="action-handler" element={<ActionHandlerPage />} />
                <Route path="change-password" element={<ChangePasswordPage />} />
                <Route path="correct-email" element={<CorrectEmailPage />} />
                <Route path="documentos" element={<DocsLayout />}> 
                  <Route index element={<Navigate to="documento/empezar" replace />} />
                  <Route path="documento/:slug" element={<DocsViewer />} />
                  <Route path="*" element={<Navigate to="documento/empezar" replace />} />
                </Route>
                 <Route path="*" element={<Navigate to="/" replace />} /> 
              </Route>

              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <PredictionProvider>
                      <DashboardLayout />
                    </PredictionProvider>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
      <SpeedInsights />
    </div>
  );
}