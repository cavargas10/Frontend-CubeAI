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
import { MultiImagen3D } from "../Prediction/MultiImagen3D";
import { Boceto3D } from "../Prediction/Boceto3D";
import axios from "axios";

export const Dashboard = ({
  prediction_img3d_result,
  prediction_text3d_result,
  prediction_textimg3d_result,
  prediction_unico3d_result,
  prediction_multiimg3d_result,
  setPrediction_img3d_result,
  setPrediction_text3d_result,
  setPrediction_textimg3d_result,
  setPrediction_unico3d_result,
  setPrediction_multiimg3d_result,
  error,
  loading,
  setLoading,
  handleLogout,
  user,
  setError,
  BASE_URL,
}) => {
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="text-white">
      <HeaderDash
        userData={userData}
        toggleMenu={toggleMenu}
        handleLogout={handleLogout}
      />

      <main className="flex mt-16 ">
        <NavDash
          menuOpen={menuOpen}
          toggleMenu={toggleMenu}
          isCollapsed={isNavCollapsed}
          setIsCollapsed={setIsNavCollapsed}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Visualizador
                prediction_img3d_result={prediction_img3d_result}
                prediction_text3d_result={prediction_text3d_result}
                prediction_textimg3d_result={prediction_textimg3d_result}
                prediction_unico3d_result={prediction_unico3d_result}
                prediction_multiimg3d_result={prediction_multiimg3d_result}
                BASE_URL={BASE_URL}
                error={error}
                isCollapsed={isNavCollapsed}
              />
            }
          />
          <Route
            path="visualizador/*"
            element={
              <Visualizador
                prediction_img3d_result={prediction_img3d_result}
                prediction_text3d_result={prediction_text3d_result}
                prediction_textimg3d_result={prediction_textimg3d_result}
                prediction_unico3d_result={prediction_unico3d_result}
                prediction_multiimg3d_result={prediction_multiimg3d_result}
                BASE_URL={BASE_URL}
                error={error}
                isCollapsed={isNavCollapsed}
              />
            }
          />
          <Route
            path="tutorialdash"
            element={<TutorialDash isCollapsed={isNavCollapsed} />}
          />
          <Route
            path="configdash"
            element={
              <ConfigDash
                user={user}
                BASE_URL={BASE_URL}
                userData={userData}
                updateUserData={updateUserData}
                isCollapsed={isNavCollapsed}
              />
            }
          />

          <Route
            path="imagen3D"
            element={
              <Imagen3D
                user={user}
                setPrediction_img3d_result={setPrediction_img3d_result}
                setLoading={setLoading}
                loading={loading}
                BASE_URL={BASE_URL}
                prediction_img3d_result={prediction_img3d_result}
                isCollapsed={isNavCollapsed}
              />
            }
          />

          <Route
            path="texto3D"
            element={
              <Texto3D
                user={user}
                setPrediction_text3d_result={setPrediction_text3d_result}
                setLoading={setLoading}
                loading={loading}
                BASE_URL={BASE_URL}
                prediction_text3d_result={prediction_text3d_result}
                isCollapsed={isNavCollapsed}
              />
            }
          />
          <Route
            path="textoaimagen"
            element={
              <TextImg3D
                user={user}
                setPrediction_textimg3d_result={setPrediction_textimg3d_result}
                setLoading={setLoading}
                loading={loading}
                BASE_URL={BASE_URL}
                prediction_textimg3d_result={prediction_textimg3d_result}
                isCollapsed={isNavCollapsed}
              />
            }
          />
          <Route
            path="unico3D"
            element={
              <Unico3D
                user={user}
                setPrediction_unico3d_result={setPrediction_unico3d_result}
                setLoading={setLoading}
                loading={loading}
                BASE_URL={BASE_URL}
                prediction_unico3d_result={prediction_unico3d_result}
                isCollapsed={isNavCollapsed}
              />
            }
          />

          <Route
            path="multiimagen3D"
            element={
              <MultiImagen3D
                user={user}
                setPrediction_img3d_result={setPrediction_multiimg3d_result}
                setLoading={setLoading}
                loading={loading}
                BASE_URL={BASE_URL}
                prediction_img3d_result={prediction_multiimg3d_result}
                isCollapsed={isNavCollapsed}
              />
            }
          />

          <Route
            path="boceto3D"
            element={
              <Boceto3D
                user={user}
                setPrediction_img3d_result={setPrediction_img3d_result}
                setLoading={setLoading}
                loading={loading}
                BASE_URL={BASE_URL}
                prediction_img3d_result={prediction_img3d_result}
                isCollapsed={isNavCollapsed}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
};
