import { useEffect } from 'react';

export const useTheme = () => {
  useEffect(() => {
    // 1. Definimos la media query para detectar la preferencia del sistema.
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 2. Función para manejar el cambio de tema.
    const handleChange = () => {
      if (mediaQuery.matches) {
        // Si el sistema está en modo oscuro, añadimos la clase 'dark'.
        document.documentElement.classList.add('dark');
      } else {
        // Si no, la quitamos.
        document.documentElement.classList.remove('dark');
      }
    };

    // 3. Ejecutamos la función una vez al cargar el componente para establecer el tema inicial.
    handleChange();

    // 4. Añadimos un listener para que el tema cambie automáticamente si el usuario lo cambia en su sistema.
    mediaQuery.addEventListener('change', handleChange);

    // 5. Limpiamos el listener cuando el componente se desmonte para evitar memory leaks.
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez.
};