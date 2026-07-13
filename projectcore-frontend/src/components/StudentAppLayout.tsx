import React from 'react';
import { useLocation } from 'wouter';
import { Home, FileText, Heart, User, LogOut } from 'lucide-react';
import BottomNavigation from './BottomNavigation';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useUser } from '../lib/user-context';

interface StudentAppLayoutProps {
  children: React.ReactNode;
  activePage: "inicio" | "movimientos" | "matches" | "perfil";
}

const navItems = [
  { key: 'inicio', label: 'Inicio', icon: Home, path: '/matching' },
  { key: 'movimientos', label: 'Mis Movimientos', icon: FileText, path: '/student-applications' },
  { key: 'matches', label: 'Matches', icon: Heart, path: '/student-matches' },
  { key: 'perfil', label: 'Mi Perfil', icon: User, path: '/student-profile' },
] as const;

/**
 * Layout del portal de estudiante:
 * - Desktop (md+): sidebar fijo a la izquierda + contenido ancho.
 * - Móvil: barra de navegación inferior.
 */
export default function StudentAppLayout({ children, activePage }: StudentAppLayoutProps) {
  const [, setLocation] = useLocation();
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex">

      {/* Sidebar — solo desktop */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <Logo size="sm" variant="dark" />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ key, label, icon: Icon, path }) => (
            <button
              key={key}
              onClick={() => setLocation(path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activePage === key
                  ? 'bg-[#1E3A8A]/5 dark:bg-indigo-500/10 text-[#1E3A8A] dark:text-indigo-300 font-semibold'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${activePage === key ? 'text-[#1E3A8A] dark:text-indigo-300' : 'text-gray-400'}`} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        <main className="flex-1 pb-[70px] md:pb-8 w-full">
          <div className="max-w-5xl mx-auto w-full min-h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>

      {/* Navegación inferior — solo móvil */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-40">
        <BottomNavigation activePage={activePage} />
      </div>

    </div>
  );
}
