import { useState } from "react";
import logo from "../../Assets/logo.webp";
import { auth, googleProvider, db } from "../../Config/firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { RegistrationModal } from "../Modals/RegistrationModal";
import { ErrorModal } from "../Modals/ErrorModal";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const navigate = useNavigate();

  const checkUserInFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    return userSnap.exists();
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userExists = await checkUserInFirestore(user);

      if (!userExists) {
        setGoogleEmail(user.email);
        setShowModal(true);
      } else {
        if (user.emailVerified) {
          navigate("/dashboard");
        } else {
          setError(
            "Por favor, verifica tu correo electrónico antes de iniciar sesión."
          );
          setShowErrorModal(true);
        }
      }
    } catch (error) {
      setError(
        "Hubo un error al intentar iniciar sesión con Google. Por favor, inténtalo de nuevo."
      );
      setShowErrorModal(true);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Todos los campos son obligatorios.");
      setShowErrorModal(true);
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user.emailVerified) {
        navigate("/dashboard");
      } else {
        setError(
          "Por favor, verifica tu correo electrónico antes de iniciar sesión."
        );
        setShowErrorModal(true);
      }
    } catch (error) {
      setError("Acceso denegado: Verifica tu correo y contraseña");
      setShowErrorModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setGoogleEmail("");
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setError(null);
  };

  return (
    <div className="flex h-screen justify-center gap-32 items-center">
      <div className="border-2 border-linea bg-fondologin rounded-lg p-6">
        <div className="text-center mb-4">
          <h1 className="text-xl lg:text-2xl xl:text-3xl">Inicio de sesión</h1>
          <h2 className="text-2xl xl:text-3xl lg:text-4xl">
            Bienvenido a INSTANT3D
          </h2>
          <p className="px-3 pb-4">
            Ingresa tu correo y contraseña para comenzar
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
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-end text-slate-400 hover:text-slate-50 text-sm">
            <a href="/reset-password">¿Olvidaste tu contraseña?</a>
          </p>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 lg:py-3 lg:px-6 rounded-lg focus:outline-none focus:shadow-outline w-full"
            type="button"
            onClick={handleLogin}
          >
            Iniciar sesión
          </button>
        </div>
        <div className="flex mt-1 py-2 border-b-2 border-linea justify-between">
          <p>¿No tienes una cuenta?</p>
          <a className="text-slate-400 hover:text-slate-50" href="/register">
            Inscríbete aquí
          </a>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleGoogleLogin}
            className="bg-blue-500 text-center hover:bg-blue-700 text-white font-bold py-2 px-4 lg:py-3 lg:px-6 rounded-lg focus:outline-none focus:shadow-outline w-full mt-4"
          >
            Iniciar sesión con Google
          </button>
        </div>
      </div>

      <RegistrationModal
        showModal={showModal}
        closeModal={closeModal}
        email={googleEmail}
      />
      <ErrorModal
        showModal={showErrorModal}
        closeModal={closeErrorModal}
        errorMessage={
          error || "Acceso denegado: Verifica tu correo y contraseña"
        }
      />

      <div className="hidden lg:block">
        <img src={logo} alt="Logo" className="" />
      </div>
    </div>
  );
};
