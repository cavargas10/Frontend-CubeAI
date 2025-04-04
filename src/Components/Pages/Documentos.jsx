import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Documentacion from "../ui/Documentacion";
import DocumentacionContent from "../ui/DocumentacionContent";
import Documento from "../ui/Documento";

export const Documentos = () => {
  return (
    <div className="z-auto sm:grid sm:grid-cols-[320px_1fr] h-screen">
      <div className=" fixed border-t-2 border-linea w-full mt-[64px]"></div>
      <nav className="sm:border-r-2 border-linea overflow-y-auto pt-14 ml-4 sm:ml-10">
        <Documentacion />
      </nav>
      <main className="overflow-y-auto sm:pt-24 px-10 bg-fondologin ">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={`/documentos/documento/empezar`} />}
          />
          <Route path="/documentos" element={<DocumentacionContent />} />
          <Route path="/documento/:slug" element={<Documento />} />
        </Routes>
      </main>
    </div>
  );
};