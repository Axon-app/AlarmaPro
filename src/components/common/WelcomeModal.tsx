import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../ui';

interface WelcomeModalProps {
  isDarkMode: boolean;
  onInstall: () => void;
  onDismiss: () => void;
  // Opcional: forzar apertura desde el padre si detectamos que no está instalada
  shouldOpen?: boolean;
}

const getPath = (path: string): string => {
  const base = '/AlarmaPro/';
  return `${base}${path}`;
};

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isDarkMode,
  onInstall,
  onDismiss,
  shouldOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Mostrar si:
  // - no está instalada (display-mode != standalone)
  // - o hay una versión nueva (comparando localStorage vs versión actual)
  useEffect(() => {
    // Detectar display-mode standalone (PWA instalada)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    const lastSeenVersion = localStorage.getItem('alarmapro_version');
    const currentVersion = (import.meta as any).env?.VITE_APP_VERSION || '1.0.0';

    const firstTime = !localStorage.getItem('alarmapro_welcomed');
    const hasNewVersion = !!lastSeenVersion && lastSeenVersion !== currentVersion;

    if (shouldOpen === true) {
      setIsOpen(true);
    } else if (!isStandalone) {
      // No instalada: mostrar modal de instalación
      setIsOpen(true);
    } else if (hasNewVersion) {
      // Instalada pero nueva versión: sugerir actualizar/instalar de nuevo (si el SW cambió)
      setIsOpen(true);
    } else if (firstTime) {
      setIsOpen(true);
    }
  }, [shouldOpen]);

  const handleDismiss = () => {
    localStorage.setItem('alarmapro_welcomed', 'true');
    const currentVersion = (import.meta as any).env?.VITE_APP_VERSION || '1.0.0';
    localStorage.setItem('alarmapro_version', currentVersion);
    setIsOpen(false);
    onDismiss();
  };

  const handleInstall = () => {
    localStorage.setItem('alarmapro_welcomed', 'true');
    const currentVersion = (import.meta as any).env?.VITE_APP_VERSION || '1.0.0';
    localStorage.setItem('alarmapro_version', currentVersion);
    setIsOpen(false);
    onInstall();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleDismiss}
      title="¡Bienvenido a AlarmaPro!"
      maxWidthClass="max-w-sm"
    >
      <div className="text-center px-1">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <img 
              src={getPath('clock1.png')} 
              alt="AlarmaPro Logo" 
              className="w-24 h-24 object-contain filter drop-shadow-lg animate-pulse" 
            />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-30 blur-xl animate-pulse"></div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-3">
          Tu sistema de alarmas inteligente
        </h2>

        <p className="text-gray-200 mb-4 text-sm">
          Gracias por usar AlarmaPro, la aplicación que te ayuda a organizar tu tiempo con estilo.
          Nunca fue tan fácil configurar alarmas personalizadas.
        </p>

        <div className="flex flex-col gap-2 justify-center mb-2">
          <Button
            variant="secondary"
            onClick={handleDismiss}
            className="w-full py-2"
            isDarkMode={isDarkMode}
          >
            Continuar a la app
          </Button>
          
          <Button
            variant="primary"
            onClick={handleInstall}
            className="w-full py-2"
            isDarkMode={isDarkMode}
          >
            Instalar aplicación
          </Button>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Puedes instalar la aplicación en cualquier momento desde el menú del navegador
        </p>
        
        <p className="mt-2 text-2xs text-gray-500 pt-1 border-t border-gray-700">
          Diseñado por Axon.app y IA
        </p>
      </div>
    </Modal>
  );
};
