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
      <div className=" fixed border-t-2 border-linea w-full "></div>
      <div className="grid sm:grid-cols-7 xl:grid-cols-12 mt-[70px] list-none text-white    sm:min-h-screen ">
        <nav className="sm:col-span-2 sm:ml-11 ml-3 mt-2   sm:m-0  sm:border-r2 sm:border-r-2 sm:border-linea  ">
          <div className="sm:fixed ">
            <Documentacion />
          </div>
        </nav>

        <main className="sm:col-span-5 xl:col-span-10 sm:pt-10  bg-fondologin xl:px-20 sm:px-10 pt-3  col-span-3  px-3">
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