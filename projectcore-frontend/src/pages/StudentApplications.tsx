import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, Eye, Clock, CheckCircle2, XCircle } from 'lucide-react';
import StudentAppLayout from '../components/StudentAppLayout';
import { useUser } from '../lib/user-context';
import { useQuery } from '@tanstack/react-query';
import { agreementAPI, jobOfferAPI, companyAPI } from '../services/backend-api';

export default function StudentApplications() {
  const [_, setLocation] = useLocation();
  const { user } = useUser();
  const studentId = user?.profileData?.related_id || user?.id || 0;

  // 1. Fetch Agreements
  const { data: agreements = [], isLoading: isLoadingAgreements } = useQuery({
    queryKey: ['agreements', studentId],
    queryFn: () => agreementAPI.getByStudent(studentId),
    enabled: !!studentId
  });

  // 2. Fetch Job Offers and Companies for those agreements
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (agreements.length === 0) {
        setApplications([]);
        return;
      }
      
      setIsLoadingDetails(true);
      try {
        const appsWithDetails = await Promise.all(
          agreements.map(async (agreement) => {
            try {
              // Fetch job offer
              const jobOffer = await jobOfferAPI.getById(agreement.job_offer_id);
              // Fetch company
              let companyName = 'Empresa Desconocida';
              if (jobOffer.company_id) {
                const company = await companyAPI.getById(jobOffer.company_id);
                companyName = company.name || company.company_name || 'Empresa';
              }
              
              // Map status
              let statusLabel = 'Pendiente';
              if (agreement.status === 'pending') statusLabel = 'Pendiente';
              if (agreement.status === 'reviewing') statusLabel = 'En Revisión';
              if (agreement.status === 'accepted') statusLabel = 'Aceptado';
              if (agreement.status === 'rejected') statusLabel = 'No Seleccionado';
              
              return {
                id: agreement.id,
                role: jobOffer.title,
                company: companyName,
                dateApplied: new Date(agreement.start_date || agreement.created_at || Date.now()).toLocaleDateString(),
                dateUpdated: 'Recientemente',
                status: statusLabel,
              };
            } catch (err) {
              console.error("Error fetching details for agreement", agreement.id, err);
              return {
                id: agreement.id,
                role: `Oferta #${agreement.job_offer_id}`,
                company: 'Empresa',
                dateApplied: 'Desconocido',
                dateUpdated: 'Desconocido',
                status: 'Pendiente',
              };
            }
          })
        );
        setApplications(appsWithDetails);
      } catch (err) {
        console.error("Error fetching application details", err);
      } finally {
        setIsLoadingDetails(false);
      }
    };
    
    fetchDetails();
  }, [agreements]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'En Revisión': return <Eye className="w-4 h-4 mr-1" />;
      case 'Pendiente': return <Clock className="w-4 h-4 mr-1" />;
      case 'Aceptado': return <CheckCircle2 className="w-4 h-4 mr-1" />;
      case 'No Seleccionado': return <XCircle className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En Revisión': return 'text-[#2e3192] bg-blue-50 border border-blue-100';
      case 'Pendiente': return 'text-amber-500 bg-amber-50 border border-amber-100';
      case 'Aceptado': return 'text-green-500 bg-green-50 border border-green-100';
      case 'No Seleccionado': return 'text-red-500 bg-red-50 border border-red-100';
      default: return 'text-gray-500 bg-gray-50 border border-gray-100';
    }
  };

  const total = applications.length;
  const enRevision = applications.filter(a => a.status === 'En Revisión').length;
  const pendientes = applications.filter(a => a.status === 'Pendiente').length;
  const aceptados = applications.filter(a => a.status === 'Aceptado').length;

  return (
    <StudentAppLayout activePage="movimientos">
      
      {/* Header */}
      <div className="py-4 px-6 flex items-center bg-white sticky top-0 z-20 border-b border-gray-50">
        <button 
          onClick={() => setLocation('/matching')}
          className="mr-4 text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Mis Movimientos</h1>
      </div>
      
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-sm mb-1">Total</span>
            <span className="text-3xl font-bold text-[#2e3192]">{total}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-sm mb-1">En Revisión</span>
            <span className="text-3xl font-bold text-[#2e3192]">{enRevision}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-sm mb-1">Pendientes</span>
            <span className="text-3xl font-bold text-amber-500">{pendientes}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-sm mb-1">Aceptados</span>
            <span className="text-3xl font-bold text-green-500">{aceptados}</span>
          </div>
        </div>

        {/* Applications List */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Todas mis Postulaciones</h2>
          
          {(isLoadingAgreements || isLoadingDetails) ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-[#2e3192]/20 border-t-[#2e3192] rounded-full animate-spin"></div>
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="pr-4">
                      <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-1">{app.role}</h3>
                      <p className="text-gray-500 text-sm">{app.company}</p>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      {app.status}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
                    <span>Postulado: {app.dateApplied}</span>
                    <span>Actualizado: {app.dateUpdated}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center p-8 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 mb-4">No tienes postulaciones actualmente.</p>
                <button 
                  onClick={() => setLocation('/matching')}
                  className="px-4 py-2 bg-[#2e3192] text-white rounded-lg text-sm font-semibold"
                >
                  Buscar Ofertas
                </button>
             </div>
          )}
        </div>
      </div>
      
    </StudentAppLayout>
  );
}
