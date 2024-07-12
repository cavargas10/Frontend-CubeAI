import { useNavigate } from "react-router-dom";
import logo from "../../Assets/logo.png";

export const VerifyEmail = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen justify-center items-center">
      <div className="w-full sm:w-1/2 flex items-center justify-center mt-10 sm:mt-0 px-10  sm:px-0 xl:px-10">
        <div className="">
          <div className="border-2 border-linea bg-fondologin shadow-md rounded-lg px-16 pt-10 pb-10 telefono:p-3">
            <div className="flex-grow text-center">
              <h1 className="pb-3 text-2xl">Verifica tu correo electrónico</h1>
              <h2 className="pb-3 text-3xl">
                Se ha enviado un enlace de verificación
              </h2>
              <p className="px-3 pb-4">
                Por favor, revisa tu bandeja de entrada y sigue el enlace para
                verificar tu correo electrónico.
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full mt-4"
                onClick={handleGoToLogin}
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden xl:w-1/2 xl:flex  xl:items-center xl:justify-center  telefono:hidden">
        <div className="flex justify-center items-center">
          <img src={logo} alt="Logo" />
        </div>
      </div>
    </div>
  );
};