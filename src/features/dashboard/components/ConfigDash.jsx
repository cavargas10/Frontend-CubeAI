import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  User,
  Envelope,
  Trash,
  Image,
  Shield,
} from "@phosphor-icons/react";
import {
  updateUserName,
  updateUserProfilePicture,
  deleteUserAccount,
} from "../../auth/services/userApi";
import { DeleteConfirmationModal } from "../../../components/modals/DeleteConfirmationModal";
import { LoadingModal } from "../../../components/modals/LoadingModal";
import { SuccessModal } from "../../../components/modals/SuccessModal";
import { useAuth } from "../../auth/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { BrandedSpinner } from '../../../components/ui/BrandedSpinner';

export const ConfigDash = ({ isCollapsed, onUserDataUpdate }) => {
  const { t } = useTranslation();
  const { user, userData, refetchUserData } = useAuth();
  const [newName, setNewName] = useState("");
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [nameError, setNameError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleNameChange = (event) => {
    const value = event.target.value;
    setNewName(value);
    setIsNameChanged(userData && value.trim() !== userData.name);
    setNameError(
      value.trim() === "" ? t("config_dash_page.username.error_empty") : ""
    );
  };

  const handleNameSubmit = async () => {
    if (!isNameChanged || newName.trim() === "" || !user) return;
    setLoadingSteps([t("config_dash_page.modals.loading_user")]);
    setShowLoadingModal(true);
    try {
      const token = await user.getIdToken();
      await updateUserName(token, newName.trim());
      await refetchUserData();

      if (onUserDataUpdate) {
        await onUserDataUpdate();
      }

      setNewName("");
      setIsNameChanged(false);
      setShowLoadingModal(false);
      setSuccessMessage(t("config_dash_page.modals.success_user_updated"));
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
    if (!user) return;
    setLoadingSteps([t("config_dash_page.modals.loading_image")]);
    setShowLoadingModal(true);
    const formData = new FormData();
    formData.append("profile_picture", file);
    try {
      const token = await user.getIdToken();
      await updateUserProfilePicture(token, formData);
      await refetchUserData();

      if (onUserDataUpdate) {
        await onUserDataUpdate();
      }

      setShowLoadingModal(false);
      setSuccessMessage(t("config_dash_page.modals.success_image_updated"));
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error actualizando la imagen de perfil:", error);
      setShowLoadingModal(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setLoadingSteps([
      t("config_dash_page.modals.loading_delete"),
      t("config_dash_page.modals.loading_delete_wait"),
    ]);
    setShowLoadingModal(true);
    try {
      const token = await user.getIdToken();
      await deleteUserAccount(token);
      navigate("/");
    } catch (error) {
      console.error("Error eliminando la cuenta:", error);
      setShowLoadingModal(false);
    }
  };

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);
  const confirmDelete = () => {
    closeDeleteModal();
    handleDeleteAccount();
  };

  const closeSuccessModal = () => setShowSuccessModal(false);

  if (!userData) {
    return (
      <section
        className={`min-h-screen bg-white dark:bg-fondologin transition-all duration-300 ease-in-out relative w-full ${
          isCollapsed ? "sm:pl-[80px]" : "md:pl-[267px] 2xl:pl-[300px]"
        }`}
      >
        <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-6 pb-8">
          <div className="flex items-center justify-center h-64">
            <BrandedSpinner size="md" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`min-h-screen bg-white dark:bg-fondologin transition-all duration-300 ease-in-out relative w-full ${
        isCollapsed ? "sm:pl-[80px]" : "md:pl-[267px] 2xl:pl-[300px]"
      }`}
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-6 pb-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-azul-gradient to-morado-gradient pb-2">
                {t("config_dash_page.title")}
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full mt-2"></div>
            </div>
          </div>
          <p className="text-lg leading-relaxed text-justify text-gray-800 dark:text-white">
            {t("config_dash_page.subtitle")}
          </p>
        </div>
        <hr className="border-t-2 border-gray-200 dark:border-linea/20 my-5" />
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-azul-gradient to-morado-gradient rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {t("config_dash_page.section_title")}
            </h2>
          </div>
          <div className="relative bg-gray-50 dark:bg-principal/30 backdrop-blur-sm border border-gray-200 dark:border-linea/20 rounded-2xl p-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1">
                <div className="bg-white dark:bg-principal/20 backdrop-blur-sm border border-gray-200 dark:border-linea/20 rounded-xl p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <Image size={20} className="text-azul-gradient" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {t("config_dash_page.profile_image.title")}
                    </h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    {t("config_dash_page.profile_image.description")}
                  </p>
                  <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                    <div className="relative group">
                      <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-azul-gradient to-morado-gradient shadow-md p-1">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-principal">
                          {userData.profile_picture ? (
                            <img
                              src={userData.profile_picture}
                              alt="Profile"
                              className="w-full h-full rounded-full object-cover border-4 border-white dark:border-principal"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 dark:bg-gradient-to-br from-azul-gradient/20 to-morado-gradient/20 flex items-center justify-center rounded-full">
                              <User size={64} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleProfilePictureClick}
                        className="absolute -bottom-3 -right-3 p-4 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full hover:shadow-lg transition-all duration-300 hover:scale-125 border-4 border-white dark:border-principal"
                      >
                        <Pencil size={18} className="text-white" />
                      </button>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-800 dark:text-gray-300 font-medium">
                        {userData.name || "Usuario"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t(
                          "config_dash_page.profile_image.change_image_prompt"
                        )}
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
                <div className="bg-white dark:bg-principal/20 backdrop-blur-sm border border-gray-200 dark:border-linea/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User size={20} className="text-azul-gradient" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {t("config_dash_page.username.title")}
                    </h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    {t("config_dash_page.username.description")}
                  </p>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder={userData.name || "Cargando..."}
                        value={newName}
                        onChange={handleNameChange}
                        className={`flex-1 p-3 rounded-lg bg-gray-100 dark:bg-principal/50 border-2 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all duration-300 ${
                          nameError
                            ? "border-red-500"
                            : "border-gray-300 dark:border-linea/30"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleNameSubmit}
                        disabled={!isNameChanged || !!nameError}
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                          isNameChanged && !nameError
                            ? "bg-gradient-to-r from-azul-gradient to-morado-gradient hover:shadow-lg hover:scale-105 text-white"
                            : "bg-gray-200 dark:bg-gray-600 cursor-not-allowed text-gray-400 dark:text-gray-400"
                        }`}
                      >
                        {t("config_dash_page.username.save_button")}
                      </button>
                    </div>
                    {nameError && (
                      <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                        {nameError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-white dark:bg-principal/20 backdrop-blur-sm border border-gray-200 dark:border-linea/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Envelope size={20} className="text-morado-gradient" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {t("config_dash_page.email.title")}
                    </h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    {t("config_dash_page.email.description")}
                  </p>
                  <input
                    type="email"
                    value={userData.email || ""}
                    readOnly
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-principal/30 border-2 border-gray-300 dark:border-linea/20 text-gray-500 dark:text-gray-300 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {t("config_dash_page.email.cannot_change")}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-linea/20">
              <div className="bg-red-100 dark:bg-red-500/10 backdrop-blur-sm border border-red-300 dark:border-red-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield
                    size={20}
                    className="text-red-500 dark:text-red-400"
                  />
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                    {t("config_dash_page.danger_zone.title")}
                  </h3>
                </div>
                <p className="text-red-700 dark:text-gray-400 text-sm mb-4">
                  {t("config_dash_page.danger_zone.description")}
                </p>
                <button
                  type="button"
                  onClick={openDeleteModal}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-200 dark:bg-red-500/20 hover:bg-red-500 text-red-700 dark:text-red-400 hover:text-white dark:hover:text-white border border-red-300 dark:border-red-500/30 hover:border-red-500 transition-all duration-300 hover:scale-105"
                >
                  <Trash size={18} />
                  {t("config_dash_page.danger_zone.delete_button")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        showModal={showDeleteModal}
        closeModal={closeDeleteModal}
        onConfirm={confirmDelete}
        message={t("config_dash_page.danger_zone.delete_modal_message")}
      />
      <LoadingModal showLoadingModal={showLoadingModal} steps={loadingSteps} />
      <SuccessModal
        showSuccessModal={showSuccessModal}
        closeSuccessModal={closeSuccessModal}
        message={successMessage}
      />
    </section>
  );
};
