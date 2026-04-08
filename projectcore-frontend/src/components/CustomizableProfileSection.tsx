import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Pencil, Check, X, MoreHorizontal, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface CustomizableProfileSectionProps {
  title: string;
  icon?: ReactNode;
  description?: string;
  children: ReactNode;
  isEditing?: boolean;
  onEditToggle?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  className?: string;
  reorderable?: boolean;
  dragHandleProps?: any;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  editable?: boolean;
}

export default function CustomizableProfileSection({
  title,
  icon,
  description,
  children,
  isEditing = false,
  onEditToggle,
  onSave,
  onCancel,
  className = '',
  reorderable = false,
  onMoveUp,
  onMoveDown,
  onDelete,
  editable = true
}: CustomizableProfileSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customTitle, setCustomTitle] = useState(title);
  const [customDescription, setCustomDescription] = useState(description || '');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const handleSaveCustomization = () => {
    setIsCustomizing(false);
    // Aquí podrías guardar los cambios en la base de datos
  };
  
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-sm border border-slate-100 mb-4 transition-all duration-200 overflow-hidden",
        isEditing ? "ring-2 ring-[hsl(var(--primary))/40]" : "",
        isHovered && !isEditing ? "shadow-md" : "",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center">
          {icon && <div className="mr-2 text-slate-600">{icon}</div>}
          
          {isCustomizing ? (
            <Input
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="h-8 font-medium"
              autoFocus
            />
          ) : (
            <h3 className="font-medium text-slate-800">{customTitle}</h3>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {reorderable && onMoveUp && onMoveDown && (
            <div className="flex flex-col mr-2">
              <button 
                onClick={onMoveUp}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button 
                onClick={onMoveDown}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
          
          {editable && (
            <>
              {isEditing ? (
                <>
                  {onSave && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={onSave}
                      className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Guardar
                    </Button>
                  )}
                  
                  {onCancel && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={onCancel}
                      className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className={`h-8 w-8 p-0 ${isHovered || showDropdown ? 'opacity-100' : 'opacity-0'}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={onEditToggle}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar contenido
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => setIsCustomizing(true)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Personalizar sección
                      </DropdownMenuItem>
                      
                      {onDelete && (
                        <DropdownMenuItem 
                          onClick={onDelete}
                          className="text-red-600 hover:text-red-700 focus:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar sección
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={onEditToggle}
                    className={`h-8 px-2 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      
      {isCustomizing && (
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Título de sección
            </label>
            <Input
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción (opcional)
            </label>
            <Textarea
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              className="w-full"
              rows={2}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCustomizing(false)}
            >
              Cancelar
            </Button>
            <Button 
              size="sm"
              onClick={handleSaveCustomization}
            >
              Guardar cambios
            </Button>
          </div>
        </div>
      )}
      
      {(description || customDescription) && !isCustomizing && (
        <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
          <p className="text-sm text-slate-600">{customDescription || description}</p>
        </div>
      )}
      
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}