'use client';
import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((text, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[300] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              'px-5 py-3.5 text-[13px] shadow-lg border-l-[3px]',
              t.type === 'error' ? 'bg-red-50 text-red-800 border-red-500' : 'bg-navy text-cream border-gold',
            ].join(' ')}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Hook — see also src/hooks/useToast.js which just re-exports this for a
// consistent `hooks/` import path across the app.
export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used within a ToastProvider');
  return ctx;
}
