import { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "../features/auth/context/AuthContext";
import { NavDash } from "../features/dashboard/layout/NavDash";
import { HeaderDash } from "../features/dashboard/layout/HeaderDash";
import { Visualizador } from "../features/dashboard/components/Visualizador";
import { TutorialDash } from "../features/dashboard/components/TutorialDash";
import { ConfigDash } from "../features/dashboard/components/ConfigDash";
import { GENERATION_TYPES } from "../features/prediction/config/generationTypes";
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

  const inputComponentMap = {
    Texto3D: Texto3DInput,
    Imagen3D: Imagen3DInput,
    TextImg3D: TextImg3DInput,
    Unico3D: Unico3DInput,
    MultiImagen3D: MultiImagen3DInput,
    Boceto3D: Boceto3DInput,
  };

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

          {GENERATION_TYPES.map((type) => {
            const InputComponent = inputComponentMap[type.id];
            if (!InputComponent) return null;
            return (
              <Route
                key={type.id}
                path={type.path}
                element={<InputComponent isCollapsed={isNavCollapsed} />}
              />
            );
          })}

          <Route path="*" element={<Navigate to="visualizador" replace />} />
        </Routes>
      </main>
    </div>
  );
};
