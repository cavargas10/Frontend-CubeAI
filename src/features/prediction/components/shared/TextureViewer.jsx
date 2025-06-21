import { X, DownloadSimple } from "@phosphor-icons/react";
import { useTranslation } from 'react-i18next';

export const TextureViewer = ({ textureUrl, onClose }) => {
  const { t } = useTranslation();

  if (!textureUrl) return null;

  return (
    <div className="absolute inset-0 z-20 bg-principal/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-fadeIn">

      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        aria-label="Cerrar vista de textura"
      >
        <X size={20} weight="bold" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={textureUrl}
          alt={t('model_viewer.texture_preview')}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-morado-gradient/20"
        />
      </div>

      <div className="absolute bottom-6 z-30">
        <a
          href={textureUrl}
          download="texture.png"
          className="px-4 py-2 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-full flex items-center gap-2 transition-all hover:shadow-lg hover:scale-105 shadow-xl"
        >
          <DownloadSimple size={18} />
          <span className="text-sm font-medium">{t('model_viewer.texture_download')}</span>
        </a>
      </div>
    </div>
  );
};