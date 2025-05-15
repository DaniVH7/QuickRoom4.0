import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

const RoomFilters = ({ onFilterChange }) => {
  const defaultFilters = {
    precio: { min: '', max: '' },
    disponibilidad: '',
    amueblado: false,
    internet: false,
    agua: false,
    luz: false,
    vigilancia: false,
    cocina: false,
    bano_compartido: false,
    cuarto_compartido: false,
    tipo_condominio: '',
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('precio.')) {
      const pricePart = name.split('.')[1];
      setFilters((prev) => ({
        ...prev,
        precio: {
          ...prev.precio,
          [pricePart]: value,
        },
      }));
    } else if (type === 'checkbox') {
      setFilters((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
    // setIsExpanded(false); // opcional: colapsar después de aplicar
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center text-[#5C9FB9] font-semibold">
          <Filter size={18} className="mr-2" />
          <span>Filtros</span>
        </div>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="precio.min"
                  value={filters.precio.min}
                  onChange={handleInputChange}
                  placeholder="Mínimo"
                  className="w-full p-2 text-sm border rounded focus:ring-[#5C9FB9] focus:border-[#5C9FB9]"
                />
                <input
                  type="number"
                  name="precio.max"
                  value={filters.precio.max}
                  onChange={handleInputChange}
                  placeholder="Máximo"
                  className="w-full p-2 text-sm border rounded focus:ring-[#5C9FB9] focus:border-[#5C9FB9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad</label>
              <select
                name="disponibilidad"
                value={filters.disponibilidad}
                onChange={handleInputChange}
                className="w-full p-2 text-sm border rounded focus:ring-[#5C9FB9] focus:border-[#5C9FB9]"
              >
                <option value="">Todos</option>
                <option value="Disponible">Disponible</option>
                <option value="Ocupado">Ocupado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de condominio</label>
              <select
                name="tipo_condominio"
                value={filters.tipo_condominio}
                onChange={handleInputChange}
                className="w-full p-2 text-sm border rounded focus:ring-[#5C9FB9] focus:border-[#5C9FB9]"
              >
                <option value="">Todos</option>
                <option value="Casa">Casa</option>
                <option value="Edificio">Edificio</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Servicios incluidos</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
              {[
                'amueblado',
                'internet',
                'agua',
                'luz',
                'vigilancia',
                'cocina',
                'bano_compartido',
                'cuarto_compartido',
              ].map((key) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    name={key}
                    checked={filters[key]}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#5C9FB9] focus:ring-[#5C9FB9] border-gray-300 rounded"
                  />
                  <label htmlFor={key} className="ml-2 text-sm text-gray-700">
                    {key.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              Restablecer
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#5C9FB9] text-white rounded-md text-sm hover:bg-[#4A8CA3] transition-colors"
            >
              Aplicar filtros
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RoomFilters;
