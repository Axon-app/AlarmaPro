import React, { useState, useRef, useEffect } from 'react';
import { Alarm } from '../types';
import { useAlarmManager, useCurrentTime, useSettings, useSnooze, useDeviceStatus } from '../hooks';
import { THEMES, THEME_ACCENT_HEX, QUICK_ALARMS, SNOOZE_DURATION, MAX_SNOOZE_COUNT, APP_VERSION } from '../constants';
import { createQuickAlarm, createSnoozeAlarm } from '../utils';

// Función para obtener la ruta completa de recursos estáticos
const getPath = (path: string): string => {
  const base = '/AlarmaPro/';
  return `${base}${path}`;
};
import { DigitalClock, ParticleBackground, TimeFormatToggle, ThemeSelect, WelcomeModal } from './common';
import { ALARM_SOUNDS as SOUND_LIST } from '../constants/alarmSounds';
import { AlarmList, AlarmForm } from './alarm';
import { Card, Button, Modal } from './ui';

const ModernAlarmSystem: React.FC = () => {
  const currentTime = useCurrentTime();
  const { settings, toggleDarkMode, toggleTimeFormat, toggleVoice, setTheme, setVolume } = useSettings();
  const { alarms, activeAlarm, addAlarm, updateAlarm, deleteAlarm, toggleAlarm, dismissAlarm } = useAlarmManager();
  const { isSnoozing, snoozeCount, canSnooze, snooze, resetSnooze } = useSnooze(MAX_SNOOZE_COUNT);
  const device = useDeviceStatus();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showQuickAlarms, setShowQuickAlarms] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [shouldOpenInstall, setShouldOpenInstall] = useState(false);
  
  // Logo estático (sin efecto 3D)

  const currentTheme = THEMES[settings.theme];

  const handleAddQuickAlarm = (minutes: number) => {
    const alarmData = createQuickAlarm(minutes);
    addAlarm(alarmData);
    setShowQuickAlarms(false);
  };

  const handleSnoozeAlarm = () => {
    if (activeAlarm && canSnooze) {
      const snoozeData = createSnoozeAlarm(activeAlarm, snoozeCount, SNOOZE_DURATION);
      addAlarm(snoozeData);
      snooze();
      dismissAlarm();
    }
  };

  const handleSaveAlarm = (alarmData: Omit<Alarm, 'id'>) => {
    if (editingAlarm) {
      updateAlarm(editingAlarm.id, alarmData);
    } else {
      addAlarm(alarmData);
    }
    setEditingAlarm(null);
    setShowAddForm(false);
  };

  const handleEditAlarm = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    setShowAddForm(true);
  };

  const handleCancelForm = () => {
    setEditingAlarm(null);
    setShowAddForm(false);
  };

  // Capture the install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Si no está instalada, podemos abrir el modal de instalación
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
      if (!isStandalone) setShouldOpenInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Verificar estado instalado/versión al cargar
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    const lastSeenVersion = localStorage.getItem('alarmapro_version');
    const firstTime = !localStorage.getItem('alarmapro_welcomed');

    // Si no instalada y aún no tenemos prompt diferido, igual mostramos modal con instrucciones
    if (!isStandalone && (firstTime || !deferredPrompt)) {
      setShouldOpenInstall(true);
    }

    // Si instalada pero nueva versión, mostramos modal (para informar cambios)
    if (isStandalone && lastSeenVersion && lastSeenVersion !== APP_VERSION) {
      setShouldOpenInstall(true);
    }
  }, [deferredPrompt]);

  const handleInstallApp = () => {
    if (!deferredPrompt) {
      // Show fallback instructions if prompt not available
      alert("Para instalar la aplicación: \n1. Abre el menú del navegador (los tres puntos)\n2. Selecciona 'Instalar aplicación' o 'Añadir a pantalla de inicio'");
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuario aceptó la instalación');
        try {
          localStorage.setItem('alarmapro_version', APP_VERSION);
        } catch {}
      } else {
        console.log('Usuario rechazó la instalación');
      }
      // Clear the saved prompt since it can't be used again
      setDeferredPrompt(null);
    });
  };

  // Reproducir sonido de alarma según selección y (opcional) leer etiqueta por voz
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const getSoundUrl = (soundValue: string | undefined): string => {
      if (!soundValue) return SOUND_LIST[0]?.url || '';
      // Si ya es una ruta/url a un mp3 dentro de la app
      if (/(\.mp3|^\/|^https?:)/i.test(soundValue)) return soundValue;
      // Compat: claves antiguas -> usa primera opción como fallback
      return SOUND_LIST[0]?.url || '';
    };

    if (activeAlarm) {
      const url = getSoundUrl(activeAlarm.sound);
      if (url) {
        try {
          el.pause();
          // Asignar src directo para asegurar carga del archivo
          el.src = url;
          el.loop = true;
          el.volume = Math.max(0, Math.min(1, (settings.alarmVolume ?? 100) / 100));
          // Forzar inicio desde el principio
          el.currentTime = 0;
          void el.play().catch(() => {/* ignorar bloqueo de autoplay si ocurre */});

          // Leer etiqueta de la alarma si ambas opciones están activas
          if (settings.voiceEnabled && (activeAlarm as any).useVoice && activeAlarm.label) {
            try {
              const utter = new SpeechSynthesisUtterance(activeAlarm.label);
              utter.lang = 'es-ES';
              utter.volume = Math.max(0, Math.min(1, (settings.alarmVolume ?? 100) / 100));
              window.speechSynthesis.cancel(); // reiniciar cola
              window.speechSynthesis.speak(utter);
            } catch {}
          }
        } catch {}
      }
    } else {
      el.pause();
      try { window.speechSynthesis.cancel(); } catch {}
    }
  }, [activeAlarm, settings.alarmVolume, settings.voiceEnabled]);
  
  // Se elimina efecto 3D del logo

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      settings.isDarkMode 
        ? `bg-gradient-to-br ${currentTheme.from} via-gray-900 ${currentTheme.to}` 
        : `bg-gradient-to-br ${currentTheme.light} via-white to-gray-50`
    }`}>
      {/* Enhanced Particle Background */}
      <ParticleBackground count={60} className="opacity-40" />

      {/* Dynamic background waves with glassmorphism */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -inset-10">
          <div className={`absolute top-0 -left-4 w-96 h-96 bg-gradient-to-r ${currentTheme.from.includes('purple') ? 'from-purple-400' : currentTheme.from.includes('blue') ? 'from-blue-400' : currentTheme.from.includes('orange') ? 'from-orange-400' : currentTheme.from.includes('green') ? 'from-green-400' : 'from-violet-400'} to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-pulse transform rotate-45`}></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-gradient-to-l from-yellow-400 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000 transform -rotate-45"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-t from-pink-400 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pb-16 sm:pb-20">
        {/* Header with controls */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
            <div
              className={`p-2 sm:p-3 rounded-2xl bg-gradient-to-r from-${currentTheme.accent} to-purple-600 backdrop-blur-lg shadow-xl`}
            >
              <img
                src={getPath('clockT.png')}
                alt="AlarmaPro Logo"
                className="w-8 h-8 sm:w-9 sm:h-9"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              AlarmaPro
            </h1>
          </div>

          {/* Control panel */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-5 sm:mb-6 overflow-x-auto px-1 py-1" style={{ overflow: 'visible' }}>
            <TimeFormatToggle
              is24Hour={settings.is24HourFormat}
              onToggle={toggleTimeFormat}
              isDarkMode={settings.isDarkMode}
              accentHex={THEME_ACCENT_HEX[settings.theme]}
            />
            <Button
              variant={settings.voiceEnabled ? "primary" : "ghost"}
              size="sm"
              onClick={toggleVoice}
              title="Voz habilitada"
              className="h-9 w-10 p-0 flex items-center justify-center"
              isDarkMode={settings.isDarkMode}
            >🔊</Button>

            <ThemeSelect value={settings.theme} onChange={(t) => setTheme(t)} isDarkMode={settings.isDarkMode} />

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="h-9 w-10 p-0 flex items-center justify-center"
              isDarkMode={settings.isDarkMode}
            >{settings.isDarkMode ? '☀️' : '🌙'}</Button>
          </div>

          {/* Digital Clock */}
          <DigitalClock
            currentTime={currentTime}
            is24HourFormat={settings.is24HourFormat}
            isDarkMode={settings.isDarkMode}
            voiceEnabled={settings.voiceEnabled}
            theme={currentTheme}
            themeType={settings.theme}
          />
        </div>

        {/* Action buttons */}
        <div className="w-full max-w-xl mx-auto mb-6 sm:mb-8">
          <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Button
              variant="primary"
              onClick={() => setShowAddForm(!showAddForm)}
              className="min-w-0 flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 text-base sm:text-lg"
              isDarkMode={settings.isDarkMode}
              themeType={settings.theme}
            >
              ➕ {editingAlarm ? 'Editar Alarma' : 'Nueva Alarma'}
            </Button>

            <Button
              variant="secondary"
              onClick={() => setShowQuickAlarms(!showQuickAlarms)}
              className="min-w-0 flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 text-base sm:text-lg"
              isDarkMode={settings.isDarkMode}
              themeType={settings.theme}
            >
              ⚡ Alarmas Rápidas
            </Button>
          </div>
        </div>

        {/* Quick alarms */}
        <Modal open={showQuickAlarms} onClose={() => setShowQuickAlarms(false)} title="⚡ Alarmas Rápidas" maxWidthClass="max-w-2xl">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
            {QUICK_ALARMS.map((quick) => (
              <button
                key={quick.minutes}
                onClick={() => handleAddQuickAlarm(quick.minutes)}
                className={`group p-3 sm:p-4 rounded-2xl ${settings.isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/50 hover:bg-white/70'} backdrop-blur-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover-glow`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 ${settings.isDarkMode ? 'text-white' : 'text-gray-800'} group-hover:animate-bounce text-xl sm:text-2xl`}>
                  {quick.icon}
                </div>
                <div className={`text-xs sm:text-sm font-semibold ${settings.isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {quick.label}
                </div>
              </button>
            ))}
          </div>
        </Modal>

        {/* Alarm form */}
        <Modal open={showAddForm} onClose={handleCancelForm} title={editingAlarm ? '✏️ Editar Alarma' : '✨ Nueva Alarma'} maxWidthClass="max-w-xl">
          <AlarmForm
            alarm={editingAlarm || undefined}
            isDarkMode={settings.isDarkMode}
            theme={currentTheme}
            themeType={settings.theme}
            onSave={handleSaveAlarm}
            onCancel={handleCancelForm}
            alarmVolume={settings.alarmVolume}
            onVolumeChange={setVolume}
            is24HourFormat={settings.is24HourFormat}
            onToggleTimeFormat={toggleTimeFormat}
          />
        </Modal>

        {/* Alarm list */}
        <AlarmList
          alarms={alarms}
          isDarkMode={settings.isDarkMode}
          is24HourFormat={settings.is24HourFormat}
          theme={currentTheme}
          themeType={settings.theme}
          onEdit={handleEditAlarm}
          onToggle={toggleAlarm}
          onDelete={deleteAlarm}
        />
      </div>

      {/* Active alarm modal */}
      {activeAlarm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50">
          <Card className="relative p-12 text-center max-w-lg mx-4" isDarkMode={settings.isDarkMode}>
            {/* Visual effects */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto text-yellow-400 drop-shadow-lg text-6xl">⚡</div>
                  <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-yellow-400 rounded-full"></div>
                </div>
              </div>
              
              <h2 className={`text-4xl font-bold mb-4 ${settings.isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                🚨 ¡ALARMA ACTIVA!
              </h2>
              
              <p className={`text-2xl font-semibold mb-4 ${settings.isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {activeAlarm.label}
              </p>
              
              <p className={`text-5xl font-mono font-bold mb-8 ${settings.isDarkMode ? 'text-white' : 'text-gray-800'} tracking-wider`}>
                {activeAlarm.time}
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  {canSnooze && (
                    <Button
                      variant="secondary"
                      onClick={handleSnoozeAlarm}
                      className="flex-1 py-4 text-lg flex items-center justify-center gap-2"
                      isDarkMode={settings.isDarkMode}
                    >
                      🔄 Posponer 5min
                    </Button>
                  )}
                  
                  <Button
                    variant="danger"
                    onClick={() => {
                      dismissAlarm();
                      resetSnooze();
                    }}
                    className="flex-1 py-4 text-lg flex items-center justify-center gap-2"
                    isDarkMode={settings.isDarkMode}
                  >
                    🔇 Desactivar
                  </Button>
                </div>
                
                {snoozeCount > 0 && (
                  <div className={`text-sm ${settings.isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Pospuestas: {snoozeCount}/{MAX_SNOOZE_COUNT}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Snooze notification */}
      {isSnoozing && (
        <div className="fixed top-4 right-4 z-40">
          <Card className="p-4 transform animate-bounce" isDarkMode={settings.isDarkMode}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              <span className="font-semibold text-white">Pospuesta 5 minutos</span>
            </div>
          </Card>
        </div>
      )}

      {/* Status indicators */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 transform pointer-events-none select-none z-0 space-y-2">
        {/* Row: Network (left) and Battery (right) */}
        <div className="flex gap-2">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl w-44 sm:w-48 whitespace-nowrap ${settings.isDarkMode ? 'bg-white/10' : 'bg-black/10'} backdrop-blur-lg`}>
            <span className="text-blue-400 text-sm">📶</span>
            <span className={`text-sm ${settings.isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {device.online ? 'Conectado' : 'Sin conexión'}{device.effectiveType ? ` · ${device.effectiveType.toUpperCase()}` : ''}
            </span>
          </div>

          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl w-44 sm:w-48 whitespace-nowrap ${settings.isDarkMode ? 'bg-white/10' : 'bg-black/10'} backdrop-blur-lg`}>
            <span className="text-green-400 text-sm">🔋</span>
            <span className={`text-sm ${settings.isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {device.batteryLevel !== null ? `${device.batteryLevel}%${device.charging ? ' ⚡' : ''}` : '—'}
            </span>
          </div>
        </div>

        {settings.voiceEnabled && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-600/30 backdrop-blur-lg animate-pulse">
            <span className="text-green-300 text-sm">🔊</span>
            <span className="text-sm text-green-300">Voz</span>
          </div>
        )}
      </div>

      {/* Welcome Modal */}
      <WelcomeModal 
        isDarkMode={settings.isDarkMode} 
        onInstall={handleInstallApp}
  onDismiss={() => setShouldOpenInstall(false)}
  shouldOpen={shouldOpenInstall}
      />

  {/* Audio element for alarm sounds (src se asigna dinámicamente) */}
  <audio ref={audioRef} />
    </div>
  );
};

export default ModernAlarmSystem;
