import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, User, Envelope, Trash, Image, Shield } from "@phosphor-icons/react";
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
      <section
        className={`min-h-screen bg-fondologin text-white transition-all duration-300 ease-in-out relative w-full ${
          isCollapsed
            ? "sm:pl-[80px]"
            : "md:pl-[267px] 2xl:pl-[300px]"
        }`}
      >
        <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-6 pb-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-azul-gradient"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`min-h-screen bg-fondologin text-white transition-all duration-300 ease-in-out relative w-full ${
        isCollapsed
          ? "sm:pl-[80px]"
          : "md:pl-[267px] 2xl:pl-[300px]"
      }`}
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-6 pb-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-azul-gradient to-morado-gradient pb-2">
                Configuración
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full mt-2"></div>
            </div>
          </div>        
          <p className="text-lg leading-relaxed text-justify">
            Gestiona tu perfil personal y configuraciones de cuenta. Aquí puedes actualizar 
            tu información, cambiar tu imagen de perfil y administrar tu cuenta de Instant3D.
          </p>
        </div>
        <hr className="border-t-2 border-linea/20 my-5" />
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-azul-gradient to-morado-gradient rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">Información del Perfil</h2>
          </div>
          <div className="relative bg-principal/30 backdrop-blur-sm border border-linea/20 rounded-2xl p-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1">
                <div className="bg-principal/20 backdrop-blur-sm border border-linea/20 rounded-xl p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <Image size={20} className="text-azul-gradient" />
                    <h3 className="text-lg font-semibold text-white">Imagen de Perfil</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">
                    Actualiza tu imagen de perfil para personalizar tu cuenta
                  </p>
                  <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                    <div className="relative group">
                      <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-azul-gradient to-morado-gradient shadow-md p-1">
                        <div className="w-full h-full rounded-full overflow-hidden bg-principal">
                          {userData.profile_picture ? (
                            <img
                              src={userData.profile_picture}
                              alt="Profile"
                              className="w-full h-full rounded-full object-cover border-4 border-principal"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-azul-gradient/20 to-morado-gradient/20 flex items-center justify-center rounded-full">
                              <User size={64} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleProfilePictureClick}
                        className="absolute -bottom-3 -right-3 p-4 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full hover:shadow-lg transition-all duration-300 hover:scale-125 border-4 border-principal"
                      >
                        <Pencil size={18} className="text-white" />
                      </button>
                    </div>                    
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-300 font-medium">
                        {userData.name || "Usuario"}
                      </p>
                      <p className="text-xs text-gray-400">
                        Haz clic para cambiar tu imagen
                      </p>
                    </div>
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
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-principal/20 backdrop-blur-sm border border-linea/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User size={20} className="text-azul-gradient" />
                    <h3 className="text-lg font-semibold text-white">Nombre de Usuario</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Nombre de usuario con el que te registraste en la plataforma
                  </p>                  
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder={userData.name || "Cargando..."}
                        value={newName}
                        onChange={handleNameChange}
                        className={`flex-1 p-3 rounded-lg bg-principal/50 border-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all duration-300 ${
                          nameError ? "border-red-500" : "border-linea/30"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleNameSubmit}
                        disabled={!isNameChanged || !!nameError}
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                          isNameChanged && !nameError
                            ? "bg-gradient-to-r from-azul-gradient to-morado-gradient hover:shadow-lg hover:scale-105 text-white"
                            : "bg-gray-600 cursor-not-allowed text-gray-400"
                        }`}
                      >
                        Guardar
                      </button>
                    </div>
                    {nameError && (
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                        {nameError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-principal/20 backdrop-blur-sm border border-linea/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Envelope size={20} className="text-morado-gradient" />
                    <h3 className="text-lg font-semibold text-white">Correo Electrónico</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    La dirección de correo electrónico utilizada para registrarte en Instant3D
                  </p>                 
                  <input
                    type="email"
                    value={userData.email || ""}
                    readOnly
                    className="w-full p-3 rounded-lg bg-principal/30 border-2 border-linea/20 text-gray-300 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    El correo electrónico no puede ser modificado
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-linea/20">
              <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield size={20} className="text-red-400" />
                  <h3 className="text-lg font-semibold text-red-400">Zona de Peligro</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Eliminar tu cuenta de forma permanente. Esta acción es irreversible y 
                  eliminará todos tus datos, modelos y configuraciones.
                </p>
                <button
                  type="button"
                  onClick={openDeleteModal}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 hover:border-red-500 transition-all duration-300 hover:scale-105"
                >
                  <Trash size={18} />
                  Eliminar mi cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
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