import { SpeedInsights } from "@vercel/speed-insights/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Components/Pages/Home";
import { Header } from "./Components/Headers/Header";
import { Tutoriales } from "./Components/Pages/Tutoriales";
import { Documentos } from "./Components/Pages/Documentos";
import { Login } from "./Components/Auth/Login";
import { Dashboard } from "./Components/Pages/Dashboard";
import { UseAuth } from "./Components/Auth/UseAuth";
import { Register } from "./Components/Auth/Register";
import { VerifyEmail } from "./Components/Auth/VerifyEmail";
import { ResetPassword } from "./Components/Auth/ResetPassword";

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
    setPrediction_img3d_result,
    setPrediction_text3d_result,
    setPrediction_textimg3d_result,
    setPrediction_unico3d_result,
    setLoading,
    setError,
    handleLogout,
  } = UseAuth();

  return (
    <SpeedInsights>
      <div className="bg-principal text-white">
        <BrowserRouter>
          <Header />
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
                    setPrediction_img3d_result={setPrediction_img3d_result}
                    setPrediction_text3d_result={setPrediction_text3d_result}
                    setPrediction_textimg3d_result={setPrediction_textimg3d_result}
                    setPrediction_unico3d_result={setPrediction_unico3d_result}
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
        </BrowserRouter>
      </div>
    </SpeedInsights>
  );
}

export default App;
