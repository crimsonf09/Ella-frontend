import React, { useEffect, useState } from 'react';
import UserProfileSection from './settingComponents/UserProfileSelector';
import ProfileSection from './settingComponents/ProfileSelector';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  useEffect(() => {
    setText(localStorage.getItem('settingsText') || '');
  }, []);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);
  const handleClose = () => {
    localStorage.setItem('settingsText', text);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-[100]"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={handleClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          marginTop: '90px',
          marginBottom: '50px',
          height: '600px',
          marginLeft: '20px',
          marginRight: '20px',
          width: '600px',
          minWidth: '300px',
          background: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)',
        }}
        className="flex flex-col gap-4 z-[1000] overflow-y-scroll"
      >
        <div className="flex w-full justify-between items-center">
          <div className="text-2xl font-bold mr-auto">Settings</div>
          <button
            className="flex w-6 h-6 justify-center items-center cursor-pointer hover:bg-gray-500"
            style={{ borderRadius: '50%', background: 'transparent' }}
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <UserProfileSection />
        <ProfileSection />
      </div>
    </div>
  );
};

export default SettingsModal;