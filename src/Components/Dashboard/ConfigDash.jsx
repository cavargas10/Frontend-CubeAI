import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil } from "@phosphor-icons/react";
import { DeleteAccount } from "../Modals/DeleteAccount";

export const ConfigDash = ({ BASE_URL, user, userData, updateUserData }) => {
  const [newName, setNewName] = useState("");
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [nameError, setNameError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleNameChange = (event) => {
    const value = event.target.value.trim();
    setNewName(value);
    setIsNameChanged(userData && value !== userData.name);
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
      updateUserData({ name: response.data.name });
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
      updateUserData({ profile_picture: response.data.profile_picture });
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

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const confirmDelete = () => {
    handleDeleteAccount();
    navigate("http://localhost:5173/");
  };

  if (!userData) {
    return <div className="w-full ml-60 pl-2 pr-8 mt-2 border-l-2 border-linea bg-fondologin">Cargando datos del usuario...</div>;
  }

  return (
    <section className="w-full ml-60 pl-2 pr-8 mt-2 border-l-2 border-linea bg-fondologin">
      <div className="ml-8 mt-8">
        <div>
          <h1 className="text-4xl">Perfil</h1>
          <p className="mt-3">Gestiona tu perfil personal en CV3D.AI</p>
          <hr className="mt-4" />
        </div>

        <form className="mt-8">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 pr-4">
              <div className="mb-5">
                <h2 className="text-2xl">Nombre</h2>
                <p className="mt-1">
                  Nombre de usuario con el que usted se registró.
                </p>
                <div className="flex mt-3">
                  <input
                    type="text"
                    placeholder={userData.name || "Cargando..."}
                    value={newName}
                    onChange={handleNameChange}
                    className={`p-2 rounded-lg w-80 bg-principal border-2 ${
                      nameError ? "border-red-500" : "border-linea"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleNameSubmit}
                    disabled={!isNameChanged || !!nameError}
                    className={`ml-5 p-2 text-center rounded-lg ${
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

              <div className="mb-5">
                <h2 className="text-2xl">Correo electrónico</h2>
                <p className="mt-1">
                  La dirección de correo electrónico utilizada para registrarse enCV3D.AI
                </p>
                <div className="mt-3">
                  <input
                    type="email"
                    value={userData.email || ""}
                    readOnly
                    className="p-2 rounded-lg w-80 bg-principal border-2 border-linea"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-2xl">Borrar cuenta</h2>
                <p className="mt-1">
                  Eliminar su cuenta. Esta acción es irreversible.
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={openModal}
                    className="px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  >
                    Borrar mi cuenta
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 pl-4">
              <div className="mb-6">
                <h2 className="text-2xl">Imagen de perfil</h2>
                <p className="mt-1">Actualiza tu imagen de perfil</p>
                <div className="mt-3 flex items-center">
                  <div className="relative">
                    {userData.profile_picture && (
                      <img
                        src={userData.profile_picture}
                        alt="Profile"
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={handleProfilePictureClick}
                      className="absolute bottom-0 right-0 p-1 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full hover:bg-gradient-to-tr shadow-lg"
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
            </div>
          </div>
        </form>
      </div>
      <DeleteAccount
        showModal={showModal}
        closeModal={closeModal}
        confirmDelete={confirmDelete}
      />
    </section>
  );
};
