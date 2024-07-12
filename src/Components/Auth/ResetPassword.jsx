import { useState } from "react";
import logo from "../../Assets/logo.png";
import { auth } from "../../Config/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Se ha enviado un enlace para restablecer la contraseña a tu correo electrónico."
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen justify-center items-center">
      <div className="w-full sm:w-1/2 flex items-center justify-center mt-10 sm:mt-0 px-4">
        <div className="border-2 border-linea bg-fondologin shadow-md rounded-lg p-4 sm:p-10 ">
          <div className="flex-grow text-center">
            <h1 className="pb-3 text-2xl">Restablecer contraseña</h1>
            <h2 className="pb-3 text-3xl">Ingresa tu correo electrónico</h2>
            <p className="px-3 pb-4">
              Te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full"
              type="button"
              onClick={handleResetPassword}
            >
              Enviar enlace
            </button>
          </div>
          <div className="flex mt-4 py-2 border-t-2 border-linea justify-between">
            <p>¿Ya tienes una cuenta?</p>
            <a className="text-slate-400 hover:text-slate-50 " href="/login">
              Inicia sesión aquí
            </a>
          </div>
        </div>
      </div>
      <div className="sm:hidden xl:w-1/2 xl:flex  xl:items-center xl:justify-center telefono:hidden">
        <img src={logo} alt="Logo" />
      </div>
    </div>
  );
};