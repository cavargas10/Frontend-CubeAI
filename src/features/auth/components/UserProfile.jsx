import { useTranslation } from "react-i18next";

export const UserProfile = ({ userData }) => {
  const { t } = useTranslation();

  const handleImageError = (event) => {
    event.target.src = "/usuario.webp";
    event.target.onerror = null;
  };

  const profileImageSize = "w-9 h-9";
  const gradientBorderSize = "p-0.5";

  if (!userData) return null;

  return (
    <div className="flex items-center justify-end gap-3 cursor-pointer">
      <p className="hidden sm:block text-sm text-white font-medium transition-colors duration-300 hover:text-[#A975FF] whitespace-nowrap">
        {t("dashboard_layout.header.welcome", { name: userData.name })}
      </p>

      <div className={`relative rounded-full ${gradientBorderSize} bg-gradient-to-br from-azul-gradient to-morado-gradient shadow-md transition-transform duration-300 group-hover:scale-110`}>
        {userData.profile_picture ? (
          <img
            src={userData.profile_picture}
            alt={`Foto de perfil de ${userData.name}`}
            className={`${profileImageSize} rounded-full object-cover border-2 border-principal`}
            onError={handleImageError}
          />
        ) : (
          <div className={`${profileImageSize} rounded-full flex items-center justify-center bg-principal`}>
            <span className="text-white text-base font-semibold">{userData.name?.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>
    </div>
  );
};