import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ProfileSectionProps {
  title: string;
  children: ReactNode;
  isEditing?: boolean;
  showEdit?: boolean;
  onEdit: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function ProfileSection({ 
  title, 
  children, 
  isEditing = false, 
  showEdit = true,
  onEdit,
  onSave,
  onCancel 
}: ProfileSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={onSave}
                  className="bg-[#8A4EFC] hover:bg-[#7A3EEC]"
                >
                  Guardar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              showEdit && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onEdit}
                  className="text-[#8A4EFC] hover:bg-[#8A4EFC]/10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  Editar
                </Button>
              )
            )}
          </div>
        </div>
        
        <div>{children}</div>
      </div>
    </div>
  );
}