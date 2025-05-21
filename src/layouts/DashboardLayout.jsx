import { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { usePredictions } from "../features/prediction/context/PredictionContext";
import { NavDash } from "../features/dashboard/layout/NavDash";
import { HeaderDash } from "../features/dashboard/layout/HeaderDash";
import { Visualizador } from "../features/dashboard/components/Visualizador";
import { TutorialDash } from "../features/dashboard/components/TutorialDash";
import { ConfigDash } from "../features/dashboard/components/ConfigDash";
import { Imagen3DInput } from "../features/prediction/components/input/Imagen3DInput";
import { Texto3DInput } from "../features/prediction/components/input/Texto3DInput";
import { TextImg3DInput } from "../features/prediction/components/input/TextImg3DInput";
import { Unico3DInput } from "../features/prediction/components/input/Unico3DInput";
import { MultiImagen3DInput } from "../features/prediction/components/input/MultiImagen3DInput";
import { Boceto3DInput } from "../features/prediction/components/input/Boceto3DInput";

export const DashboardLayout = () => {
  const { user, handleLogout, userData, refetchUserData } = useAuth();
  const predictions = usePredictions();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="text-white">
      <HeaderDash
        userData={userData}
        toggleMenu={toggleMenu}
        handleLogout={handleLogout}
      />
      <main className="flex mt-16">
        <NavDash
          menuOpen={menuOpen}
          toggleMenu={toggleMenu}
          isCollapsed={isNavCollapsed}
          setIsCollapsed={setIsNavCollapsed}
        />
        <Routes>
          <Route path="/" element={<Navigate to="visualizador" replace />} />
          <Route
            path="visualizador"
            element={
              <Visualizador isCollapsed={isNavCollapsed} />
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
                userData={userData}
                refetchUserData={refetchUserData}
                isCollapsed={isNavCollapsed}
              />
            }
          />
          <Route
            path="imagen3D"
            element={
              <Imagen3DInput
                user={user}
                isCollapsed={isNavCollapsed}
                setPrediction_img3d_result={
                  predictions.setPrediction_img3d_result
                }
                prediction_img3d_result={predictions.prediction_img3d_result}
              />
            }
          />
          <Route
            path="texto3D"
            element={
              <Texto3DInput
                user={user}
                isCollapsed={isNavCollapsed}
                setPrediction_text3d_result={
                  predictions.setPrediction_text3d_result
                }
                prediction_text3d_result={predictions.prediction_text3d_result}
              />
            }
          />
          <Route
            path="textoaimagen"
            element={
              <TextImg3DInput
                user={user}
                isCollapsed={isNavCollapsed}
                setPrediction_textimg3d_result={
                  predictions.setPrediction_textimg3d_result
                }
                prediction_textimg3d_result={
                  predictions.prediction_textimg3d_result
                }
              />
            }
          />
          <Route
            path="unico3D"
            element={
              <Unico3DInput
                user={user}
                isCollapsed={isNavCollapsed}
                setPrediction_unico3d_result={
                  predictions.setPrediction_unico3d_result
                }
                prediction_unico3d_result={
                  predictions.prediction_unico3d_result
                }
              />
            }
          />
          <Route
            path="multiimagen3D"
            element={
              <MultiImagen3DInput
                user={user}
                isCollapsed={isNavCollapsed}
                setPrediction_multiimg3d_result={
                  predictions.setPrediction_multiimg3d_result
                }
                prediction_multiimg3d_result={
                  predictions.prediction_multiimg3d_result
                }
              />
            }
          />
          <Route
            path="boceto3D"
            element={
              <Boceto3DInput
                user={user}
                isCollapsed={isNavCollapsed}
                setPrediction_boceto3d_result={
                  predictions.setPrediction_boceto3d_result
                }
                prediction_boceto3d_result={
                  predictions.prediction_boceto3d_result
                }
              />
            }
          />
          <Route path="*" element={<Navigate to="visualizador" replace />} />
        </Routes>
      </main>
    </div>
  );
};