import { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "../features/auth/context/AuthContext";
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
  const { handleLogout, userData, refetchUserData } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="text-white">
      <HeaderDash
        userData={userData}
        toggleMenu={toggleMenu}
        menuOpen={menuOpen}
        handleLogout={handleLogout}
      />
      <main className="flex pt-16">
        <NavDash
          menuOpen={menuOpen}
          toggleMenu={toggleMenu}
          isCollapsed={isNavCollapsed}
          setIsCollapsed={setIsNavCollapsed}
          handleLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<Navigate to="visualizador" replace />} />
          <Route
            path="visualizador"
            element={<Visualizador isCollapsed={isNavCollapsed} />}
          />
          <Route
            path="tutorialdash"
            element={<TutorialDash isCollapsed={isNavCollapsed} />}
          />
          <Route
            path="configdash"
            element={
              <ConfigDash
                isCollapsed={isNavCollapsed}
                onUserDataUpdate={refetchUserData}
              />
            }
          />
          <Route
            path="imagen3D"
            element={<Imagen3DInput isCollapsed={isNavCollapsed} />}
          />
          <Route
            path="texto3D"
            element={<Texto3DInput isCollapsed={isNavCollapsed} />}
          />
          <Route
            path="textoaimagen"
            element={<TextImg3DInput isCollapsed={isNavCollapsed} />}
          />
          <Route
            path="unico3D"
            element={<Unico3DInput isCollapsed={isNavCollapsed} />}
          />
          <Route
            path="multiimagen3D"
            element={<MultiImagen3DInput isCollapsed={isNavCollapsed} />}
          />
          <Route
            path="boceto3D"
            element={<Boceto3DInput isCollapsed={isNavCollapsed} />}
          />
          <Route path="*" element={<Navigate to="visualizador" replace />} />
        </Routes>
      </main>
    </div>
  );
};
