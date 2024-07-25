import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Documentacion from "../Ui/Documentacion";
import DocumentacionContent from "../Ui/DocumentacionContent";
import Documento from "../Ui/Documento";

export const Documentos = () => {
  return (
    <div className="sm:grid sm:grid-cols-[275px_1fr] h-screen   ">
      <div className=" fixed border-t-2 border-linea w-full mt-[70px]"></div>
      <nav className="border-r-2 border-linea overflow-y-auto pt-20 ml-4 sm:ml-10 px-4">
        <Documentacion />
      </nav>
      <main className="overflow-y-auto sm:pt-28 px-10 bg-fondologin ">
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