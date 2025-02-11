import React, { lazy, Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./Components/Headers/Header";
import { UseAuth } from "./Components/Auth/UseAuth";

// Lazy load components
const Home = lazy(() => import('./Components/Pages/Home').then(module => ({ default: module.Home })));
const Tutoriales = lazy(() => import('./Components/Pages/Tutoriales').then(module => ({ default: module.Tutoriales })));
const Documentos = lazy(() => import('./Components/Pages/Documentos').then(module => ({ default: module.Documentos })));
const Login = lazy(() => import('./Components/Auth/Login').then(module => ({ default: module.Login })));
const Dashboard = lazy(() => import('./Components/Pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Register = lazy(() => import('./Components/Auth/Register').then(module => ({ default: module.Register })));
const VerifyEmail = lazy(() => import('./Components/Auth/VerifyEmail').then(module => ({ default: module.VerifyEmail })));
const ResetPassword = lazy(() => import('./Components/Auth/ResetPassword').then(module => ({ default: module.ResetPassword })));

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

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
  } = UseAuth();

  return (
    <div className="bg-principal text-white">
      <ErrorBoundary>
        <BrowserRouter>
          <Header />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tutoriales" element={<Tutoriales />} />
              <Route path="/register" element={<Register BASE_URL={import.meta.env.VITE_BASE_URL} />} />
              <Route path="/documentos/*" element={<Documentos />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/dashboard/*"
                element={
                  user ? (
                    <Dashboard
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
                    <Home />
                  )
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
      <SpeedInsights />
    </div>
  );
}

export default App;