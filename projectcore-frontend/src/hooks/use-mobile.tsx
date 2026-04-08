import { useState, useEffect } from 'react';

/**
 * Hook para detectar si la pantalla es de tamaño móvil
 * @param breakpoint El ancho en píxeles por debajo del cual consideramos una pantalla como "móvil"
 * @returns boolean que indica si la pantalla es móvil
 */
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Verificar si estamos en un navegador (window está definido)
    if (typeof window === 'undefined') return;

    // Función para verificar el tamaño actual de la ventana
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Verificar inmediatamente
    checkMobile();

    // Agregar un listener para cuando se redimensione la ventana
    window.addEventListener('resize', checkMobile);

    // Limpieza al desmontar el componente
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [breakpoint]);

  return isMobile;
};

export { useIsMobile };