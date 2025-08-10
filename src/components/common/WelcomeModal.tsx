import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../ui';

interface WelcomeModalProps {
  isDarkMode: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

const getPath = (path: string): string => {
  const base = '/AlarmaPro/';
  return `${base}${path}`;
};

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isDarkMode,
  onInstall,
  onDismiss
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Check if the user is visiting for the first time
  useEffect(() => {
    const hasVisited = localStorage.getItem('alarmapro_welcomed');
    if (!hasVisited) {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('alarmapro_welcomed', 'true');
    setIsOpen(false);
    onDismiss();
  };

  const handleInstall = () => {
    localStorage.setItem('alarmapro_welcomed', 'true');
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
