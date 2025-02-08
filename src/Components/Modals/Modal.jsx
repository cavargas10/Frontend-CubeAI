import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Fondo oscuro */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Contenedor del modal */}
      <div className="relative z-50 bg-principal rounded-lg max-w-3xl mx-4 p-4 shadow-lg">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
        >
          ✖
        </button>

        {/* Contenido dinámico */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
