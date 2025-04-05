import React, { lazy, Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./features/auth/hooks/useAuth";
import PublicLayout from "./layouts/PublicLayout/PublicLayout"; // Importamos PublicLayout
// Lazy load components
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const TutorialsPage = lazy(() => import('./pages/TutorialsPage').then(module => ({ default: module.TutorialsPage })));
const DocsLayout = lazy(() => import('./layouts/DocsLayout').then(module => ({ default: module.DocsLayout })));
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout').then(module => ({ default: module.DashboardLayout })));
const RegisterPage = lazy(() => import('./features/auth/pages/RegisterPage').then(module => ({ default: module.RegisterPage })));
const VerifyEmailPage = lazy(() => import('./features/auth/pages/VerifyEmailPage').then(module => ({ default: module.VerifyEmailPage })));
const ResetPasswordPage = lazy(() => import('./features/auth/pages/ResetPasswordPage').then(module => ({ default: module.ResetPasswordPage })));
const ChangePasswordPage = lazy(() => import('./features/auth/pages/ChangePasswordPage').then(module => ({ default: module.ChangePasswordPage })));
const CorrectEmailPage = lazy(() => import('./features/auth/pages/CorrectEmailPage').then(module => ({ default: module.CorrectEmailPage })));
const ActionHandlerPage = lazy(() => import('./features/auth/pages/ActionHandlerPage').then(module => ({ default: module.ActionHandlerPage })));

// Loading component
const Loading = () => <div>Loading...</div>;

function App() {
  const {
    user,
    userData,
    loading,
    error,
    prediction_img3d_result,
    prediction_text3d_result,
    prediction_textimg3d_result,
    prediction_unico3d_result,
    prediction_multiimg3d_result,
    prediction_boceto3d_result,
    setPrediction_img3d_result,
    setPrediction_text3d_result,
    setPrediction_textimg3d_result,
    setPrediction_unico3d_result,
    setPrediction_multiimg3d_result,
    setPrediction_boceto3d_result,
    setLoading,
    setError,
    handleLogout,
  } = useAuth();

  return (
    <div className="text-white">
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="documentos/*" element={<DocsLayout />} />
              <Route path="tutoriales" element={<TutorialsPage />} />
              <Route path="register" element={<RegisterPage BASE_URL={import.meta.env.VITE_BASE_URL} />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="verify-email" element={<VerifyEmailPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="action-handler" element={<ActionHandlerPage />} />
              <Route path="change-password" element={<ChangePasswordPage />} />
              <Route path="correct-email" element={<CorrectEmailPage />} />
            </Route>

            {/* Rutas anidadas para documentos */}
            <Route path="documentos/*" element={<DocsLayout />} />

            {/* Rutas protegidas para el dashboard */}
            <Route
              path="dashboard/*"
              element={
                user ? (
                  <DashboardLayout
                    userData={userData}
                    prediction_img3d_result={prediction_img3d_result}
                    prediction_text3d_result={prediction_text3d_result}
                    prediction_textimg3d_result={prediction_textimg3d_result}
                    prediction_unico3d_result={prediction_unico3d_result}
                    prediction_multiimg3d_result={prediction_multiimg3d_result}
                    prediction_boceto3d_result={prediction_boceto3d_result}
                    setPrediction_img3d_result={setPrediction_img3d_result}
                    setPrediction_text3d_result={setPrediction_text3d_result}
                    setPrediction_textimg3d_result={setPrediction_textimg3d_result}
                    setPrediction_unico3d_result={setPrediction_unico3d_result}
                    setPrediction_multiimg3d_result={setPrediction_multiimg3d_result}
                    setPrediction_boceto3d_result={setPrediction_boceto3d_result}
                    error={error}
                    loading={loading}
                    setLoading={setLoading}
                    setError={setError}
                    handleLogout={handleLogout}
                    BASE_URL={import.meta.env.VITE_BASE_URL}
                    user={user}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <SpeedInsights />
    </div>
  );
}

export default App;