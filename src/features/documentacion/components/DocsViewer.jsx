import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDocumentation } from "../context/DocumentationContext";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { BrandedSpinner } from '../../../components/ui/BrandedSpinner';

export const DocsViewer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    categorias,
    flatDocs,
    loading: contextLoading,
    error: contextError,
  } = useDocumentation();
  const { t } = useTranslation();
  const [documento, setDocumento] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const contentRef = useRef(null);
  const [prevDoc, setPrevDoc] = useState(null);
  const [nextDoc, setNextDoc] = useState(null);
  const firstDocSlug = flatDocs?.[0]?.slug || "empezar";

  useEffect(() => {
    if (contextLoading) {
      setPageLoading(true);
      return;
    }
    if (contextError) {
      setPageLoading(false);
      setPageError(t("docs.sidebar.error"));
      console.error("Context error:", contextError);
      return;
    }

    setPageLoading(true);
    setPageError(null);
    setDocumento(null);
    setPrevDoc(null);
    setNextDoc(null);

    if (!slug) {
      setPageLoading(false);
      setPageError("No se especificó un documento para mostrar.");
      return;
    }

    if (
      !categorias ||
      categorias.length === 0 ||
      !flatDocs ||
      flatDocs.length === 0
    ) {
      setPageLoading(false);
      if (!contextLoading) {
        setPageError(
          `No se encontraron documentos. Documento con slug "${slug}" no se puede buscar.`
        );
      }
      return;
    }

    const documentoEncontrado = categorias
      .flatMap((categoria) => categoria.documentos)
      .find((doc) => doc.slug === slug);

    if (documentoEncontrado) {
      setDocumento(documentoEncontrado);

      const currentIndex = flatDocs.findIndex((doc) => doc.slug === slug);
      if (currentIndex !== -1) {
        if (currentIndex > 0) {
          setPrevDoc(flatDocs[currentIndex - 1]);
        }
        if (currentIndex < flatDocs.length - 1) {
          setNextDoc(flatDocs[currentIndex + 1]);
        }
      }
    } else {
      setPageError(`Documento con slug "${slug}" no encontrado.`);
    }
    setPageLoading(false);
  }, [slug, categorias, flatDocs, contextLoading, contextError, navigate, t]);

  useLayoutEffect(() => {
    if (!pageLoading && documento && contentRef.current) {
      const mainScrollableArea = contentRef.current.closest("main");
      if (mainScrollableArea) {
        mainScrollableArea.scrollTo({ top: 0, behavior: "instant" });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }
  }, [slug, pageLoading, documento]);

  useEffect(() => {
    if (documento && !pageLoading && contentRef.current) {
      const images = contentRef.current.querySelectorAll("img");
      images.forEach((img) => {
        img.setAttribute("loading", "lazy");
        img.setAttribute(
          "alt",
          img.getAttribute("alt") || `Imagen de: ${documento.titulo}`
        );
      });
    }
  }, [documento, pageLoading]);

  if (pageLoading || (contextLoading && !documento)) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-4">
        <BrandedSpinner size="md" />
        <p className="text-lg text-gray-700 dark:text-white mt-4">
          {t("docs.loading_view.title")}
        </p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-2xl font-semibold text-red-500 dark:text-red-400 mb-3">
          {t("docs.error_view.title")}
        </h2>
        <p className="text-gray-600 dark:text-white max-w-md">{pageError}</p>
        <Link
          to={`/documentos/documento/${firstDocSlug}`}
          className="mt-8 inline-block px-6 py-2.5 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-lg hover:opacity-90 transition-opacity shadow-md"
        >
          {t("docs.error_view.button_text")}
        </Link>
      </div>
    );
  }

  if (!documento) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-4">
        <p className="text-xl text-gray-700 dark:text-white">
          {t("docs.error_view.not_found_title")}
        </p>
        <Link
          to={`/documentos/documento/${firstDocSlug}`}
          className="mt-8 inline-block px-6 py-2.5 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-lg hover:opacity-90 transition-opacity shadow-md"
        >
          {t("docs.error_view.button_not_found")}
        </Link>
      </div>
    );
  }

  return (
    <article
      ref={contentRef}
      className="prose w-full max-w-none mt-4 dark:prose-invert"
    >
      <h1
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text"
        style={{
          textShadow:
            "0 0 15px rgba(147, 51, 234, 0.3), 0 0 5px rgba(59, 130, 246, 0.2)",
        }}
      >
        {documento.titulo}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: documento.contenido.html }} />
      {/* ✅ CORRECCIÓN APLICADA AQUÍ */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700/50 flex flex-col sm:flex-row justify-between items-stretch gap-4 not-prose">
        <div className="w-full sm:w-1/2">
          {prevDoc ? (
            <Link
              to={`/documentos/documento/${prevDoc.slug}`}
              className="nav-button group w-full flex items-center p-4 rounded-xl bg-gray-50 dark:bg-fondologin border border-gray-200 dark:border-slate-700/50 hover:bg-gray-100 dark:hover:bg-fondologin/80 hover:border-purple-500 dark:hover:border-purple-500/50 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-fondologin"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-purple-500/30 group-hover:border-purple-400 group-hover:bg-purple-500/10 transition-all mr-4">
                <ArrowLeft
                  size={20}
                  weight="bold"
                  className="text-purple-400 group-hover:text-purple-300 transition-colors"
                />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-purple-400 transition-colors uppercase tracking-wide">
                  {t("docs.viewer.previous")}
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-100 transition-colors truncate mt-0.5">
                  {prevDoc.titulo}
                </span>
              </div>
            </Link>
          ) : (
            <div className="w-full h-[72px] flex items-center justify-center rounded-xl bg-gray-100/50 dark:bg-fondologin/50 border border-gray-200/50 dark:border-slate-800/50">
              <span className="text-gray-500 dark:text-gray-600 text-sm">
                {t("docs.viewer.no_previous")}
              </span>
            </div>
          )}
        </div>
        <div className="w-full sm:w-1/2">
          {nextDoc ? (
            <Link
              to={`/documentos/documento/${nextDoc.slug}`}
              className="nav-button group w-full flex items-center justify-end p-4 rounded-xl bg-gray-50 dark:bg-fondologin border border-gray-200 dark:border-slate-700/50 hover:bg-gray-100 dark:hover:bg-fondologin/80 hover:border-blue-500 dark:hover:border-blue-500/50 hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-fondologin no-underline hover:no-underline"
            >
              <div className="flex flex-col min-w-0 flex-1 text-right">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-blue-400 transition-colors uppercase tracking-wide">
                  {t("docs.viewer.next")}
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-100 transition-colors truncate mt-0.5">
                  {nextDoc.titulo}
                </span>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-blue-500/30 group-hover:border-blue-400 group-hover:bg-blue-500/10 transition-all ml-4">
                <ArrowRight
                  size={20}
                  weight="bold"
                  className="text-blue-400 group-hover:text-blue-300 transition-colors"
                />
              </div>
            </Link>
          ) : (
            <div className="w-full h-[72px] flex items-center justify-center rounded-xl bg-gray-100/50 dark:bg-fondologin/50 border border-gray-200/50 dark:border-slate-800/50">
              <span className="text-gray-500 dark:text-gray-600 text-sm">
                {t("docs.viewer.no_next")}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
