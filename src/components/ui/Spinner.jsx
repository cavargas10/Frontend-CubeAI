export const Spinner = () => {
  return (
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-morado-gradient"></div>
  );
};

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[200] flex justify-center items-center bg-white/80 dark:bg-principal/90 backdrop-blur-md">
      <Spinner />
    </div>
  );
};