import { X, MapPin, DollarSign, Calendar, Users, Briefcase } from "lucide-react";

interface JobDetailsModalProps {
  job: any;
  onClose: () => void;
}

export default function JobDetailsModal({ job, onClose }: JobDetailsModalProps) {
  // Helpers
  const getModalityText = (modality: any) => {
    if (modality === 1 || modality === '1') return 'Presencial';
    if (modality === 2 || modality === '2') return 'Remoto';
    if (modality === 3 || modality === '3') return 'Híbrido';
    return 'No especificada';
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 dark:bg-gray-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-300">
      {/* Header / Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg text-gray-800">Detalles de la Oferta</h1>
        <div className="w-10"></div> {/* Spacer to center title */}
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 bg-blue-50 text-[#2e3192] px-3 py-1.5 rounded-lg text-sm font-semibold">
                <Briefcase className="w-4 h-4" />
                <span>{job.company_name || 'Empresa'}</span>
              </div>
              {job.match_score && (
                <div className="bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-bold">
                  {Math.round(job.match_score * 100)}% Match
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {job.title || job.job_title || 'Vacante'}
            </h2>

            <div className="space-y-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <MapPin className="w-5 h-5 mr-3 shrink-0 text-gray-400" />
                <span>{job.location || job.company_location || 'Lima'} <span className="text-[#8c52ff] font-medium ml-1 text-sm bg-purple-50 px-2 py-0.5 rounded">{getModalityText(job.modality)}</span></span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <DollarSign className="w-5 h-5 mr-3 shrink-0 text-gray-400" />
                <span>
                  {job.salary_min && job.salary_max ? `S/ ${job.salary_min} - S/ ${job.salary_max}` : 
                   job.approximated_salary ? `S/ ${job.approximated_salary}` : 'Sueldo a tratar'}
                </span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Calendar className="w-5 h-5 mr-3 shrink-0 text-gray-400" />
                <span>Publicado recientemente</span>
              </div>
            </div>
          </div>

          {/* Habilidades Requeridas */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Habilidades Requeridas</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: any, idx: number) => (
                  <span key={idx} className="bg-[#f0edff] text-[#8c52ff] px-4 py-2 rounded-full text-sm font-semibold">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Descripción */}
          <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Descripción</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {job.description || 'Buscamos a una persona proactiva para unirse a nuestro equipo. Trabajarás en proyectos reales en un entorno colaborativo y dinámico.'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
