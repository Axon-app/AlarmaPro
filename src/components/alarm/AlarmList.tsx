import React, { useState } from 'react';
import { Alarm, ThemeType } from '../../types';
import { AlarmItem } from './AlarmItem';
import { Modal, Button } from '../ui';
// Import { Clock, Sparkles } from 'lucide-react';

interface AlarmListProps {
  alarms: Alarm[];
  isDarkMode: boolean;
  is24HourFormat: boolean;
  theme: {
    accent: string;
  };
  themeType: ThemeType;
  onEdit: (alarm: Alarm) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const AlarmList: React.FC<AlarmListProps> = ({
  alarms,
  isDarkMode,
  is24HourFormat,
  theme,
  themeType,
  onEdit,
  onToggle,
  onDelete
}) => {
  const [toDelete, setToDelete] = useState<Alarm | null>(null);

  const requestDelete = (id: number) => {
    const found = alarms.find(a => a.id === id) || null;
    setToDelete(found);
  };

  const confirmDelete = () => {
    if (toDelete) {
      onDelete(toDelete.id);
      setToDelete(null);
    }
  };

  const cancelDelete = () => setToDelete(null);
  if (alarms.length === 0) {
    return (
      <div className={`text-center py-10 sm:py-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <div className="relative">
          {/* <Clock className="w-24 h-24 mx-auto mb-6 opacity-50 animate-pulse" /> */}
          <div className="w-24 h-24 mx-auto mb-6 opacity-50 animate-pulse text-6xl">⏰</div>
          {/* <Sparkles className="absolute top-0 right-1/2 w-6 h-6 text-yellow-400 animate-ping" /> */}
          <div className="absolute top-0 right-1/2 w-6 h-6 text-yellow-400 animate-ping text-2xl">✨</div>
        </div>
  <p className="text-xl sm:text-2xl font-semibold mb-2">No hay alarmas configuradas</p>
  <p className="text-base sm:text-lg mb-2">¡Crea tu primera alarma inteligente!</p>
  <p className="text-sm text-gray-400">Usa los botones de arriba para empezar.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 px-1 sm:px-0">
      {alarms.map((alarm) => (
        <AlarmItem
          key={alarm.id}
          alarm={alarm}
          isDarkMode={isDarkMode}
          is24HourFormat={is24HourFormat}
          theme={theme}
          themeType={themeType}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={requestDelete}
        />
      ))}

      {/* Confirm delete modal */}
      <Modal
        open={!!toDelete}
        onClose={cancelDelete}
        title="Confirmar eliminación"
        maxWidthClass="max-w-sm"
      >
        <div className="space-y-4">
          <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            ¿Estás seguro de que deseas eliminar esta alarma?
          </p>
          {toDelete && (
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-white/10 text-white' : 'bg-black/5 text-gray-800'}`}>
              <div className="font-semibold">{toDelete.label || 'Alarma'}</div>
              <div className="opacity-80 text-sm">{toDelete.time}</div>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={cancelDelete} isDarkMode={isDarkMode} themeType={themeType}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete} isDarkMode={isDarkMode}>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
