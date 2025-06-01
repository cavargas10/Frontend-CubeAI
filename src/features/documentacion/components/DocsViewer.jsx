import { useEffect, useState, useRef } from "react"; 
import { useParams, Link } from "react-router-dom"; 
import client from "../../../config/client";
import { GET_HYGRAPH } from "../../../lib/hygraph/queries";

export const DocsViewer = () => {
  const { slug } = useParams();
  const [documento, setDocumento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setDocumento(null); 
      try {
        const data = await client.request(GET_HYGRAPH);
        const documentoEncontrado = data.categorias
          .flatMap((categoria) => categoria.documentos)
          .find((doc) => doc.slug === slug);

        if (documentoEncontrado) {
          setDocumento(documentoEncontrado);
        } else {
          setError(`Documento con slug "${slug}" no encontrado.`);
          console.warn(`Documento con slug "${slug}" no encontrado.`);
        }
      } catch (err) {
        console.error("Error fetching document data:", err);
        setError("Error al cargar el documento. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
      if (contentRef.current && contentRef.current.closest('main')) {
        contentRef.current.closest('main').scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setLoading(false);
      setError("No se especificó un documento para mostrar.");
    }
  }, [slug]);

  useEffect(() => {
    if (documento && !loading && contentRef.current) {
      const images = contentRef.current.querySelectorAll("img");
      images.forEach((img) => {
        img.setAttribute("loading", "lazy");
        img.setAttribute("alt", img.getAttribute("alt") || `Imagen de: ${documento.titulo}`);
      });
    }
  }, [documento, loading]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-4"> 
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-morado-gradient mb-4"></div>
        <p className="text-lg text-white">Cargando documento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-semibold text-red-400 mb-3">Error al Cargar</h2>
        <p className="text-white max-w-md">{error}</p>
        <Link
          to="/documentos/documento/empezar" 
          className="mt-8 inline-block px-6 py-2.5 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-lg hover:opacity-90 transition-opacity shadow-md"
        >
          Volver a la Documentación
        </Link>
      </div>
    );
  }

  if (!documento) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-4">
        <p className="text-xl text-white">Documento no disponible.</p>
        <Link
          to="/documentos/documento/empezar"
          className="mt-8 inline-block px-6 py-2.5 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-lg hover:opacity-90 transition-opacity shadow-md"
        >
          Ir a la Documentación
        </Link>
      </div>
    );
  }

  return (
    <article ref={contentRef} className="prose prose-invert w-full max-w-none mt-4">
      
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text "
          style={{textShadow: "0 0 15px theme('colors.morado-gradient / 30%'), 0 0 5px theme('colors.azul-gradient / 20%')"}}
      >
          {documento.titulo}
      </h1>
      <div
        dangerouslySetInnerHTML={{ __html: documento.contenido.html }}
      />
    </article>
  );
};