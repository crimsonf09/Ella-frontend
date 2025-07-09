import React, { useEffect, useState } from 'react';
import UserProfileSection from './settingComponents/UserProfileSelector';
import ProfileSection from './settingComponents/ProfileSelector';
import LoginRegisterPage from './settingComponents/authentication';
import { checkLoginStatus, logout } from '../api/auth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const refreshLoginStatus = () => {
    setChecking(true);
    checkLoginStatus().then(isLoggedIn => {
      setLoggedIn(isLoggedIn);
      setChecking(false);
    });
  };

  useEffect(() => {
    if (isOpen) refreshLoginStatus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-[100] bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="z-[1000] flex flex-col mx-5 mt-[90px] mb-[50px] w-[600px] max-w-[95vw] min-w-[300px] bg-white rounded-lg p-5 shadow-lg overflow-y-auto"
        style={{
          // height: 'calc(100vh - 140px)', // Calculate height dynamically
          maxHeight: 'calc(100vh - 140px)', // Calculate height dynamically
        }}
      >
        <div className="flex w-full justify-between items-center">
          <div className="text-2xl font-bold mr-auto">Settings</div>
          <button
            className="flex w-6 h-6 justify-center items-center cursor-pointer hover:bg-gray-500 rounded-full bg-transparent"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div
          className="overflow-y-auto flex-grow pr-2" // pr-2 for scrollbar spacing
        >
          {checking ? (
            <div className="flex justify-center items-center py-8 text-lg text-gray-500">
              Checking login status...
            </div>
          ) : !loggedIn ? (
            <LoginRegisterPage onLoginSuccess={refreshLoginStatus} />
          ) : (
            <>
              {/* Logout and settings panel */}
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-lg">Account</div>
                <button
                  className="font-bold text-red-500 border border-red-200 px-4 py-1 rounded hover:bg-red-100 transition"
                  onClick={async () => {
                    await logout();
                    refreshLoginStatus();
                  }}
                >
                  Logout
                </button>
              </div>
              <div
                className="font-sans bg-[#f6f7fa] rounded-lg p-6 mb-4 min-h-[80px] text-center text-[#888] text-lg border border-[#e3f0fc]"
              >
                Settings Panel (coming soon)
              </div>
              {/* User/Profile sections */}
              <UserProfileSection />
              <ProfileSection />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
