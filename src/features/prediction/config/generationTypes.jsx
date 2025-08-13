import {
  Textbox,
  Image,
  FileImage,
  Cube,
  Images,
  Scribble,
  PaintBrush,
} from "@phosphor-icons/react";

export const GENERATION_TYPES = [
  {
    id: "Texto3D",
    path: "texto3D",
    labelKey: "dashboard_layout.nav.text_to_3d",
    tabLabelKey: "visualizer_page.tabs.text_to_3d",
    icon: Textbox,
  },
  {
    id: "Imagen3D",
    path: "imagen3D",
    labelKey: "dashboard_layout.nav.image_to_3d",
    tabLabelKey: "visualizer_page.tabs.image_to_3d",
    icon: Image,
  },
  {
    id: "TextImg3D",
    path: "textoaimagen",
    labelKey: "dashboard_layout.nav.text_to_image_to_3d",
    tabLabelKey: "visualizer_page.tabs.text_image_to_3d",
    icon: FileImage,
  },
  {
    id: "Unico3D",
    path: "unico3D",
    labelKey: "dashboard_layout.nav.unique_to_3d",
    tabLabelKey: "visualizer_page.tabs.unique_to_3d",
    icon: Cube,
  },
  {
    id: "MultiImagen3D",
    path: "multiimagen3D",
    labelKey: "dashboard_layout.nav.multi_image_to_3d",
    tabLabelKey: "visualizer_page.tabs.multi_image_to_3d",
    icon: Images,
  },
  {
    id: "Boceto3D",
    path: "boceto3D",
    labelKey: "dashboard_layout.nav.sketch_to_3d",
    tabLabelKey: "visualizer_page.tabs.sketch_to_3d",
    icon: Scribble,
  },
  {
    id: "Retexturize3D",
    path: "retexturizar",
    labelKey: "dashboard_layout.nav.retexturize_3d",
    tabLabelKey: "visualizer_page.tabs.retexturize_3d",
    icon: PaintBrush,
  },
];

export const GENERATION_MAP = GENERATION_TYPES.reduce((acc, type) => {
  acc[type.id] = type;
  return acc;
}, {});