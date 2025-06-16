import React, { useEffect, useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  // Profile State
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [choosenProfile, setChoosenProfile] = useState<string[]>([]);
  const [selectedProfileForEdit, setSelectedProfileForEdit] = useState('');
  const [editName, setEditName] = useState('');
  const [editText, setEditText] = useState('');

  // JD State (duplicated)
  const [JDs, setJDs] = useState<Record<string, string>>({});
  const [choosenJD, setChoosenJD] = useState<string>("");
  const [selectedJDForEdit, setSelectedJDForEdit] = useState('');
  const [editJDName, setEditJDName] = useState('');
  const [editJDText, setEditJDText] = useState('');

  // Modal State
  const [text, setText] = useState('');
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [selected, setSelected] = useState('');

  // Load from localStorage
  useEffect(() => {
    const savedProfiles = localStorage.getItem('profiles');
    if (savedProfiles) setProfiles(JSON.parse(savedProfiles));

    const savedJDs = localStorage.getItem('JDs');
    if (savedJDs) setJDs(JSON.parse(savedJDs));

    const savedText = localStorage.getItem('settingsText') || '';
    setText(savedText);

    const savedChosen = localStorage.getItem('chosenProfiles');
    if (savedChosen) setChoosenProfile(JSON.parse(savedChosen));

    const savedChosenJD = localStorage.getItem('chosenJD');
    if (savedChosenJD) setChoosenJD(JSON.parse(savedChosenJD));
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Modal close/save
  const handleClose = () => {
    localStorage.setItem('settingsText', text);
    onClose();
  };
  const handleSave = () => {
    localStorage.setItem('settingsText', text);
  };

  // -----------------
  // Profile Handlers
  // -----------------
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
    // Remove from chosen if present
    const updatedChosen = choosenProfile.filter(p => p !== name);
    setChoosenProfile(updatedChosen);
    localStorage.setItem('chosenProfiles', JSON.stringify(updatedChosen));
  };

  // -----------------
  // JD Handlers (duplicated)
  // -----------------
  const handleSaveJD = () => {
    if (editJDName.trim()) {
      const updated = { ...JDs, [editJDName]: editJDText };
      setJDs(updated);
      localStorage.setItem('JDs', JSON.stringify(updated));
      setSelectedJDForEdit('');
      setEditJDName('');
      setEditJDText('');
    }
  };

  const handleAddJD = (name: string) => {
    setChoosenJD(name);
    localStorage.setItem('chosenJD', JSON.stringify(name));
  };


  const handleRemoveJD = () => {
    setChoosenJD("");
    localStorage.setItem('chosenJD', JSON.stringify(""));
  };

  const handleDeleteJD = (name: string) => {
    const confirm = window.confirm(`Are you sure you want to delete JD "${name}"?`);
    if (!confirm) return;
    const updatedJDs = { ...JDs };
    delete updatedJDs[name];
    setJDs(updatedJDs);
    localStorage.setItem('JDs', JSON.stringify(updatedJDs));
    // Remove from chosen if present
    if (choosenJD === name) {
      setChoosenJD("");
      localStorage.setItem('chosenJD', JSON.stringify(""));
    }
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
          marginTop: '130px',
          marginBottom: '50px',
          height: 'auto',
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

        {/* --- JD Section (duplicated) --- */}
        <div>
          <div className="font-bold text-lg mb-1">JD (Job Descriptions)</div>
          {/* Chosen JDs */}
          <div style={{ width: '100%', padding: '10px' }}>
            {choosenJD && (
              <div
                className="inline-flex items-center px-3 py-1 m-1 text-sm"
                style={{
                  background: '#B3E5FC',
                  borderRadius: '20px',
                  color: '#333',
                }}
              >
                {choosenJD}
                <button
                  onClick={handleRemoveJD}
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
            )}
          </div>
          {/* All JDs */}
          <div
            style={{
              maxHeight: '200px',
              minHeight: '100px',
              overflowY: 'auto',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
            className="flex flex-col gap-2"
          >
            {Object.keys(JDs).map(jd => (
              <div key={jd} className="flex justify-between items-center">
                <span>{jd}</span>
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
                      setSelectedJDForEdit(jd);
                      setEditJDName(jd);
                      setEditJDText(JDs[jd]);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #aaa',
                      background: choosenJD === jd ? '#bdbdbd' : '#b3e5fc',
                      cursor: choosenJD === jd ? 'not-allowed' : 'pointer',
                    }}
                    onClick={() => handleAddJD(jd)}
                    disabled={choosenJD === jd}
                  >
                    Choose
                  </button>
                  <button
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #aaa',
                      background: '#ffcdd2',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDeleteJD(jd)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                setSelectedJDForEdit('new');
                setEditJDName('');
                setEditJDText('');
              }}
              style={{
                marginTop: 'auto',
                marginBottom: '20px',
                padding: '6px 12px',
                background: '#c8e6c9',
                border: '1px solid #888',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              + New JD
            </button>
          </div>
          {/* JD Editor */}
          {selectedJDForEdit && (
            <div
              style={{
                padding: '10px',
                border: '1px solid #aaa',
                borderRadius: '10px',
                background: '#fafafa',
                marginTop: '10px',
              }}
              className="flex flex-col gap-2"
            >
              <label className="font-semibold text-sm text-gray-800">
                JD Name:
              </label>
              <input
                value={editJDName}
                onChange={e => setEditJDName(e.target.value)}
                className="p-2"
                style={{ border: '1px solid #ccc', borderRadius: '6px' }}
              />

              <label className="font-semibold text-sm text-gray-800">
                JD Detail:
              </label>
              <textarea
                value={editJDText}
                onChange={e => setEditJDText(e.target.value)}
                className="p-2"
                style={{ height: '100px', border: '1px solid #ccc', borderRadius: '6px' }}
              />
              <button
                onClick={handleSaveJD}
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
                Save JD
              </button>
            </div>
          )}
        </div>

        {/* --- Profile Section (original) --- */}
        <div>
          <div className="font-bold text-lg mb-1">Profiles</div>
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
          {/* All Profiles */}
          <div
            style={{
              maxHeight: '200px',
              minHeight: '100px',
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
                marginTop: 'auto',
                marginBottom: '20px',
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
                marginTop: '10px',
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
    </div>
  );
};

export default SettingsModal;