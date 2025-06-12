import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import client from '../../../config/client'; 
import { GET_HYGRAPH } from '../../../lib/hygraph/queries'; 
import { useTranslation } from 'react-i18next';

const DocumentationContext = createContext();

export const useDocumentation = () => {
  const context = useContext(DocumentationContext);
  if (!context) {
    throw new Error('useDocumentation must be used within a DocumentationProvider');
  }
  return context;
};

export const DocumentationProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);
  const [flatDocs, setFlatDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentLanguage = i18n.language || 'es';
        const variables = {
          locales: [currentLanguage, 'es']
        };
        
        const data = await client.request(GET_HYGRAPH, variables);
        
        setCategorias(data.categorias || []);
        
        const flattened = (data.categorias || []).flatMap(categoria => 
          (categoria.documentos || []).map(doc => ({
            slug: doc.slug,
            titulo: doc.titulo,
            categoriaSlug: categoria.slug, 
            categoriaTitulo: categoria.titulo 
          }))
        );
        setFlatDocs(flattened);

      } catch (err) {
        console.error("Error fetching documentation data:", err);
        setError("Error al cargar la documentación.");
        setCategorias([]);
        setFlatDocs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [i18n.language]); 

  const value = useMemo(() => ({
    categorias,
    flatDocs,
    loading,
    error,
  }), [categorias, flatDocs, loading, error]);

  return (
    <DocumentationContext.Provider value={value}>
      {children}
    </DocumentationContext.Provider>
  );
};