import React, { useEffect, useState } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [text, setText] = useState('');

    useEffect(() => {
        const savedText = localStorage.getItem('settingsText') || '';
        setText(savedText);
    }, []);
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleClose = () => {
        localStorage.setItem('settingsText', text);
        onClose();
    };

    const handleSave = () => {
        localStorage.setItem('settingsText', text);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-xl flex justify-center items-center z-[1000]">
            <div
                style={{ width: '600px', height: '400px' }}
                className="bg-white rounded-lg p-5 flex flex-col gap-4 shadow-lg"
            >
                <div className="flex w-full justify-between items-center">
                    <div className="text-2xl font-bold mr-auto">Settings</div>
                    <button
                        className="flex w-6 h-6 hover:bg-gray-200 rounded-full justify-center items-center cursor-pointer"
                        onClick={handleClose}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-grow resize-none rounded border border-gray-300 p-4 text-base text-black focus:outline-none focus:ring-2 focus:ring-blue-400 overflow-y-auto"
                    placeholder="Write your settings here..."
                />

                <button
                    onClick={handleSave}
                    className="w-fit h-fit ml-auto px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-xl text-lg font-semibold"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;
