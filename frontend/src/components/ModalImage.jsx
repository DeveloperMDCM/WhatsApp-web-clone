// import './ModalImage.css'; // Importa los estilos CSS para el modal
import React, { useState, useRef, useEffect } from "react";
const ModalImage = ({ image, onClose, msg }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const modalImageRef = useRef(null);

  useEffect(() => {
    if (isZoomed) {
      const updateCursorPosition = (e) => {
        setCursorPosition({
          x: e.clientX - modalImageRef.current.offsetLeft,
          y: e.clientY - modalImageRef.current.offsetTop,
        });
      };

      window.addEventListener("mousemove", updateCursorPosition);
      return () => {
        window.removeEventListener("mousemove", updateCursorPosition);
      };
    }
  }, [isZoomed]);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const closeOnOutsideClick = (e) => {
    if (modalImageRef.current && !modalImageRef.current.contains(e.target)) {
      onClose();
    }
  };

  const modalImageClassName = isZoomed ? "modal-image zoomed" : "modal-image";

  return (
    <div className="modal flex flex-col" onClick={closeOnOutsideClick}>
      <span className="modal-close" onClick={onClose}>
        &times;
      </span>
      <img
        onClick={toggleZoom}
        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${image}`}
        alt={`Selected Image`}
        className={`${modalImageClassName} cursor-zoom-in`}
        ref={modalImageRef}
        style={{
          transformOrigin: `${cursorPosition.x}px ${cursorPosition.y}px`,
        }}
      />
      <p className="text-[#596770] mt-2 select-none">{isZoomed ? "" : msg}</p>
    </div>
  );
};

export default ModalImage;
