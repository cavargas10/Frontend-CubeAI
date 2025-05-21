# Instant3D - Plataforma Web para Generación de Modelos 3D con IA (Proyecto de Tesis UTPL) 🚀

**Instant3D** es un proyecto de tesis desarrollado para la Universidad Técnica Particular de Loja (UTPL). Consiste en una plataforma web que permite a los usuarios transformar diversas entradas (texto, imágenes, bocetos) en modelos 3D mediante el uso de Inteligencia Artificial. El frontend de la aplicación está construido con React, Vite y Tailwind CSS.

**Proyecto desplegado en:** [https://instant3d.vercel.app/](https://instant3d.vercel.app/)

## 🎓 Propósito del Proyecto

Este proyecto tiene como objetivo principal investigar y desarrollar una solución accesible para la creación de contenido 3D, democratizando el acceso a herramientas de modelado mediante la aplicación de técnicas de Inteligencia Artificial. Busca facilitar a usuarios, tanto técnicos como no técnicos, la generación de activos 3D a partir de conceptos simples.

## ✨ Funcionalidades Principales

*   **Múltiples Métodos de Generación 3D con IA:**
    *   **Texto a 3D:** Genera modelos a partir de descripciones textuales.
    *   **Imagen a 3D:** Convierte una imagen 2D en un modelo 3D.
    *   **Texto a Imagen a 3D:** Proceso en dos etapas que primero genera una imagen desde texto y luego la convierte a 3D.
    *   **Múltiples Imágenes a 3D:** Utiliza vistas frontal, lateral y trasera para reconstruir un objeto 3D.
    *   **Boceto a 3D:** Permite dibujar en un lienzo interactivo y convertir el boceto en un modelo 3D.
    *   **Único a 3D:** Método especializado para la generación de objetos 3D a partir de una sola imagen con características particulares.
*   **Sistema de Autenticación de Usuarios:**
    *   Registro y inicio de sesión con correo electrónico y contraseña.
    *   Autenticación mediante Google.
    *   Procesos de verificación de correo y restablecimiento de contraseña.
*   **Dashboard Personalizado para Usuarios:**
    *   **Visualizador de Objetos:** Galería personal para explorar, gestionar y descargar los modelos 3D generados, con filtros por tipo de generación.
    *   **Tutoriales:** Sección con videos instructivos (contenido dinámico desde Hygraph) para guiar al usuario en el uso de la plataforma.
    *   **Configuración de Perfil:** Permite al usuario actualizar su nombre, foto de perfil y gestionar su cuenta.
*   **Visualizador 3D Interactivo:**
    *   Renderizado de modelos en formato `.glb`.
    *   Controles para rotación, zoom y paneo.
    *   Opciones para visualizar la malla (wireframe) y aplicar/quitar texturas.
    *   Funcionalidad de descarga para modelos 3D y texturas asociadas.
    *   Iluminación realista mediante entorno HDR.
*   **Sección de Documentación:**
    *   Guías y documentación técnica sobre el uso de la plataforma y los modelos de IA (contenido gestionado desde Hygraph).
*   **Interfaz de Usuario Moderna y Responsiva:**
    *   Desarrollada con Tailwind CSS y componentes de Flowbite, asegurando una experiencia de usuario óptima en diversos dispositivos.
*   **Manejo de Estado con React Context API:**
    *   Gestión centralizada para el estado de autenticación y los resultados de las predicciones.

## 🛠️ Tecnologías Utilizadas (Frontend)

*   **Framework Principal:** React 18+
*   **Herramienta de Construcción:** Vite
*   **Lenguaje:** JavaScript (JSX)
*   **Estilos:** Tailwind CSS, Flowbite, PostCSS
*   **Enrutamiento:** React Router DOM v6
*   **Gestión de Estado:** React Context API
*   **Renderizado 3D:** Three.js, @react-three/fiber, @react-three/drei
*   **Autenticación (Frontend):** Firebase Authentication
*   **CMS (Contenido Dinámico):** Hygraph (para tutoriales y documentación)
*   **Cliente HTTP:** Axios (para comunicación con el backend de IA)
*   **Animaciones:** Framer Motion
*   **Efectos Visuales:** tsparticles
*   **Iconografía:** Phosphor Icons

## 📁 Estructura del Proyecto (Frontend)

La estructura del proyecto está organizada para facilitar la modularidad y escalabilidad:

Frontend-CubeAI/
├── public/ # Archivos estáticos
├── src/
│ ├── assets/ # Imágenes, modelos HDR, etc.
│ ├── components/ # Componentes UI genéricos (modales, botones)
│ ├── config/ # Configuración (Firebase, cliente Hygraph)
│ ├── features/ # Módulos funcionales principales:
│ │ ├── auth/ # Autenticación
│ │ ├── dashboard/ # Dashboard del usuario
│ │ ├── documentacion/# Sección de documentación
│ │ └── prediction/ # Lógica de generación 3D
│ ├── layouts/ # Estructuras de página (Público, Dashboard, Docs)
│ ├── lib/ # Librerías auxiliares (queries Hygraph)
│ ├── pages/ # Páginas principales (HomePage, TutorialsPage)
│ ├── App.jsx # Componente raíz y enrutador principal
│ ├── main.jsx # Punto de entrada de React
│ └── index.css # Estilos globales
├── .env.example # Ejemplo de archivo de variables de entorno
├── vite.config.js # Configuración de Vite
├── tailwind.config.js # Configuración de Tailwind CSS
└── README.md # Este archivo

## ⚙️ Configuración del Entorno de Desarrollo

Para ejecutar este proyecto localmente, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone https://[URL_DE_TU_REPOSITORIO_GIT_SI_APLICA] Frontend-CubeAI
    cd Frontend-CubeAI
    ```

2.  **Crea un archivo `.env`** en la raíz del proyecto a partir del `.env.example` (si lo tienes) o directamente con las siguientes variables:
    ```env
    # URL de tu instancia de Hygraph
    VITE_HYGRAPH_URL=TU_HYGRAPH_ENDPOINT
    VITE_HYGRAPH_PERMANENTAUTH_TOKEN=TU_HYGRAPH_TOKEN

    # Configuración de Firebase
    VITE_FIREBASE_API_KEY=TU_FIREBASE_API_KEY
    VITE_FIREBASE_AUTH_DOMAIN=TU_FIREBASE_AUTH_DOMAIN
    # ... (resto de variables de Firebase)
    VITE_FIREBASE_APP_ID=TU_FIREBASE_APP_ID

    # URL base de tu API Backend (donde se procesan las predicciones)
    VITE_BASE_URL=URL_DE_TU_BACKEND
    ```
    **Nota:** Estas claves son sensibles y necesarias para la conexión con los servicios externos.

3.  **Instala las dependencias:**
    ```bash
    npm install
    ```

4.  **Ejecuta el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en [http://localhost:5173](http://localhost:5173) (o el puerto que indique Vite).

## 🚀 Despliegue

El proyecto está actualmente desplegado en Vercel y accesible en:
[https://instant3d.vercel.app/](https://instant3d.vercel.app/)

La configuración de Vercel (`vercel.json`) maneja las reescrituras necesarias para el enrutamiento de la SPA.

## 👨‍💻 Autor

*   **Carlos Andrés Vargas Ramírez**
*   Estudiante de Ingenieria en Sistemas Informáticos y Computación - Universidad Técnica Particular de Loja (UTPL)

## 📄 Licencia

Este proyecto se presenta como parte de un trabajo de tesis y no está destinado a la distribución o uso comercial sin autorización explícita.
