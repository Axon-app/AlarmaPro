export interface AlarmSound {
  name: string;
  url: string;
  icon: string;
}

// Función para obtener la ruta completa
const getPath = (path: string): string => {
  // Asegurarnos de que funciona tanto en desarrollo como en producción
  const base = '/AlarmaPro/';
  return `${base}${path}`;
};

export const ALARM_SOUNDS: AlarmSound[] = [
  {
    name: 'Clásico',
    url: getPath('sounds/alarm-26718.mp3'), 
    icon: '⏰'
  },
  {
    name: 'Suave',
    url: getPath('sounds/reliable-safe-327618.mp3'),
    icon: '🎵'
  },
  {
    name: 'Urgente',
    url: getPath('sounds/biohazard-alarm-143105.mp3'),
    icon: '🚨'
  },
  {
    name: 'Sirena',
    url: getPath('sounds/facility-siren-loopable-100687.mp3'),
    icon: '🚒'
  },
  {
    name: 'Digital',
    url: getPath('sounds/alarm-no3-14864.mp3'),
    icon: '🤖'
  }
];
