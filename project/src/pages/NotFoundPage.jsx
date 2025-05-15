import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="bg-[#9FD1E5] text-white rounded-full p-6 mb-6">
        <Home size={64} />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">Página no encontrada</h2>
      
      <p className="text-gray-600 max-w-md mb-8">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      
      <Link 
        to="/"
        className="bg-[#5C9FB9] hover:bg-[#4A8CA3] text-white py-3 px-6 rounded-lg transition-colors inline-flex items-center"
      >
        <Home size={18} className="mr-2" />
        Regresar a inicio
      </Link>
    </div>
  );
};

export default NotFoundPage;