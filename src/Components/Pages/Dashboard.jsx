import React from "react";
import { NavDash } from "../Dashboard/NavDash";
import { HeaderDash } from "../Dashboard/HeaderDash";
import { Visualizador } from "../Dashboard/Visualizador";
import { TutorialDash } from "../Dashboard/TutorialDash";
import { DocumDash } from "../Dashboard/DocumDash";
import { Route, Routes } from "react-router-dom";
import { ConfigDash } from "../Dashboard/ConfigDash";
import { PredictionForm } from "../prediction/PredictionForm";
import { Texto3D } from "../prediction/Texto3D";
import { TextImg3D } from "../prediction/TextImg3D";
import { Unico3D } from "../prediction/Unico3D";

export const Dashboard = ({
  userData,
  predictionResult,
  setPredictionResult,
  error,
  loading,
  setLoading,
  handleLogout,
  user,
  setError,
  BASE_URL,
}) => {
  return (
    <div className="text-white ">
      <HeaderDash userData={userData} />

      <main
        className="flex  mt-16"
      >
        <NavDash handleLogout={handleLogout} />
        <Routes>
          <Route
            path="/"
            element={
              <Visualizador predictionResult={predictionResult} error={error} />
            }
          />
          <Route
            path="visualizador/*"
            element={
              <Visualizador predictionResult={predictionResult} error={error} />
            }
          />
          <Route path="tutorialdash" element={<TutorialDash />} />
          <Route path="documdash" element={<DocumDash />} />
          <Route
            path="configdash"
            element={
              <ConfigDash user={user} BASE_URL={BASE_URL} userData={userData} />
            }
          />

          <Route
            path="imagen3D"
            element={
              <PredictionForm
                user={user}
                setPredictionResult={setPredictionResult}
                setLoading={setLoading}
                setError={setError}
                loading={loading}
                BASE_URL={BASE_URL}
                predictionResult={predictionResult}
              />
            }
          />

          <Route
            path="texto3D"
            element={
              <Texto3D
                user={user}
                setPredictionResult={setPredictionResult}
                setLoading={setLoading}
                setError={setError}
                loading={loading}
                BASE_URL={BASE_URL}
                predictionResult={predictionResult}
              />
            }
          />
          <Route
            path="textoaimagen"
            element={
              <TextImg3D
                user={user}
                setPredictionResult={setPredictionResult}
                setLoading={setLoading}
                setError={setError}
                loading={loading}
                BASE_URL={BASE_URL}
                predictionResult={predictionResult}
              />
            }
          />
          <Route
            path="unico3D"
            element={
              <Unico3D
                user={user}
                setPredictionResult={setPredictionResult}
                setLoading={setLoading}
                setError={setError}
                loading={loading}
                BASE_URL={BASE_URL}
                predictionResult={predictionResult}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
};
