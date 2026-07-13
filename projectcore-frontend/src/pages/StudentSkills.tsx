import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, X } from 'lucide-react';
import StudentAppLayout from '../components/StudentAppLayout';
import { useUser } from '../lib/user-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentAPI } from '../services/backend-api';

export default function StudentSkills() {
  const [_, setLocation] = useLocation();
  const { user } = useUser();
  const studentId = user?.profileData?.related_id || user?.id || 0;
  const queryClient = useQueryClient();

  const [newSkill, setNewSkill] = useState('');

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['studentSkills', studentId],
    queryFn: () => studentAPI.getSkills(studentId),
    enabled: !!studentId
  });

  const addSkillMutation = useMutation({
    mutationFn: (skillName: string) => studentAPI.addSkillByName(studentId, skillName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentSkills', studentId] });
      setNewSkill('');
    },
    onError: (error) => {
      console.error('Error adding skill:', error);
      alert('Hubo un error al agregar la habilidad.');
    }
  });

  const removeSkillMutation = useMutation({
    mutationFn: (skillId: number) => studentAPI.removeSkill(studentId, skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentSkills', studentId] });
    },
    onError: (error) => {
      console.error('Error removing skill:', error);
      alert('Hubo un error al eliminar la habilidad.');
    }
  });

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim() !== '') {
      addSkillMutation.mutate(newSkill.trim());
    }
  };

  return (
    <StudentAppLayout activePage="perfil">
      {/* Header */}
      <div className="py-4 px-6 flex items-center bg-white dark:bg-gray-900 sticky top-0 z-20 border-b border-gray-50 dark:border-gray-800">
        <button 
          onClick={() => setLocation('/student-profile')}
          className="mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mis Habilidades</h1>
      </div>

      <div className="p-4 space-y-4 pb-24 bg-gray-50 dark:bg-gray-950 min-h-screen">
        
        {/* Agregar Nueva Habilidad Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-[17px] font-medium text-gray-900 dark:text-white mb-4">Agregar Nueva Habilidad</h2>
          <input 
            type="text" 
            placeholder="Ej: React, Python, Excel..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleAddSkill}
            disabled={addSkillMutation.isPending}
            className="w-full text-gray-900 dark:text-white text-[15px] p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#6366F1] bg-transparent"
          />
          {addSkillMutation.isPending && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Agregando...</p>
          )}
        </div>

        {/* Tus Habilidades Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-[17px] font-medium text-gray-900 dark:text-white mb-4">
            Tus Habilidades ({skills.length})
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-[#2e3192]/20 border-t-[#2e3192] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: any) => (
                <div 
                  key={skill.skill_id} 
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-950 text-[#1E3A8A] dark:text-indigo-300 rounded-full text-[15px] font-medium"
                >
                  {skill.skill_name || `Habilidad ${skill.skill_id}`}
                  <button 
                    onClick={() => removeSkillMutation.mutate(skill.skill_id)}
                    disabled={removeSkillMutation.isPending}
                    className="p-0.5 hover:bg-[#e0d4ff] rounded-full transition-colors text-[#2e3192]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {skills.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 w-full text-center py-2">No tienes habilidades registradas aún.</p>
              )}
            </div>
          )}
        </div>

        <button 
          onClick={() => setLocation('/student-profile')}
          className="w-full py-4 bg-[#1E3A8A] hover:bg-[#27479E] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all duration-300 mt-6"
        >
          Guardar Cambios
        </button>

      </div>
    </StudentAppLayout>
  );
}
