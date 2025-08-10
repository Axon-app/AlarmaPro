# AlarmaPro - Sistema Inteligente de Alarmas

Una aplicación moderna de alarmas desarrollada con React, TypeScript y Tailwind CSS, que presenta un diseño glassmorphic avanzado y funcionalidades inteligentes.

## 🚀 Características

### ✨ Funcionalidades Principales
- **Alarmas Inteligentes**: Configuración avanzada con múltiples opciones
- **Alarmas Rápidas**: Configuración instantánea de 5min a 1 hora
- **Modo Snooze**: Hasta 3 posposiciones de 5 minutos cada una
- **Notificaciones por Voz**: Síntesis de voz en español
- **Modo Desafío**: Resuelve problemas matemáticos para desactivar
- **Despertar Gradual**: Aumento progresivo del volumen

### 🎨 Diseño y UI/UX
- **Glassmorphism**: Efectos de cristal translúcido modernos
- **5 Temas**: Púrpura, Océano, Atardecer, Bosque, Cósmico
- **Modo Oscuro/Claro**: Cambio dinámico de tema
- **Animaciones Fluidas**: Transiciones y efectos visuales
- **Visualizador de Audio**: Ondas animadas en tiempo real
- **Responsive Design**: Adaptable a todas las pantallas

### ⚙️ Configuración Avanzada
- **Múltiples Sonidos**: 7 tipos diferentes de tonos de alarma
- **Prioridades**: Baja, Normal, Alta, Urgente
- **Días Personalizados**: Selección específica de días de la semana
- **Formato de Hora**: 12H/24H
- **Control de Volumen**: Ajuste personalizado
- **Vibración**: Activación opcional

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```
src/
├── components/           # Componentes React
│   ├── alarm/           # Componentes específicos de alarmas
│   │   ├── AlarmItem.tsx
│   │   ├── AlarmForm.tsx
│   │   ├── AlarmList.tsx
│   │   └── index.ts
│   ├── common/          # Componentes comunes reutilizables
│   │   ├── AudioVisualizer.tsx
│   │   ├── DigitalClock.tsx
│   │   └── index.ts
│   ├── ui/              # Componentes base de UI
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   └── ModernAlarmSystem.tsx # Componente principal
├── hooks/               # Custom React Hooks
│   ├── useAlarmManager.ts
│   ├── useCurrentTime.ts
│   ├── useSettings.ts
│   ├── useSnooze.ts
│   └── index.ts
├── utils/               # Utilidades y helpers
│   └── index.ts
├── types/               # Definiciones TypeScript
│   └── index.ts
├── constants/           # Constantes de la aplicación
│   └── index.ts
├── styles/              # Archivos CSS
│   └── animations.css
├── App.tsx              # Componente raíz
└── index.tsx            # Punto de entrada
```

### Patrones de Diseño Implementados

#### 1. **Separation of Concerns (SoC)**
- **Componentes**: Únicamente responsables de la presentación
- **Hooks**: Lógica de estado y efectos secundarios
- **Utils**: Funciones puras y helpers
- **Types**: Definiciones de tipos centralizadas

#### 2. **Custom Hooks Pattern**
```typescript
// useAlarmManager.ts - Manejo completo del estado de alarmas
const { alarms, activeAlarm, addAlarm, updateAlarm } = useAlarmManager();

// useSettings.ts - Configuración de la aplicación
const { settings, toggleDarkMode, setTheme } = useSettings();
```

#### 3. **Compound Component Pattern**
```typescript
// Componentes que trabajan juntos de forma cohesiva
<AlarmList>
  <AlarmItem />
  <AlarmForm />
</AlarmList>
```

#### 4. **Factory Pattern**
```typescript
// utils/index.ts - Creación de alarmas
export const createQuickAlarm = (minutes: number): Omit<Alarm, 'id'>
export const createSnoozeAlarm = (activeAlarm: Alarm): Omit<Alarm, 'id'>
```

## 🔧 Tecnologías Utilizadas

### Frontend
- **React 18**: Biblioteca principal de UI
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de CSS utility-first
- **Vite**: Build tool y dev server ultrarrápido

### Herramientas de Desarrollo
- **ESLint**: Linting y calidad de código
- **Prettier**: Formateo automático
- **PostCSS**: Procesamiento de CSS
- **Autoprefixer**: Prefijos CSS automáticos

### APIs del Navegador
- **LocalStorage**: Persistencia de datos
- **Speech Synthesis**: Síntesis de voz
- **Canvas API**: Visualizador de audio
- **RequestAnimationFrame**: Animaciones fluidas

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Grid System
```css
/* Alarmas rápidas adaptativas */
grid-cols-2 md:grid-cols-3 lg:grid-cols-6

/* Formularios responsivos */
grid-cols-1 md:grid-cols-2
```

## 🎯 Características Técnicas

### Performance
- **Code Splitting**: Separación automática de chunks
- **Lazy Loading**: Carga bajo demanda
- **Memoización**: Optimización de re-renders
- **Virtual DOM**: Actualizaciones eficientes

### Accesibilidad
- **ARIA Labels**: Etiquetas descriptivas
- **Keyboard Navigation**: Navegación por teclado
- **Color Contrast**: Contraste adecuado
- **Screen Reader**: Compatibilidad total

### Internacionalización
- **Español**: Idioma principal
- **Formato de Fecha**: Localización española
- **Síntesis de Voz**: Audio en español

## 🚀 Instalación y Desarrollo

### Requisitos Previos
- Node.js 16+ 
- npm o yarn
- Git

### Instalación
```bash
# Clonar el repositorio
git clone [repository-url]
cd AlarmaPro

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores de lint
npm run type-check   # Verificar tipos TypeScript
```

## 🔮 Funcionalidades Futuras

### Versión 2.0
- [ ] **Sincronización en la nube**
- [ ] **Alarmas por ubicación (GPS)**
- [ ] **Integración con calendario**
- [ ] **Alarmas inteligentes con ML**
- [ ] **Modo focus/productividad**
- [ ] **Estadísticas de sueño**

### Versión 2.5
- [ ] **PWA completa con notificaciones**
- [ ] **Soporte offline**
- [ ] **Exportar/importar configuraciones**
- [ ] **Temas personalizados**
- [ ] **Widget para escritorio**

## 👥 Contribución

### Guías de Contribución
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-caracteristica`
3. Commit cambios: `git commit -m 'Add: nueva característica'`
4. Push a la rama: `git push origin feature/nueva-caracteristica`
5. Crear Pull Request

### Convenciones de Código
- **TypeScript**: Tipado estricto
- **ESLint**: Configuración estándar
- **Commits**: Conventional Commits
- **Componentes**: PascalCase
- **Hooks**: camelCase con prefijo 'use'

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Lucide React**: Íconos modernos
- **Tailwind CSS**: Framework CSS increíble  
- **React Team**: Por React 18
- **Vite Team**: Por el build tool ultrarrápido

---

**AlarmaPro** - Desarrollado con ❤️ para una experiencia de alarmas moderna e inteligente.
