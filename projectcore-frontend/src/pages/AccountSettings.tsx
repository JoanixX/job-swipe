import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, Lock, LogOut, Trash2 } from 'lucide-react';
import StudentAppLayout from '../components/StudentAppLayout';
import { useUser } from '../lib/user-context';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../services/backend-api';

export default function AccountSettings() {
  const [_, setLocation] = useLocation();
  const { logout } = useUser();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const updatePasswordMutation = useMutation({
    mutationFn: () => authAPI.updatePassword(user?.id || 0, passwordData.current, passwordData.new),
    onSuccess: () => {
      alert('Contraseña actualizada correctamente');
      setIsChangingPassword(false);
      setPasswordData({ current: '', new: '', confirm: '' });
    },
    onError: (error) => {
      alert('Error al actualizar contraseña. Verifica tu contraseña actual.');
    }
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => authAPI.deleteAccount(user?.id || 0),
    onSuccess: () => {
      alert('Cuenta eliminada permanentemente.');
      handleLogout();
    },
    onError: (error) => {
      alert('Error al eliminar la cuenta.');
    }
  });

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('Las contraseñas nuevas no coinciden');
      return;
    }
    if (passwordData.new.length < 6) {
      alert('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    updatePasswordMutation.mutate();
  };

  const handleDeleteAccount = () => {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      deleteAccountMutation.mutate();
    }
  };

  return (
    <StudentAppLayout activePage="perfil">
      {/* Header */}
      <div className="py-4 px-6 flex items-center bg-white sticky top-0 z-20 border-b border-gray-50">
        <button 
          onClick={() => setLocation('/student-profile')}
          className="mr-4 text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-[#1e293b]">Configuración de Cuenta</h1>
      </div>

      <div className="p-4 space-y-4 pb-24 bg-gray-50 min-h-screen">
        
        {/* Cambiar Contraseña Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-[#1e2f75]" />
            <h2 className="text-[17px] font-medium text-[#1e293b]">Cambiar Contraseña</h2>
          </div>

          {!isChangingPassword ? (
            <button 
              onClick={() => setIsChangingPassword(true)}
              className="w-full py-3 bg-gray-50 border border-gray-100 rounded-xl text-[15px] font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Actualizar Contraseña
            </button>
          ) : (
            <div className="space-y-4 mt-2">
              <div>
                <label className="block text-[15px] text-[#1e293b] mb-1">Contraseña Actual</label>
                <input 
                  type="password" 
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  className="w-full text-gray-900 text-[15px] p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e2f75] bg-transparent"
                />
              </div>
              
              <div>
                <label className="block text-[15px] text-[#1e293b] mb-1">Nueva Contraseña</label>
                <input 
                  type="password" 
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  className="w-full text-gray-900 text-[15px] p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e2f75] bg-transparent"
                />
              </div>
              
              <div>
                <label className="block text-[15px] text-[#1e293b] mb-1">Confirmar Nuevas Contraseña</label>
                <input 
                  type="password" 
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  className="w-full text-gray-900 text-[15px] p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e2f75] bg-transparent"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsChangingPassword(false)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[15px] font-medium text-[#1e293b] hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handlePasswordChange}
                  disabled={updatePasswordMutation.isPending}
                  className="flex-1 py-3 bg-[#1e2f75] hover:bg-[#15225a] text-white rounded-xl text-[15px] font-medium transition-colors"
                >
                  {updatePasswordMutation.isPending ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cerrar Sesión Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <LogOut className="w-5 h-5 text-[#1e293b]" />
            <h2 className="text-[17px] font-medium text-[#1e293b]">Cerrar Sesión</h2>
          </div>
          <p className="text-gray-500 text-[15px] mb-4">Salir de tu cuenta en este dispositivo</p>
          
          <button 
            onClick={handleLogout}
            className="w-full py-3 bg-gray-50 border border-gray-100 rounded-xl text-[15px] font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Eliminar Cuenta Card */}
        <div className="bg-red-50/50 rounded-2xl p-5 shadow-sm border border-red-100">
          <div className="flex items-center gap-3 mb-3">
            <Trash2 className="w-5 h-5 text-[#b91c1c]" />
            <h2 className="text-[17px] font-medium text-[#b91c1c]">Atención</h2>
          </div>
          <p className="text-[#991b1b] text-[14px] leading-relaxed mb-4">
            Eliminar tu cuenta es permanente y no se puede deshacer. Perderás todas tus postulaciones y matches.
          </p>
          
          <button 
            onClick={handleDeleteAccount}
            disabled={deleteAccountMutation.isPending}
            className="w-full py-3 bg-transparent border border-[#dc2626] rounded-xl text-[15px] font-medium text-[#dc2626] hover:bg-red-50 transition-colors"
          >
            {deleteAccountMutation.isPending ? 'Eliminando...' : 'Eliminar Cuenta'}
          </button>
        </div>

      </div>
    </StudentAppLayout>
  );
}
