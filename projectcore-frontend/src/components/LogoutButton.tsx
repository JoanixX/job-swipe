import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  className?: string;
}

export default function LogoutButton({
  variant = 'outline',
  size = 'default',
  showIcon = true,
  className = '',
}: LogoutButtonProps) {
  const [, setLocation] = useLocation();
  const { logoutMutation } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setLocation('/');
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowConfirmDialog(true)}
        className={className}
        disabled={logoutMutation.isPending}
      >
        {showIcon && <LogOut className="h-4 w-4 mr-2" />}
        {logoutMutation.isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que quieres cerrar tu sesión en PROJECT CORE? Podrás volver a iniciar sesión en cualquier momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Cerrar sesión</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}