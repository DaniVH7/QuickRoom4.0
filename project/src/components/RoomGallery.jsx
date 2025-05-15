import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const RoomGallery = ({ images, onClose, fullScreen = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (images.length === 0) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${
        fullScreen ? 'fixed inset-0 z-50' : 'h-full w-full'
      }`}>
        <p className="text-gray-500">No hay imágenes disponibles</p>
        {fullScreen && onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
          >
            <X size={24} />
          </button>
        )}
      </div>
    );
  }

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div 
          className="relative max-w-4xl max-h-[80vh] w-full"
          onClick={(e) => e.stopPropagation()} 
        >
          <img 
            src={images[currentIndex]} 
            alt={`Imagen ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
          
          <div className="absolute bottom-4 left-0 right-0 text-center text-white">
            {currentIndex + 1} / {images.length}
          </div>
          
          <button 
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={24} />
          </button>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition-colors"
              aria-label="Cerrar galería"
            >
              <X size={24} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-100 rounded-lg">
      <img 
        src={images[currentIndex]} 
        alt={`Imagen ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />
      
      {images.length > 1 && (
        <>
          <button 
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-1 hover:bg-opacity-50 transition-opacity"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-1 hover:bg-opacity-50 transition-opacity"
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={20} />
          </button>
          
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

export default RoomGallery;
