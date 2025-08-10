export interface AlarmSound {
  name: string;
  url: string;
  icon: string;
}

export const ALARM_SOUNDS: AlarmSound[] = [
  {
    name: 'Clásico',
    url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DvwXUlBSt+zPDYizoIGGS57eWfUQwOUarm7rdmHTVCm9n0vHEhBThK', 
    icon: '⏰'
  },
  {
    name: 'Suave',
    url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DvwXUlBSt+zPDYizoIGGS57eWfUQwOUarm7rdmHTVCm9n0vHEhBThK',
    icon: '🎵'
  },
  {
    name: 'Urgente',
    url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DvwXUlBSt+zPDYizoIGGS57eWfUQwOUarm7rdmHTVCm9n0vHEhBThK',
    icon: '🚨'
  },
  {
    name: 'Naturaleza',
    url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DvwXUlBSt+zPDYizoIGGS57eWfUQwOUarm7rdmHTVCm9n0vHEhBThK',
    icon: '🌿'
  },
  {
    name: 'Digital',
    url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DvwXUlBSt+zPDYizoIGGS57eWfUQwOUarm7rdmHTVCm9n0vHEhBThK',
    icon: '🤖'
  }
];
