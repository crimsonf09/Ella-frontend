import React, { useEffect, useState } from 'react';
import EditorSection from './Editor'; // or './EditorSection'

const UserProfileSection: React.FC = () => {
  const [userProfiles, setUserProfiles] = useState<Record<string, string>>({});
  const [chosenUserProfile, setChosenUserProfile] = useState<string>("");
  const [selectedProfileForEdit, setSelectedProfileForEdit] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editText, setEditText] = useState('');

  // Load on mount
  useEffect(() => {
    const savedUserProfiles = localStorage.getItem('userProfiles');
    if (savedUserProfiles) setUserProfiles(JSON.parse(savedUserProfiles));
    const savedChosenUserProfile = localStorage.getItem('chosenUserProfile');
    if (savedChosenUserProfile) setChosenUserProfile(JSON.parse(savedChosenUserProfile));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
  }, [userProfiles]);
  useEffect(() => {
    localStorage.setItem('chosenUserProfile', JSON.stringify(chosenUserProfile));
  }, [chosenUserProfile]);

  const handleSaveProfile = () => {
    if (editName.trim()) {
      setUserProfiles(prev => ({ ...prev, [editName]: editText }));
      setSelectedProfileForEdit(null);
      setEditName('');
      setEditText('');
    }
  };

  const handleChooseProfile = (name: string) => setChosenUserProfile(name);

  const handleRemoveProfile = () => setChosenUserProfile("");

  const handleDeleteProfile = (name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    setUserProfiles(prev => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
    if (chosenUserProfile === name) setChosenUserProfile("");
  };

  return (
    <div>
      <div className="font-bold text-lg mb-1">User Profile</div>
      {/* Chosen User Profile */}
      <div style={{ width: '100%', padding: '10px' }}>
        {chosenUserProfile && (
          <div
            className="inline-flex items-center px-3 py-1 m-1 text-sm"
            style={{
              background: '#B3E5FC',
              borderRadius: '20px',
              color: '#333',
            }}
          >
            {chosenUserProfile}
            <button
              onClick={handleRemoveProfile}
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
      {/* All User Profiles */}
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
        {Object.keys(userProfiles).map(profile => (
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
                  setEditText(userProfiles[profile]);
                }}
              >
                Edit
              </button>
              <button
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #aaa',
                  background: chosenUserProfile === profile ? '#bdbdbd' : '#b3e5fc',
                  cursor: chosenUserProfile === profile ? 'not-allowed' : 'pointer',
                }}
                onClick={() => handleChooseProfile(profile)}
                disabled={chosenUserProfile === profile}
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
          + New User Profile
        </button>
      </div>
      {/* Profile Editor */}
      {selectedProfileForEdit && (
        <EditorSection
          label="User Profile"
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

export default UserProfileSection;