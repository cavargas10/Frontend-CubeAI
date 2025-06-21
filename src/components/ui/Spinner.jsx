import { BrandedSpinner } from "./BrandedSpinner";

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[200] flex justify-center items-center bg-white/80 dark:bg-principal/90 backdrop-blur-md">
      <BrandedSpinner size="lg" />
    </div>
  );
};
