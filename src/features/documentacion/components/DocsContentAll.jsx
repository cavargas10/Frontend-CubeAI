import { useDocumentation } from "../context/DocumentationContext"; 

export const DocsContentAll = () => {
  const { categorias, loading, error } = useDocumentation();

  if (loading) {
    return <div className="p-4 text-white animate-pulse">Cargando todos los documentos...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-400">Error al cargar documentos: {error}</div>;
  }

  if (!categorias || categorias.length === 0) {
    return <div className="p-4 text-gray-400">No hay documentos para mostrar.</div>;
  }

  return (
    <div className="prose prose-invert max-w-none p-4"> 
      {categorias.map((categoria) => (
        <div key={categoria.slug} className="mb-8">
          <h2 className="text-3xl font-bold border-b border-linea/30 pb-2 mb-4">{categoria.titulo}</h2>
          {categoria.documentos.map((documento) => (
            <section key={documento.slug} id={documento.slug} className="mb-6">
              <h3 className="text-2xl font-semibold mb-2">{documento.titulo}</h3>
              <div
                dangerouslySetInnerHTML={{ __html: documento.contenido.html }}
              />
            </section>
          ))}
        </div>
      ))}
    </div>
  );
};