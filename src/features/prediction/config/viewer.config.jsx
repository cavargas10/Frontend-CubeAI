const baseConfig = {
  controls: {
    wireframe: true,
    rotate: true,
    texture: true,
    download: true,
  },
  orbitControlsConfig: {
    autoRotateSpeed: 2,
  },
};

export const viewerConfig = {
  Boceto3D: {
    ...baseConfig,
    downloadFilename: "boceto_a_3d.glb",
    initialCameraPosition: [0, 0, 1.5],
    orbitControlsConfig: {
      ...baseConfig.orbitControlsConfig,
      minDistance: 0.5,
      maxDistance: 2,
    },
    gridPosition: [0, -0.35, 0],
  },
  Imagen3D: {
    ...baseConfig,
    downloadFilename: "imagen_a_3d.glb",
    initialCameraPosition: [0, 0, -1.5],
    orbitControlsConfig: {
      ...baseConfig.orbitControlsConfig,
      minDistance: 0.5,
      maxDistance: 2,
    },
    gridPosition: [0, -0.5, 0],
  },
  MultiImagen3D: {
    ...baseConfig,
    downloadFilename: "multi_imagen_a_3d.glb",
    initialCameraPosition: [0, 0,-1.5],
    orbitControlsConfig: {
      ...baseConfig.orbitControlsConfig,
      minDistance: 0.5,
      maxDistance: 1.5,
    },
    gridPosition: [0, -0.35, 0],
  },
  TextImg3D: {
    ...baseConfig,
    downloadFilename: "texto_img_a_3d.glb",
    initialCameraPosition: [0, 0, -1.5],
    orbitControlsConfig: {
      ...baseConfig.orbitControlsConfig,
      minDistance: 0.5,
      maxDistance: 1.5,
    },
    gridPosition: [0, -0.35, 0],
  },
  Texto3D: {
    ...baseConfig,
    downloadFilename: "texto_a_3d.glb",
    initialCameraPosition: [0, 0, -1.5],
    orbitControlsConfig: {
      ...baseConfig.orbitControlsConfig,
      minDistance: 0.5,
      maxDistance: 2,
    },
    gridPosition: [0, -0.5, 0],
  },
  Unico3D: {
    ...baseConfig,
    downloadFilename: "unico_a_3d.glb",
    initialCameraPosition: [0, 0.5, -1.5],
    orbitControlsConfig: {
      ...baseConfig.orbitControlsConfig,
      minDistance: 0.2,
      maxDistance: 2.0,
    },
    gridPosition: [0, -0.5, 0],
  },
  Retexturize3D: {
    ...baseConfig,
    downloadFilename: "modelo_retexturizado.glb",
    initialCameraPosition: [0, 0.5, -1.5],
    orbitControlsConfig: {
      ...baseConfig.orbitControlsConfig,
      minDistance: 0.2,
      maxDistance: 2.0,
    },
    gridPosition: [0, -0.5, 0],
  },
  default: {
    ...baseConfig,
    downloadFilename: "modelo_3d.glb",
    initialCameraPosition: [0, 0, -1.7],
    orbitControlsConfig: { ...baseConfig.orbitControlsConfig, minDistance: 0.5, maxDistance: 3 },
    gridPosition: [0, -0.5, 0],
  }
};