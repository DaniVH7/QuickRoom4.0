import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home, Droplet, Zap, Wifi, Shield, UtensilsCrossed,
  Bath, Users, DollarSign, MapPin
} from 'lucide-react';

const RoomCard = ({ room }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getImageUrls = () => {
    if (!room.fotografia_url) return [];
    return room.fotografia_url.split(',');
  };

  const images = getImageUrls();

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) return price;
    return `$${numericPrice.toLocaleString('es-MX')}`;
  };

  const getAmenityIcon = (service, value) => {
    if (value !== 'Si') return null;

    const iconSize = 16;
    const iconClass = "text-[#5C9FB9]";

    switch (service) {
      case 'amueblado':
        return <Home size={iconSize} className={iconClass} title="Amueblado" />;
      case 'agua':
        return <Droplet size={iconSize} className={iconClass} title="Agua" />;
      case 'luz':
        return <Zap size={iconSize} className={iconClass} title="Luz" />;
      case 'internet':
        return <Wifi size={iconSize} className={iconClass} title="Internet" />;
      case 'vigilancia':
        return <Shield size={iconSize} className={iconClass} title="Vigilancia" />;
      case 'cocina':
        return <UtensilsCrossed size={iconSize} className={iconClass} title="Cocina" />;
      case 'baño_compartido':
        return <Bath size={iconSize} className={iconClass} title="Baño compartido" />;
      case 'cuarto_compartido':
        return <Users size={iconSize} className={iconClass} title="Cuarto compartido" />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link to={`/room/${room.id_cuarto}`}>
        <div className="relative h-48 overflow-hidden">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex]}
                alt={`Cuarto ${room.id_cuarto}`}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.preventDefault(); prevImage(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 rounded-full p-1 text-white hover:bg-opacity-50"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); nextImage(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 rounded-full p-1 text-white hover:bg-opacity-50"
                  >
                    &gt;
                  </button>
                </>
              )}

              <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${
                room.disponibilidad === 'Disponible'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {room.disponibilidad}
              </span>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-500">No hay imágenes disponibles</p>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {room.tipo_condominio} - Piso {room.piso}
          </h3>
          <span className="text-lg font-bold text-[#5C9FB9]">
            {formatPrice(room.precio)}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{room.calle}, {room.municipio}, {room.estado}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(room)
            .filter(([key]) => ['amueblado', 'agua', 'luz', 'internet', 'vigilancia', 'cocina', 'baño_compartido', 'cuarto_compartido'].includes(key))
            .map(([key, value]) => {
              const icon = getAmenityIcon(key, value);
              return icon ? (
                <div key={key} className="tooltip">
                  {icon}
                  <span className="tooltiptext">{key.replace('_', ' ')}</span>
                </div>
              ) : null;
            })}
        </div>

        <Link
          to={`/room/${room.id_cuarto}`}
          className="block w-full text-center bg-[#5C9FB9] hover:bg-[#4A8CA3] text-white py-2 rounded-md transition-colors duration-300">
          Ver detalles
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
