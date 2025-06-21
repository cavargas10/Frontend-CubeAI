import React, { lazy, Suspense } from "react";
import { Flowbite } from "flowbite-react";
import { flowbiteTheme } from "./config/flowbiteTheme";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { PredictionProvider } from "./features/prediction/context/PredictionContext";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import { ErrorBoundaryFallbackUI } from "./components/ui/ErrorBoundaryFallbackUI";
import { DocumentationProvider } from "./features/documentacion/context/DocumentationContext";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { LoadingScreen } from "./components/ui/LoadingScreen";

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
const DocsIndexRedirect = lazy(() =>
  import("./features/documentacion/components/DocsIndexRedirect").then(
    (module) => ({ default: module.DocsIndexRedirect })
  )
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

export function App() {
  useTheme();

  return (
    <Flowbite theme={{ theme: flowbiteTheme }}>
      <div className="text-white ">
        <ErrorBoundary>
          <BrowserRouter>
            <AuthProvider>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<PublicLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="tutoriales" element={<TutorialsPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route
                      path="register"
                      element={
                        <RegisterPage
                          BASE_URL={import.meta.env.VITE_BASE_URL}
                        />
                      }
                    />
                    <Route path="verify-email" element={<VerifyEmailPage />} />
                    <Route
                      path="reset-password"
                      element={<ResetPasswordPage />}
                    />
                    <Route
                      path="action-handler"
                      element={<ActionHandlerPage />}
                    />
                    <Route
                      path="change-password"
                      element={<ChangePasswordPage />}
                    />
                    <Route
                      path="correct-email"
                      element={<CorrectEmailPage />}
                    />
                    <Route
                      path="documentos"
                      element={
                        <DocumentationProvider>
                          <DocsLayout />
                        </DocumentationProvider>
                      }
                    >
                      <Route index element={<DocsIndexRedirect />} />
                      <Route path="documento/:slug" element={<DocsViewer />} />
                      <Route path="*" element={<DocsIndexRedirect />} />
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
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
        <SpeedInsights />
      </div>
    </Flowbite>
  );
}