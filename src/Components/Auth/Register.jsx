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
import logo from "../../Assets/logo.webp";
import { ErrorModal } from "../Modals/ErrorModal";
import { RequirementsModal } from "../Modals/RequirementsModal";

export const Register = ({ BASE_URL }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showRequirementsModal, setShowRequirementsModal] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordLengthRegex = /.{6,}/;
  const passwordUppercaseRegex = /(?=.*[A-Z])/;
  const passwordLowercaseRegex = /(?=.*[a-z])/;
  const passwordNumberRegex = /(?=.*\d)/;
  const passwordSpecialCharRegex = /(?=.*[@$!%*?&])/;

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await sendUserDataToBackend(user);
      navigate("/dashboard");
    } catch (error) {
      setError(
        "Hubo un error al intentar registrarse con Google. Por favor, inténtalo de nuevo."
      );
      setShowErrorModal(true);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !name) {
      setShowRequirementsModal(true);
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Por favor, introduce un correo electrónico válido.");
      setShowErrorModal(true);
      return;
    }

    if (
      !passwordLengthRegex.test(password) ||
      !passwordUppercaseRegex.test(password) ||
      !passwordLowercaseRegex.test(password) ||
      !passwordNumberRegex.test(password) ||
      !passwordSpecialCharRegex.test(password)
    ) {
      setShowRequirementsModal(true);
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
      setError("Error al registrar el usuario. Por favor, inténtalo de nuevo.");
      setShowErrorModal(true);
    }
  };

  const sendUserDataToBackend = async (user) => {
    const token = await user.getIdToken();
    try {
      await axios.post(
        `${BASE_URL}/register_user`,
        {
          name: user.displayName || name,
          profile_picture: user.photoURL || "/usuario.webp",
          email: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      setError("Error al registrar el usuario en el backend");
      setShowErrorModal(true);
    }
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setError(null);
  };

  const closeRequirementsModal = () => {
    setShowRequirementsModal(false);
  };

  return (
    <div className="flex h-screen w-full justify-center gap-32 items-center">
      <div className="border-2 border-linea bg-fondologin rounded-lg p-6">
        <div className="flex-grow text-center">
          <h1 className="text-2xl">Registro</h1>
          <h2 className="text-3xl">Bienvenido a INSTANT3D</h2>
          <p className="px-3 pb-4">Introduce tus datos para crear tu cuenta aquí</p>
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-1">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full"
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full mt-4"
          >
            Regístrate con Google
          </button>
        </div>
      </div>

      <div className="hidden lg:block">
        <img src={logo} alt="Logo" />
      </div>

      <ErrorModal
        showModal={showErrorModal}
        closeModal={closeErrorModal}
        errorMessage={
          error || "Error desconocido. Por favor, inténtalo de nuevo."
        }
      />

      <RequirementsModal
        showModal={showRequirementsModal}
        closeModal={closeRequirementsModal}
        email={email}
        password={password}
        name={name}
        emailRegex={emailRegex}
        passwordLengthRegex={passwordLengthRegex}
        passwordUppercaseRegex={passwordUppercaseRegex}
        passwordLowercaseRegex={passwordLowercaseRegex}
        passwordNumberRegex={passwordNumberRegex}
        passwordSpecialCharRegex={passwordSpecialCharRegex}
      />
    </div>
  );
};
