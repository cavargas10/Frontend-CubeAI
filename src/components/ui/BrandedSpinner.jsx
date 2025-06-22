import logo from "../../assets/logo.webp";

export const BrandedSpinner = ({ size = "md", text }) => {
  const sizeClasses = {
    sm: { container: "w-24 h-24", logo: "w-12 h-12" },
    md: { container: "w-32 h-32", logo: "w-16 h-16" },
    lg: { container: "w-48 h-48", logo: "w-24 h-24" },
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`relative ${selectedSize.container} flex items-center justify-center`}
      >
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-azul-gradient animate-spin"></div>
        <div className="absolute inset-0 rounded-full border-4 border-b-transparent border-morado-gradient animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
        <div className="relative w-full h-full p-2 animate-pulse [animation-duration:2.5s]">
          <div className="w-full h-full rounded-full bg-white/50 dark:bg-principal/50 backdrop-blur-sm flex items-center justify-center">
            <img
              src={logo}
              alt="Loading..."
              className={`${selectedSize.logo} drop-shadow-[0_0_10px_rgba(102,102,255,0.25)] dark:drop-shadow-[0_0_15px_rgba(169,117,255,0.5)]`}
            />
          </div>
        </div>
      </div>
      {text && <p className="text-lg text-gray-500 dark:text-gray-400">{text}</p>}
    </div>
  );
};