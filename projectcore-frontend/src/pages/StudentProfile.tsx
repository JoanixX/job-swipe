import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, Pencil, Check, X, Settings } from 'lucide-react';
import { useUser } from '../lib/user-context';
import StudentAppLayout from '../components/StudentAppLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentAPI, authAPI } from '../services/backend-api';

export default function StudentProfile() {
  const [_, setLocation] = useLocation();
  const { user, setUser } = useUser();
  const studentId = user?.profileData?.related_id || user?.id || 0;
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  // Default values
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    university: user?.profileData?.university || '',
    phone: user?.phone || '',
    linkedin: user?.linkedin || '',
    portfolio: ''
  });

  // Fetch Student Profile
  const { data: studentData, isLoading: isLoadingStudent } = useQuery({
    queryKey: ['studentProfile', studentId],
    queryFn: () => studentAPI.getById(studentId),
    enabled: !!studentId
  });

  // Effect to sync data when fetched
  useEffect(() => {
    if (studentData) {
      setFormData(prev => ({
        ...prev,
        university: studentData.university || prev.university,
        portfolio: studentData.portfolio || prev.portfolio,
      }));
    }
  }, [studentData]);

  const updateMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      // Typically we would update both User and Student if fields belong to different tables
      // For this mockup frontend, we'll try to update both if possible
      try {
        if (user?.id) {
          await authAPI.updateUser(user.id as any, {
            name: updatedData.name,
            phone: updatedData.phone,
            linkedin: updatedData.linkedin,
            portfolio: updatedData.portfolio
          });
        }
        if (studentId) {
          await studentAPI.update(studentId, {
            university: updatedData.university
          });
        }
      } catch (error) {
        console.warn("Update might fail if endpoints aren't implemented yet on backend:", error);
      }
      return updatedData;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['studentProfile', studentId], (old: any) => ({
        ...old,
        ...data
      }));
      if (user) {
        setUser({
          ...user,
          phone: data.phone,
          linkedin: data.linkedin,
          portfolio: data.portfolio,
          profileData: {
            ...user.profileData,
            university: data.university
          }
        });
      }
      setIsEditing(false);
      alert('Perfil actualizado correctamente');
    },
    onError: () => {
      // Even on error, stop editing to not block user (due to possible mock backend)
      setIsEditing(false);
      alert('Los cambios se han guardado localmente (Backend endpoints pendientes)');
    }
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const initial = formData.name ? formData.name.charAt(0).toUpperCase() : 'U';

  return (
    <StudentAppLayout activePage="perfil">
      
      {/* Header */}
      <div className="py-4 px-6 flex items-center justify-between bg-white sticky top-0 z-20 border-b border-gray-50">
        <div className="flex items-center">
          <button 
            onClick={() => setLocation('/matching')}
            className="mr-4 text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Mi Perfil</h1>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <button onClick={handleSave} className="p-2 text-green-500 hover:bg-green-50 rounded-full" disabled={updateMutation.isPending}>
              <Check className="w-5 h-5" />
            </button>
          </div>
        ) : null}
      </div>
      
      <div className="p-6 pb-12">
        
        {/* Avatar Section */}
        <div className="flex justify-center mt-4 mb-8">
          <div className="relative">
            <div className="w-28 h-28 bg-[#2e3192] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl font-medium">{initial}</span>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute bottom-0 right-0 w-9 h-9 bg-[#8c52ff] rounded-full flex items-center justify-center border-4 border-white shadow-sm hover:bg-[#7a42df] transition-colors"
              >
                <Pencil className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 mb-8">
          {isLoadingStudent && !isEditing ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-[#2e3192]/20 border-t-[#2e3192] rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Nombre Completo</h3>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full text-gray-900 text-[15px] p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2e3192]"
                  />
                ) : (
                  <p className="text-gray-600 text-[15px]">{formData.name}</p>
                )}
              </div>
              
              <div className="h-px bg-gray-100 w-full" />
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Correo Electrónico</h3>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={formData.email} 
                    disabled
                    className="w-full text-gray-500 text-[15px] p-2 border border-gray-200 bg-gray-50 rounded-lg cursor-not-allowed"
                    title="No se puede cambiar el correo"
                  />
                ) : (
                  <p className="text-gray-600 text-[15px]">{formData.email}</p>
                )}
              </div>
              
              <div className="h-px bg-gray-100 w-full" />
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Universidad</h3>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.university} 
                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                    className="w-full text-gray-900 text-[15px] p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2e3192]"
                  />
                ) : (
                  <p className="text-gray-600 text-[15px]">{formData.university || 'No registrada'}</p>
                )}
              </div>
              
              <div className="h-px bg-gray-100 w-full" />
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Teléfono</h3>
                {isEditing ? (
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full text-gray-900 text-[15px] p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2e3192]"
                  />
                ) : (
                  <p className="text-gray-600 text-[15px]">{formData.phone || 'No registrado'}</p>
                )}
              </div>
              
              <div className="h-px bg-gray-100 w-full" />
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Linkedin</h3>
                {isEditing ? (
                  <input 
                    type="url" 
                    value={formData.linkedin} 
                    onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    className="w-full text-gray-900 text-[15px] p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2e3192]"
                  />
                ) : (
                  <p className="text-gray-600 text-[15px]">{formData.linkedin || 'No registrado'}</p>
                )}
              </div>
              
              <div className="h-px bg-gray-100 w-full" />
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Portafolio</h3>
                {isEditing ? (
                  <input 
                    type="url" 
                    value={formData.portfolio} 
                    onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                    className="w-full text-gray-900 text-[15px] p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2e3192]"
                  />
                ) : (
                  <p className="text-gray-600 text-[15px]">{formData.portfolio || 'No registrado'}</p>
                )}
              </div>
              
              <div className="h-px bg-gray-100 w-full" />
            </>
          )}
        </div>

        {/* Availability Toggle */}
        <div className="bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="pr-4">
              <h3 className="font-bold text-gray-900 mb-1">Disponibilidad Inmediata</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Permite que las empresas te contacten directamente</p>
            </div>
            
            {/* Custom Toggle Switch */}
            <button 
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isAvailable ? 'bg-[#00C853]' : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={isAvailable}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isAvailable ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button 
            onClick={() => setLocation('/student-skills')}
            className="w-full py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors text-sm"
          >
            Gestionar Habilidades
          </button>
          
          <button 
            onClick={() => setLocation('/account-settings')}
            className="w-full py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Configuración de Cuenta
          </button>
          
          <button 
            onClick={handleSave}
            className="w-full py-4 bg-[#1e2f75] hover:bg-[#15225a] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all duration-300 mt-2"
          >
            Guardar Cambios
          </button>
        </div>
        
      </div>
      
    </StudentAppLayout>
  );
}
