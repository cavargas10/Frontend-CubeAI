import { Outlet, useLocation } from "react-router-dom";
import { DocsSidebar } from "../features/documentacion/components/DocsSidebar";

export const DocsLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-1 min-h-0">
      <nav
        className="
        sm:w-64 md:w-72 lg:w-80
        flex-shrink-0
        sm:h-[calc(100vh-4rem)]
        sm:sticky sm:top-16
        border-r-0 sm:border-r-2 border-linea/50
        z-10
        bg-fondologin
        overflow-y-auto custom-scrollbar
      "
      >
        <DocsSidebar />
      </nav>

      <main
        className="
        flex-grow
        overflow-y-auto custom-scrollbar
        px-6 md:px-8 lg:px-12 py-8 md:py-10
        scroll-pt-[65px]
      "
      >
        <Outlet key={location.pathname} />
      </main>
    </div>
  );
};