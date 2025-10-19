'use client';
import { useEffect } from 'react';

export default function LogPopup({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-gray-900 text-white px-6 py-4 rounded-lg shadow-lg max-w-md text-center">
        <h3 className="text-lg font-semibold mb-2">📜 Log Info</h3>
        <p className="text-sm text-gray-300 whitespace-pre-wrap">{message}</p>
        <button
          onClick={onClose}
          className="mt-3 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
