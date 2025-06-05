import React, { useEffect, useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [selected, setSelected] = useState('');
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [selectedProfileForEdit, setSelectedProfileForEdit] = useState('');
  const [editName, setEditName] = useState('');
  const [editText, setEditText] = useState('');
  const [choosenProfile, setChoosenProfile] = useState<string[]>([]);

  useEffect(() => {
    const savedProfiles = localStorage.getItem('profiles');
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    }

    const savedText = localStorage.getItem('settingsText') || '';
    setText(savedText);

    const savedChosen = localStorage.getItem('chosenProfiles');
    if (savedChosen) {
      setChoosenProfile(JSON.parse(savedChosen));
    }
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

  const handleSaveProfile = () => {
    if (editName.trim()) {
      const updated = { ...profiles, [editName]: editText };
      setProfiles(updated);
      localStorage.setItem('profiles', JSON.stringify(updated));
      setSelectedProfileForEdit('');
      setEditName('');
      setEditText('');
    }
  };

  const handleAddProfile = (name: string) => {
    if (!choosenProfile.includes(name)) {
      const updated = [...choosenProfile, name];
      setChoosenProfile(updated);
      localStorage.setItem('chosenProfiles', JSON.stringify(updated));
    }
  };

  const handleRemoveProfile = (name: string) => {
    const updated = choosenProfile.filter(p => p !== name);
    setChoosenProfile(updated);
    localStorage.setItem('chosenProfiles', JSON.stringify(updated));
  };

  const handleDeleteProfile = (name: string) => {
    const confirm = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirm) return;

    const updatedProfiles = { ...profiles };
    delete updatedProfiles[name];
    setProfiles(updatedProfiles);
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));

    // Also remove from chosen if it's there
    const updatedChosen = choosenProfile.filter(p => p !== name);
    setChoosenProfile(updatedChosen);
    localStorage.setItem('chosenProfiles', JSON.stringify(updatedChosen));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-[1000]"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          width: '600px',
          minHeight: '700px',
          background: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)',
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex w-full justify-between items-center">
          <div className="text-2xl font-bold mr-auto">Settings</div>
          <button
            className="flex w-6 h-6 justify-center items-center cursor-pointer"
            style={{ borderRadius: '50%', background: 'transparent' }}
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Dropdown */}
        <div className="flex gap-4">
          <div
            className="relative w-64 text-sm font-medium"
            style={{
              background: 'white',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              border: '1px solid gray',
              borderRadius: '8px',
            }}
            onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
          >
            <div className="w-full px-4 py-2 text-left">
              {selected || 'Select Profile'}
              <span className="float-right">▼</span>
            </div>
            {dropdownIsOpen && (
              <div
                className="absolute z-10 w-full mt-2"
                style={{
                  background: '#f0f0f0',
                  borderRadius: '8px',
                }}
              >
                {['planner', 'trading desk', 'IT'].map(option => (
                  <div
                    key={option}
                    onClick={() => {
                      setSelected(option);
                      setDropdownIsOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer"
                    style={{ borderBottom: '1px solid #ccc' }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chosen Profiles */}
          <div style={{ width: '100%', padding: '10px' }}>
            {choosenProfile.map(profile => (
              <div
                key={profile}
                className="inline-flex items-center px-3 py-1 m-1 text-sm"
                style={{
                  background: '#FFECB3',
                  borderRadius: '20px',
                  color: '#333',
                }}
              >
                {profile}
                <button
                  onClick={() => handleRemoveProfile(profile)}
                  style={{
                    marginLeft: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: '#444',
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* All Profiles */}
        <div
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }}
          className="flex flex-col gap-2"
        >
          {Object.keys(profiles).map(profile => (
            <div key={profile} className="flex justify-between items-center">
              <span>{profile}</span>
              <div className="flex gap-2">
                <button
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #aaa',
                    background: '#e0e0e0',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedProfileForEdit(profile);
                    setEditName(profile);
                    setEditText(profiles[profile]);
                  }}
                >
                  Edit
                </button>
                <button
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #aaa',
                    background: '#b3e5fc',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleAddProfile(profile)}
                >
                  Add
                </button>
                <button
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #aaa',
                    background: '#ffcdd2',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleDeleteProfile(profile)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              setSelectedProfileForEdit('new');
              setEditName('');
              setEditText('');
            }}
            style={{
              marginTop: '10px',
              padding: '6px 12px',
              background: '#c8e6c9',
              border: '1px solid #888',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            + New Profile
          </button>
        </div>

        {/* Profile Editor */}
        {selectedProfileForEdit && (
          <div
            style={{
              padding: '10px',
              border: '1px solid #aaa',
              borderRadius: '10px',
              background: '#fafafa',
            }}
            className="flex flex-col gap-2"
          >
            <label className="font-semibold text-sm text-gray-800">
              Profile Name:
            </label>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="p-2"
              style={{ border: '1px solid #ccc', borderRadius: '6px' }}
            />

            <label className="font-semibold text-sm text-gray-800">
              Profile Detail:
            </label>
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              className="p-2"
              style={{ height: '100px', border: '1px solid #ccc', borderRadius: '6px' }}
            />
            <button
              onClick={handleSaveProfile}
              className="self-end mt-2"
              style={{
                padding: '6px 12px',
                background: '#4CAF50',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Save Profile
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SettingsModal;
