import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { DocsSidebar } from "../features/documentacion/components/DocsSidebar";
import { DocsContentAll } from "../features/documentacion/components/DocsContentAll";
import { DocsViewer } from "../features/documentacion/components/DocsViewer";

export const DocsLayout = () => {
  return (
    <div className="z-auto sm:grid sm:grid-cols-[320px_1fr] h-screen">
      <nav className="sm:border-r-2 border-linea overflow-y-auto pt-14 ml-4 sm:ml-10">
        <DocsSidebar />
      </nav>
      <main className="overflow-y-auto sm:pt-24 px-10 bg-fondologin">
        <Routes>
          <Route path="/" element={<Navigate to="/documentos/documento/empezar" />} />
          <Route path="documentos" element={<DocsContentAll />} />
          <Route path="documento/:slug" element={<DocsViewer />} />
        </Routes>
      </main>
    </div>
  );
};