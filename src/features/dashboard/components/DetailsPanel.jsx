import {
  Cube,
  TextT,
  Image as ImageIcon,
  CalendarBlank,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

const DetailItem = ({ icon, label, children }) => (
  <div className="border-t border-gray-200 dark:border-linea/20 pt-3 mt-3 first:border-t-0 first:pt-0 first:mt-0">
    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-gray-800 dark:text-white text-sm break-words">
      {children}
    </div>
  </div>
);

const ImagePreview = ({ src, alt, label }) => (
  <div className="relative group w-full aspect-square bg-gray-100 dark:bg-principal/50 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-linea/20">
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-contain p-2"
      loading="lazy"
    />
    {label && (
      <div className="absolute inset-x-0 bottom-0 py-1 text-center bg-black/50 text-white text-xs backdrop-blur-sm">
        {label}
      </div>
    )}
  </div>
);

export const DetailsPanel = ({ generation }) => {
  const { t } = useTranslation();

  if (!generation) return null;

  const {
    generation_name,
    timestamp,
    raw_data = {},
  } = generation;

  const formatDate = (ts) => {
    if (!ts) return "N/A";
    return new Date(ts).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="bg-white dark:bg-gradient-to-br from-principal via-[#0F102F] to-principal h-full rounded-l-3xl p-4 flex flex-col border-l-2 border-t-2 border-b-2 border-gray-200 dark:border-linea/20 overflow-y-auto custom-scrollbar">
      <div className="flex-grow">
        <DetailItem
          icon={<Cube size={16} />}
          label={t("generation_pages.common.generation_name_label")}
        >
          <h2 className="text-lg font-bold bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text">
            {generation_name}
          </h2>
        </DetailItem>

        <DetailItem
          icon={<CalendarBlank size={16} />}
          label={t("generation_pages.details_panel.creation_date")}
        >
          {formatDate(timestamp)}
        </DetailItem>

        {raw_data.user_prompt && (
          <DetailItem
            icon={<TextT size={16} />}
            label={t("generation_pages.common.prompt_label")}
          >
            <p className="italic bg-gray-100 dark:bg-principal/50 p-2 rounded-md">
              "{raw_data.user_prompt}"
            </p>
          </DetailItem>
        )}

        {raw_data.input_image_url && (
          <DetailItem
            icon={<ImageIcon size={16} />}
            label={t("generation_pages.details_panel.input_image")}
          >
            <ImagePreview
              src={raw_data.input_image_url}
              alt={t("generation_pages.details_panel.input_image")}
            />
          </DetailItem>
        )}

        {raw_data.input_image_urls && (
          <DetailItem
            icon={<ImageIcon size={16} />}
            label={t("generation_pages.details_panel.input_views")}
          >
            <div className="flex flex-col gap-3">
              <ImagePreview
                src={raw_data.input_image_urls.frontal}
                alt={t("methods.multi_image_to_3d.views.0")}
                label={t("methods.multi_image_to_3d.views.0")}
              />
              <ImagePreview
                src={raw_data.input_image_urls.lateral}
                alt={t("methods.multi_image_to_3d.views.1")}
                label={t("methods.multi_image_to_3d.views.1")}
              />
              <ImagePreview
                src={raw_data.input_image_urls.trasera}
                alt={t("methods.multi_image_to_3d.views.2")}
                label={t("methods.multi_image_to_3d.views.2")}
              />
            </div>
          </DetailItem>
        )}

        {raw_data.input_2d_image_url && (
          <DetailItem
            icon={<ImageIcon size={16} />}
            label={t("generation_pages.details_panel.generated_2d_image")}
          >
            <ImagePreview
              src={raw_data.input_2d_image_url}
              alt={t("generation_pages.details_panel.generated_2d_image")}
            />
          </DetailItem>
        )}

        {raw_data.texture_image_url && (
          <DetailItem
            icon={<ImageIcon size={16} />}
            label={t("generation_pages.details_panel.texture_image")}
          >
            <ImagePreview
              src={raw_data.texture_image_url}
              alt={t("generation_pages.details_panel.texture_image")}
            />
          </DetailItem>
        )}

        {raw_data.description && (
          <DetailItem
            icon={<TextT size={16} />}
            label={t("generation_pages.details_panel.sketch_description")}
          >
            <p className="italic bg-gray-100 dark:bg-principal/50 p-2 rounded-md">
              "{raw_data.description}"
            </p>
          </DetailItem>
        )}
      </div>
    </div>
  );
};