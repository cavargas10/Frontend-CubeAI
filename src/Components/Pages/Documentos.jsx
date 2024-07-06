import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Documentacion from "../Ui/Documentacion";
import DocumentacionContent from "../Ui/DocumentacionContent";
import Documento from "../Ui/Documento";

export const Documentos = () => {
  return (
    <div className="">
      <div className=" fixed border-t-2 border-linea w-full"></div>
      <div className="grid grid-cols-12 mt-[70px] list-none text-white    min-h-screen ">
        <nav className="col-span-2 ml-11 border-r-2  border-linea ">
          <div className=" fixed ">
            <Documentacion />
          </div>
        </nav>

        <main className="col-span-10   bg-fondologin px-20 pt-10 ">
          <Routes>
            <Route
              path="/"
              element={<Navigate to={`/documentos/documento/titulo1`} />}
            />

            <Route path="/documentos" element={<DocumentacionContent />} />
            <Route path="/documento/:slug" element={<Documento />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
