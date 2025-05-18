import React from 'react';
import { AlertCircle } from 'lucide-react';

interface LevelUpModalProps {
  level: string;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="notification-frame max-w-2xl w-full">
        <div className="status-window p-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <AlertCircle className="w-8 h-8 text-secondary" />
            <h2 className="text-2xl font-bold neon-text tracking-widest">NOTIFICATION</h2>
          </div>
          
          <p className="text-center text-xl text-secondary mb-8">
            Congratulations on Your Lavel Up<br />
            <span className="font-bold">You Have Pending Rewards</span>. Will you accept?
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-8 py-2 border-2 border-secondary text-secondary hover:bg-secondary hover:text-black transition-colors duration-300"
            >
              ACCEPT
            </button>
            <button
              onClick={onClose}
              className="px-8 py-2 border-2 border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white transition-colors duration-300"
            >
              DECLINE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}