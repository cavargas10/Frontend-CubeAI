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
    predictionResult,
    setPredictionResult,
    setLoading,
    setError,
    handleLogout,
  } = UseAuth();

  return (
    <div className="bg-principal text-white">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/tutoriales" element={<Tutoriales />} />
          <Route path="/register" element={<Register />} />
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
                  predictionResult={predictionResult}
                  setPredictionResult={setPredictionResult}
                  error={error}
                  loading={loading}
                  setLoading={setLoading}
                  setError={setError}
                  handleLogout={handleLogout}
                  BASE_URL={"http://localhost:8080"} 
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
  );
}

export default App;
