export const ModalBase = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 bg-white dark:bg-principal rounded-lg max-w-3xl mx-4 p-4 shadow-lg text-gray-900 dark:text-gray-100">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-gray-200 hover:bg-gray-300 dark:bg-black/20 dark:hover:bg-black/40 rounded-full transition-colors"
          aria-label="Cerrar modal"
        >
          <span className="text-gray-700 dark:text-white">✖</span>
        </button>
        {children}
      </div>
    </div>
  );
};