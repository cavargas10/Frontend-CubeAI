import { Navigate } from 'react-router-dom';
import { useDocumentation } from '../context/DocumentationContext';
import { PageLoader } from '../../../components/ui/Spinner'; 

export const DocsIndexRedirect = () => {
  const { flatDocs, loading } = useDocumentation();

  if (loading) {
    return <PageLoader />;
  }

  const firstDocSlug = flatDocs?.[0]?.slug;
  if (!firstDocSlug) {
      return <Navigate to="/documentos" replace />;
  }
  
  return <Navigate to={`/documentos/documento/${firstDocSlug}`} replace />;
};