import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil } from "@phosphor-icons/react";

export const ConfigDash = ({ BASE_URL, user }) => {
  const [userData, setUserData] = useState({});
  const [newName, setNewName] = useState("");
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [nameError, setNameError] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await user.getIdToken();
        const response = await axios.get(`${BASE_URL}/user_data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        setNewName("");
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchData();
  }, [BASE_URL, user]);

  const handleNameChange = (event) => {
    const value = event.target.value.trim();
    setNewName(value);
    setIsNameChanged(value !== userData.name);
    setNameError(value === "" ? "El nombre no puede estar vacío" : "");
  };

  const handleNameSubmit = async () => {
    if (!isNameChanged || newName.trim() === "") return;

    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        `${BASE_URL}/update_name`,
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(response.data);
      setNewName("");
      setIsNameChanged(false);
    } catch (error) {
      console.error("Error updating name", error);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file);
      handleProfilePictureSubmit(file);
    }
  };

  const handleProfilePictureSubmit = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        `${BASE_URL}/update_profile_picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData((prevUserData) => ({
        ...prevUserData,
        profile_picture: response.data.profile_picture,
      }));
    } catch (error) {
      console.error("Error updating profile picture", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = await user.getIdToken();
      await axios.delete(`${BASE_URL}/delete_user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting account", error);
    }
  };

  return (
    <section className="col-span-8 ml-[250px] border-l-2 border-linea">
      <div className="ml-8 mt-8">
        <div>
          <h1 className="text-4xl">Perfil</h1>
          <p className="mt-4">Gestiona tu perfil personal en CV3D.AI</p>
          <hr className="mt-4" />
        </div>

        <form className="mt-4">
          <div>
            <h2 className="text-3xl">Nombre</h2>
            <p className="mt-3">
              Nombre de usuario con el que usted se registró, si desea puede
              cambiarlo por como desea que lo conozcan en CV3D.AI
            </p>
            <div className="flex mt-5">
              <input
                type="text"
                placeholder={userData.name || "Cargando..."}
                value={newName}
                onChange={handleNameChange}
                className={`p-2 rounded-lg bg-principal border-2 w-1/4 ${
                  nameError ? "border-red-500" : "border-linea"
                }`}
              />
              <button
                type="button"
                onClick={handleNameSubmit}
                disabled={!isNameChanged || !!nameError}
                className={`ml-5 p-2 w-1/12 text-center rounded-lg ${
                  isNameChanged && !nameError
                    ? "bg-gradient-to-r from-azul-gradient to-morado-gradient"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Guardar
              </button>
            </div>
            {nameError && <p className="text-red-500 mt-2">{nameError}</p>}
          </div>

          <div className="mt-4">
            <h2 className="text-3xl">Correo electrónico</h2>
            <p className="mt-3">
              La dirección de correo electrónico utilizada para registrarse en
              CV3D.AI
            </p>
            <div className="mt-4">
              <input
                type="email"
                value={userData.email || ""}
                readOnly
                className="p-2 rounded-lg bg-principal border-2 w-1/4 border-linea"
              />
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-3xl">Imagen de perfil</h2>
            <p className="mt-3">Actualiza tu imagen de perfil</p>
            <div className="mt-4 flex items-center">
              <div className="relative">
                {userData.profile_picture && (
                  <img
                    src={userData.profile_picture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={handleProfilePictureClick}
                  className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg"
                >
                  <Pencil size={24} />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePictureChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-3xl">Borrar cuenta</h2>
            <p className="mt-3">
              Eliminar su cuenta eliminará permanentemente todos sus activos y
              no se puede deshacer. Esta acción es irreversible.
            </p>
            <div className="mt-7">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-4 rounded-lg bg-red-500 text-white"
              >
                Borrar mi cuenta
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
