import React, { useEffect, useState } from 'react';
import EditorSection from './Editor';

const ProfileSection: React.FC = () => {
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [choosenProfile, setChoosenProfile] = useState<string[]>([]);
  const [selectedProfileForEdit, setSelectedProfileForEdit] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const savedProfiles = localStorage.getItem('profiles');
    if (savedProfiles) setProfiles(JSON.parse(savedProfiles));
    const savedChosen = localStorage.getItem('chosenProfiles');
    if (savedChosen) setChoosenProfile(JSON.parse(savedChosen));
  }, []);

  useEffect(() => {
    localStorage.setItem('profiles', JSON.stringify(profiles));
  }, [profiles]);
  useEffect(() => {
    localStorage.setItem('chosenProfiles', JSON.stringify(choosenProfile));
  }, [choosenProfile]);

  const handleSaveProfile = () => {
    if (editName.trim()) {
      setProfiles(prev => ({ ...prev, [editName]: editText }));
      setSelectedProfileForEdit(null);
      setEditName('');
      setEditText('');
    }
  };

  const handleAddProfile = (name: string) => {
    if (!choosenProfile.includes(name)) {
      setChoosenProfile(prev => [...prev, name]);
    }
  };

  const handleRemoveProfile = (name: string) => {
    setChoosenProfile(prev => prev.filter(p => p !== name));
  };

  const handleDeleteProfile = (name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    setProfiles(prev => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
    setChoosenProfile(prev => prev.filter(p => p !== name));
  };

  return (
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
            <div
              onClick={() => handleRemoveProfile(profile)}
              style={{
                marginLeft: '8px',
                background: 'transparent',
                border: 'none',
                color: '#444',
                cursor: 'pointer',
              }}
              className="rounded-full hover:bg-gray-400"
            >
              ×
            </div>
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
        <EditorSection
          label="Profile"
          name={editName}
          detail={editText}
          setName={setEditName}
          setDetail={setEditText}
          onSave={handleSaveProfile}
          onCancel={() => setSelectedProfileForEdit(null)}
        />
      )}
    </div>
  );
};

export default ProfileSection;