import { useState } from "react";
import { auth, googleProvider } from "../../Config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../Assets/logo.png";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await sendUserDataToBackend(user);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !name) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      await sendEmailVerification(user);
      await sendUserDataToBackend(user);
      navigate("/verify-email");
    } catch (error) {
      setError(error.message);
    }
  };

  const sendUserDataToBackend = async (user) => {
    const token = await user.getIdToken();
    try {
      await axios.post(
        "http://localhost:8080/register_user",
        {
          name: user.displayName || name,
          profile_picture: user.photoURL || "../../Assets/usuario.png",
          email: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error sending user data to backend:", error);
      setError("Error al registrar el usuario en el backend");
    }
  };

  return (
    <div className=" flex h-screen justify-center">
      <div className="w-1/2 flex items-center justify-center mt-16">
        <div className="w-full max-w-md">
          <div className="border-2 border-linea bg-fondologin shadow-md rounded-lg px-16 pt-10 pb-10 mb-7">
            <div className="flex-grow text-center">
              <h1 className="text-2xl">Registro</h1>
              <h2 className="text-3xl">Bienvenido a CV3D</h2>
              <p className="px-3 pb-4">
                Ingresa tus datos para crear una cuenta
              </p>
            </div>
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
            <div className="mb-1">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-600">{error}</p>}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full"
                type="button"
                onClick={handleRegister}
              >
                Registrarse
              </button>
            </div>
            <div className="flex mt-1 py-2 border-b-2 border-linea justify-between">
              <p>¿Ya tienes una cuenta?</p>
              <a className="text-slate-400 hover:text-slate-50" href="/login">
                Inicia sesión aquí
              </a>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleGoogleSignUp}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full mt-4"
              >
                Regístrate con Google
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/2 flex  items-center justify-center">
        <img src={logo} alt="Logo" />
      </div>
    </div>
  );
};
