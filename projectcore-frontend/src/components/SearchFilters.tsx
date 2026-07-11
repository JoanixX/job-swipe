import { useState } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchFiltersProps {
  onClose: () => void;
  onApply: (filters: any) => void;
}

export default function SearchFilters({ onClose, onApply }: SearchFiltersProps) {
  const [minSalary, setMinSalary] = useState('1000');
  const [modalities, setModalities] = useState<string[]>(['Híbrido']);
  const [districts, setDistricts] = useState<string[]>(['La Molina']);

  const allModalities = ['Presencial', 'Remoto', 'Híbrido'];
  const allDistricts = ['La Molina', 'San Isidro', 'Miraflores'];

  const toggleModality = (mod: string) => {
    if (modalities.includes(mod)) {
      setModalities(modalities.filter(m => m !== mod));
    } else {
      setModalities([...modalities, mod]);
    }
  };

  const toggleDistrict = (dist: string) => {
    if (districts.includes(dist)) {
      setDistricts(districts.filter(d => d !== dist));
    } else {
      setDistricts([...districts, dist]);
    }
  };

  const handleClear = () => {
    setMinSalary('');
    setModalities([]);
    setDistricts([]);
  };

  const handleApply = () => {
    onApply({
      minSalary,
      modalities,
      districts
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-y-auto"
    >
      {/* Header */}
      <div className="bg-white py-4 px-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Filtros de Búsqueda</h2>
        <button onClick={handleClear} className="text-sm font-medium text-gray-600 hover:text-gray-900">
          Limpiar
        </button>
      </div>

      <div className="p-4 flex-1 space-y-4 pb-24">
        {/* Salario */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Salario Mínimo Esperado (S/)</h3>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-gray-500 text-lg">S/</span>
            <input 
              type="number" 
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="flex-1 text-lg text-gray-800 bg-transparent outline-none placeholder-gray-300"
              placeholder="Ej. 1500"
            />
          </div>
          <p className="text-gray-500 text-sm">
            Solo mostrar ofertas desde S/ {minSalary || '0'}
          </p>
        </div>

        {/* Modalidad */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-1">Modalidad de Trabajo</h3>
          <p className="text-gray-500 text-sm mb-4">Selecciona una o más opciones</p>
          <div className="flex flex-wrap gap-2">
            {allModalities.map(mod => {
              const isSelected = modalities.includes(mod);
              return (
                <button
                  key={mod}
                  onClick={() => toggleModality(mod)}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isSelected 
                      ? 'bg-[#5b6ae4] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{mod}</span>
                  {isSelected && <X className="w-4 h-4 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Distritos */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-1">Distritos de Lima</h3>
          <p className="text-gray-500 text-sm mb-4">Selecciona los distritos donde buscas trabajar</p>
          <div className="flex flex-wrap gap-2">
            {allDistricts.map(dist => {
              const isSelected = districts.includes(dist);
              return (
                <button
                  key={dist}
                  onClick={() => toggleDistrict(dist)}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isSelected 
                      ? 'bg-[#1e2f75] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{dist}</span>
                  {isSelected && <X className="w-4 h-4 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
          <p className="text-[#3b4b9b] text-sm leading-relaxed">
            <span className="font-bold">Resumen:</span> Buscando ofertas desde S/ {minSalary || '0'}, 
            modalidad {modalities.length > 0 ? modalities.join(', ') : 'Cualquiera'} en {districts.length} distrito(s)
          </p>
        </div>
      </div>

      {/* Botón Aplicar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <button 
          onClick={handleApply}
          className="w-full py-4 bg-[#1e2f75] hover:bg-[#15225a] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all duration-300"
        >
          Aplicar Cambios
        </button>
      </div>
    </motion.div>
  );
}
