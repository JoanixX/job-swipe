import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, Pencil, Check, X, Settings, FileText, UploadCloud, ExternalLink } from 'lucide-react';
import { useUser } from '../lib/user-context';
import StudentAppLayout from '../components/StudentAppLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentAPI, authAPI } from '../services/backend-api';

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8000';

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
    queryFn: () => studentAPI.getById(Number(studentId)),
    enabled: !!studentId
  });

  // Datos del usuario (incluye cv_url actualizado)
  const { data: userData } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () => authAPI.getUserByEmail(user!.email),
    enabled: !!user?.email,
  });

  const cvUrl: string | null = userData?.cv_url || null;

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
          await studentAPI.update(Number(studentId), {
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
          name: data.name,
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
    }
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const initial = formData.name ? formData.name.charAt(0).toUpperCase() : 'U';

  const fieldClass = "w-full text-gray-900 dark:text-white dark:bg-gray-800 text-[15px] p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#1E3A8A] dark:focus:border-indigo-400";

  const renderField = (label: string, key: keyof typeof formData, type = 'text', disabled = false) => (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{label}</h3>
      {isEditing ? (
        <input
          type={type}
          value={formData[key]}
          disabled={disabled}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
          className={disabled
            ? "w-full text-gray-500 text-[15px] p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-not-allowed"
            : fieldClass}
        />
      ) : (
        <p className="text-gray-600 dark:text-gray-300 text-[15px]">{formData[key] || 'No registrado'}</p>
      )}
    </div>
  );

  return (
    <StudentAppLayout activePage="perfil">

      {/* Header */}
      <div className="py-4 px-6 flex items-center justify-between bg-white dark:bg-gray-900 sticky top-0 z-20 border-b border-gray-50 dark:border-gray-800 md:bg-transparent md:dark:bg-transparent md:static md:border-none md:mt-6">
        <div className="flex items-center">
          <button
            onClick={() => setLocation('/matching')}
            className="mr-4 text-gray-500 hover:text-gray-900 dark:hover:text-white md:hidden"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <button onClick={handleSave} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-950 rounded-full" disabled={updateMutation.isPending}>
              <Check className="w-5 h-5" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="p-6 pb-12 max-w-2xl mx-auto w-full">

        {/* Avatar Section */}
        <div className="flex justify-center mt-4 mb-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #6366F1 100%)' }}>
              <span className="text-white text-4xl font-medium">{initial}</span>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute bottom-0 right-0 w-9 h-9 bg-[#6366F1] rounded-full flex items-center justify-center border-4 border-white dark:border-gray-950 shadow-sm hover:bg-[#4F52D9] transition-colors"
              >
                <Pencil className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Mi CV */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.04)] rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#6366F1]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white">Mi CV</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {cvUrl ? 'CV cargado — las empresas pueden verlo' : 'Aún no has subido tu CV'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {cvUrl && (
                <a
                  href={`${API_ORIGIN}${cvUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver
                </a>
              )}
              <button
                onClick={() => setLocation('/student-cv-upload')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#27479E] text-white text-sm font-semibold transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
                {cvUrl ? 'Reemplazar' : 'Subir CV'}
              </button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.04)] rounded-2xl p-5 space-y-5 mb-6">
          {isLoadingStudent && !isEditing ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-[#1E3A8A]/20 border-t-[#1E3A8A] dark:border-indigo-400/20 dark:border-t-indigo-400 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {renderField('Nombre Completo', 'name')}
              <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />
              {renderField('Correo Electrónico', 'email', 'email', true)}
              <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />
              {renderField('Universidad', 'university')}
              <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />
              {renderField('Teléfono', 'phone', 'tel')}
              <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />
              {renderField('Linkedin', 'linkedin', 'url')}
              <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />
              {renderField('Portafolio', 'portfolio', 'url')}
            </>
          )}
        </div>

        {/* Availability Toggle */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.04)] rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="pr-4">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Disponibilidad Inmediata</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Permite que las empresas te contacten directamente</p>
            </div>

            {/* Custom Toggle Switch */}
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isAvailable ? 'bg-[#00C853]' : 'bg-gray-200 dark:bg-gray-700'
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
            className="w-full py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            Gestionar Habilidades
          </button>

          <button
            onClick={() => setLocation('/account-settings')}
            className="w-full py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Configuración de Cuenta
          </button>

          {isEditing && (
            <button
              onClick={handleSave}
              className="w-full py-4 bg-[#1E3A8A] hover:bg-[#27479E] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all duration-300 mt-2"
            >
              Guardar Cambios
            </button>
          )}
        </div>

      </div>

    </StudentAppLayout>
  );
}
