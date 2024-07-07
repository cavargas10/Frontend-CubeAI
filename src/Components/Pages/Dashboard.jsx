import React, { useState, useEffect } from "react";
import { NavDash } from "../Dashboard/NavDash";
import { HeaderDash } from "../Dashboard/HeaderDash";
import { Visualizador } from "../Dashboard/Visualizador";
import { TutorialDash } from "../Dashboard/TutorialDash";
import { Route, Routes } from "react-router-dom";
import { ConfigDash } from "../Dashboard/ConfigDash";
import { Imagen3D } from "../Prediction/Imagen3D";
import { Texto3D } from "../Prediction/Texto3D";
import { TextImg3D } from "../Prediction/TextImg3D";
import { Unico3D } from "../Prediction/Unico3D";
import axios from "axios";

export const Dashboard = ({
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
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await user.getIdToken();
        const response = await axios.get(`${BASE_URL}/user_data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
        setError("Error al cargar los datos del usuario");
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user, BASE_URL, setError]);

  const updateUserData = (newData) => {
    setUserData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <div className="text-white">
      <HeaderDash userData={userData} />

      <main className="flex mt-16">
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
          <Route
            path="configdash"
            element={
              <ConfigDash
                user={user}
                BASE_URL={BASE_URL}
                userData={userData}
                updateUserData={updateUserData}
              />
            }
          />

          <Route
            path="imagen3D"
            element={
              <Imagen3D
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
