import { Navigate } from 'react-router-dom';
import { useDocumentation } from '../context/DocumentationContext';
import { Loading } from '../../../App'; 

export const DocsIndexRedirect = () => {
  const { flatDocs, loading } = useDocumentation();

  if (loading) {
    return <Loading />;
  }

  const firstDocSlug = flatDocs?.[0]?.slug || 'empezar';
  
  return <Navigate to={`/documentos/documento/${firstDocSlug}`} replace />;
};