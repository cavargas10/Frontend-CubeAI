import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "@phosphor-icons/react";
import {
  updateUserName,
  updateUserProfilePicture,
  deleteUserAccount,
} from "../../auth/services/userApi";
import { DeleteConfirmationModal } from "../../../components/modals/DeleteConfirmationModal";
import { LoadingModal } from "../../../components/modals/LoadingModal";
import { SuccessModal } from "../../../components/modals/SuccessModal";

export const ConfigDash = ({ user, userData, refetchUserData, isCollapsed }) => {
  const [newName, setNewName] = useState("");
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [nameError, setNameError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    setLoadingMessage("Actualizando su usuario");
    setShowLoadingModal(true);
    try {
      const token = await user.getIdToken();
      await updateUserName(token, newName.trim());
      await refetchUserData();
      setNewName("");
      setIsNameChanged(false);
      setShowLoadingModal(false);
      setSuccessMessage("Su usuario se ha actualizado");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error actualizando el nombre:", error);
      setShowLoadingModal(false);
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
    setLoadingMessage("Actualizando su imagen de perfil");
    setShowLoadingModal(true);
    const formData = new FormData();
    formData.append("profile_picture", file);
    try {
      const token = await user.getIdToken();
      await updateUserProfilePicture(token, formData);
      await refetchUserData();
      setShowLoadingModal(false);
      setSuccessMessage("Su imagen se ha actualizado");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error actualizando la imagen de perfil:", error);
      setShowLoadingModal(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = await user.getIdToken();
      await deleteUserAccount(token);
      navigate("/");
    } catch (error) {
      console.error("Error eliminando la cuenta:", error);
    }
  };

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);
  const confirmDelete = () => {
    handleDeleteAccount();
  };

  const closeSuccessModal = () => setShowSuccessModal(false);

  if (!userData) {
    return (
      <div className="w-full sm:ml-64 pl-2 pr-8 mt-2 border-l-2 border-linea bg-fondologin">
        Cargando datos del usuario...
      </div>
    );
  }

  return (
    <section
      className={`sm:ml-64 pb-8 pr-5 w-full bg-fondologin transition-all duration-300 ease-in-out ${
        isCollapsed
          ? "sm:ml-[80px] xl:ml-[80px] 2xl:ml-[80px]"
          : "sm:ml-[264px] md:ml-[267px] xl:ml-[267px] 2xl:ml-[300px]"
      }`}
    >
      <div className="ml-8 mt-7">
        <div>
          <h1 className="text-4xl">Perfil</h1>
          <p className="mt-3">Gestiona tu perfil personal en CV3D.AI</p>
          <hr className="mt-4" />
        </div>
        <form className="mt-3 sm:mt-8">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 pr-4">
              <div className="mb-3 sm:mb-5">
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
                        ? "bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Guardar
                  </button>
                </div>
                {nameError && <p className="text-red-500 mt-2">{nameError}</p>}
              </div>
              <div className="mb-3 sm:mb-5">
                <h2 className="text-2xl">Correo electrónico</h2>
                <p className="mt-1">
                  La dirección de correo electrónico utilizada para registrarse
                  enCV3D.AI
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
                    onClick={openDeleteModal}
                    className="px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  >
                    Borrar mi cuenta
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3 sm:w-1/2 xl:pl-4 sm:mt-5 xl:mt-0">
              <div className="mb-6">
                <h2 className="text-2xl">Imagen de perfil</h2>
                <p className="mt-1">Actualiza tu imagen de perfil</p>
                <div className="mt-3 flex items-center">
                  <div className="relative mx-auto sm:mx-0">
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
      <DeleteConfirmationModal
        showModal={showDeleteModal}
        closeModal={closeDeleteModal}
        confirmDelete={confirmDelete}
        message="¿Estás seguro de que deseas eliminar tu cuenta?"
      />
      <LoadingModal
        showLoadingModal={showLoadingModal}
        message={loadingMessage}
      />
      <SuccessModal
        showSuccessModal={showSuccessModal}
        closeSuccessModal={closeSuccessModal}
        message={successMessage}
      />
    </section>
  );
};