import { DownloadSimple, Trash, Cube } from "@phosphor-icons/react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const DownloadButton = ({ download }) => {
  const { t } = useTranslation();
  const handleDownload = (e) => {
    e.stopPropagation(); 
    const link = document.createElement("a");
    link.href = download.url;
    link.download = `${download.format.toLowerCase()}_model.${download.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-full shadow-lg hover:shadow-xl transition-all text-xs"
      aria-label={`${t('visualizer_page.card.download_label')} ${download.format}`}
    >
      <DownloadSimple size={16} weight="bold" />
      {download.format}
    </button>
  );
};

export const GenerationCard = ({ generation, formatDate, openModal, predictionType }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { previewImageUrl, downloads, generation_name } = generation;

  const handleCardClick = () => {
    if (generation.modelUrl) {
      navigate(`?view=${encodeURIComponent(generation_name)}&type=${predictionType}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="relative w-full h-[220px] rounded-2xl overflow-hidden shadow-lg group cursor-pointer 
                 bg-gray-200 dark:bg-principal 
                 border-2 border-transparent hover:border-morado-gradient transition-all duration-300"
    >
      {previewImageUrl ? (
        <img 
          src={previewImageUrl} 
          alt={`Previsualización de ${generation_name}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-400 p-4 text-center">
            <Cube size={40} className="mb-2 opacity-50"/>
            <span className="text-sm font-medium">{t('visualizer_page.card.preview_unavailable')}</span>
            <span className="text-xs opacity-70 mt-1">{t('visualizer_page.card.click_to_view')}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300"></div>
      <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
        <h3 className="text-base font-bold truncate drop-shadow-md">{generation_name}</h3>
        <p className="text-xs text-gray-300 mb-2 drop-shadow-sm">
          {formatDate(generation.timestamp)}
        </p>
        <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            {downloads && downloads.map(d => (
              <DownloadButton key={d.format} download={d} />
            ))}
          </div>
          <button
            className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              openModal(generation);
            }}
            aria-label={t('visualizer_page.card.delete_label')}
          >
            <Trash size={16} color="white" weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
};