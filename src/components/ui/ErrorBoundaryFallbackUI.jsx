import React from 'react';
import { useTranslation } from 'react-i18next';

export const ErrorBoundaryFallbackUI = ({ error, errorInfo }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-fondologin text-white p-8">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h1 className="text-3xl font-bold mb-2 text-red-400">{t('error_boundary.title')}</h1>
      <p className="text-lg text-gray-300 mb-6 text-center">
        {t('error_boundary.subtitle')}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
      >
        {t('error_boundary.button')}
      </button>

      {import.meta.env.DEV && error && (
        <details className="mt-6 text-left bg-principal p-4 rounded-md border border-linea w-full max-w-2xl overflow-auto">
          <summary className="cursor-pointer font-semibold text-gray-400">{t('error_boundary.details_summary')}</summary>
          <pre className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">
            {error.toString()}
            <br />
            {errorInfo && errorInfo.componentStack}
          </pre>
        </details>
      )}
    </div>
  );
};