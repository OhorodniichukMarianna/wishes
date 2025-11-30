import { useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = 'Yes',
  cancelText = 'No'
}: ConfirmModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        
        <div className="p-4 sm:p-6">
          <p className="text-sm sm:text-base text-gray-600">{message}</p>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200 flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-gray-900 font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-all duration-200 hover:shadow-md text-sm sm:text-base"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 bg-red-500 hover:bg-red-600 text-gray-900 font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

