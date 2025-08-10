import React, { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClass?: string; // e.g., 'max-w-lg', 'max-w-2xl'
}

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  onClose,
  children,
  maxWidthClass = 'max-w-lg',
}) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
  className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet on mobile, centered dialog on desktop */}
      <div
        className={`relative w-full sm:w-auto sm:${maxWidthClass} sm:mx-auto bg-white/5 sm:bg-white/10 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden`}
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)', maxWidth: maxWidthClass === 'max-w-sm' ? '340px' : undefined }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 className="text-white text-lg font-semibold select-none">{title}</h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg p-1.5 transition"
            aria-label="Cerrar"
          >
            ✖️
          </button>
        </div>

        {/* Content */}
  <div className="max-h-[70vh] sm:max-h-[80vh] overflow-y-auto p-4 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
