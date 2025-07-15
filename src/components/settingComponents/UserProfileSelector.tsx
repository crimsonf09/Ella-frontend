import React, { useEffect, useState } from 'react';
import EditorSection from './Editor.tsx';
import { secureFetch } from '../../api/secureFetch'; // You must provide this!

// ---- Types (matching your schema) ----
export interface PersonalProfileSummary {
  PPId: string;
  personalProfileName: string;
}
export interface PersonalProfile extends PersonalProfileSummary {
  content: string;
  email: string;
  created: string; // ISO string
  lastUsed: string; // ISO string
  share: boolean;
}

// ---- API helpers ----
const BASE_URL: string = 'http://127.0.0.1:3000/api';


async function fetchProfiles(): Promise<PersonalProfileSummary[]> {
  const res: Response = await secureFetch(`${BASE_URL}/personalProfile/getAllPersonalProfile`);
  if (!res.ok) throw new Error('Failed to fetch profiles');
  return res.json();
}

async function fetchProfileById(PPId: string): Promise<PersonalProfile> {
  const res: Response = await secureFetch(
    `${BASE_URL}/personalProfile/getPersonalProfile?PPId=${encodeURIComponent(PPId)}`
  );
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

async function createProfile(name: string, content: string): Promise<PersonalProfile> {
  const res: Response = await secureFetch(`${BASE_URL}/personalProfile/createPersonalProfile`, {
    method: 'POST',
    body: JSON.stringify({ personalProfileName: name, content }),
  });
  if (!res.ok) throw new Error('Failed to create profile');
  return res.json();
}

async function updateProfile(PPId: string, name: string, content: string): Promise<PersonalProfile> {
  const res: Response = await secureFetch(`${BASE_URL}/personalProfile/updatePersonalProfile`, {
    method: 'PUT',
    body: JSON.stringify({ PPId, personalProfileName: name, content }),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

async function deleteProfile(PPId: string): Promise<any> {
  const res: Response = await secureFetch(
    `${BASE_URL}/personalProfile/deletePersonalProfile?PPId=${encodeURIComponent(PPId)}`,
    { method: 'DELETE' }
  );
  if (!res.ok) throw new Error('Failed to delete profile');
  return res.json();
}
// ---- Main Component ----
const UserProfileSection: React.FC = () => {
  const [profiles, setProfiles] = useState<PersonalProfileSummary[]>([]);
  const [chosenPPId, setChosenPPId] = useState<string>('');
  const [editProfile, setEditProfile] = useState<PersonalProfile | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editText, setEditText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  // On mount: fetch all profile names/ids, get chosen from localStorage
  useEffect(() => {
    setLoading(true);
    fetchProfiles()
      .then((data: PersonalProfileSummary[]) => setProfiles(data))
      .catch((err: Error) => alert(err.message))
      .finally(() => setLoading(false));
    const storedPPId: string | null = localStorage.getItem('chosenUserProfile');
    if (storedPPId) setChosenPPId(storedPPId);
  }, []);

  // Save chosen profile id to localStorage
  useEffect(() => {
    if (chosenPPId)
      localStorage.setItem('chosenUserProfile', chosenPPId);
    else
      localStorage.removeItem('chosenUserProfile');
  }, [chosenPPId]);

  // Choose
  const handleChooseProfile = (PPId: string) => setChosenPPId(PPId);

  // Remove chosen
  const handleRemoveProfile = () => setChosenPPId('');

  // Edit (fetch full detail)
  const handleEditProfile = async (PPId: string) => {
    setLoading(true);
    try {
      const profile: PersonalProfile = await fetchProfileById(PPId);
      setEditProfile(profile);
      setEditName(profile.personalProfileName);
      setEditText(profile.content);
      setEditorOpen(true);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Save (update or create)
  const handleSaveProfile = async () => {
    if (!editName.trim()) return alert('Please enter a profile name');
    setLoading(true);
    try {
      if (editProfile && editProfile.PPId) {
        // update
        const updated: PersonalProfile = await updateProfile(editProfile.PPId, editName, editText);
        setProfiles(ps =>
          ps.map(p =>
            p.PPId === updated.PPId
              ? { PPId: updated.PPId, personalProfileName: updated.personalProfileName }
              : p
          )
        );
      } else {
        // create
        const created: PersonalProfile = await createProfile(editName, editText);
        setProfiles(ps => [
          { PPId: created.PPId, personalProfileName: created.personalProfileName },
          ...ps,
        ]);
      }
      setEditProfile(null);
      setEditName('');
      setEditText('');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDeleteProfile = async (PPId: string) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) return;
    setLoading(true);
    try {
      await deleteProfile(PPId);
      setProfiles(ps => ps.filter(p => p.PPId !== PPId));
      if (chosenPPId === PPId) handleRemoveProfile();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="font-bold text-lg mb-1">User Profile</div>
      {/* Chosen User Profile */}
      <div style={{ width: '100%', padding: '10px' }}>
        {chosenPPId && (
          <div
            className="inline-flex items-center px-3 py-1 m-1 text-sm"
            style={{
              background: '#B3E5FC',
              borderRadius: '20px',
              color: '#333',
            }}
          >
            {profiles.find((p: PersonalProfileSummary) => p.PPId === chosenPPId)?.personalProfileName || 'Chosen'}
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
        {loading ? (
          <div>Loading...</div>
        ) : (
          profiles.map((profile: PersonalProfileSummary) => (
            <div key={profile.PPId} className="flex justify-between items-center">
              <span>{profile.personalProfileName}</span>
              <div className="flex gap-2">
                <button
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #aaa',
                    background: '#e0e0e0',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleEditProfile(profile.PPId)}
                >
                  Edit
                </button>
                <button
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #aaa',
                    background: chosenPPId === profile.PPId ? '#bdbdbd' : '#b3e5fc',
                    cursor: chosenPPId === profile.PPId ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => handleChooseProfile(profile.PPId)}
                  disabled={chosenPPId === profile.PPId}
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
                  onClick={() => handleDeleteProfile(profile.PPId)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
        <button
          onClick={() => {
            setEditProfile(null);
            setEditName('');
            setEditText('');
            setEditorOpen(true);
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
      {editorOpen && (
        <EditorSection
          label="User Profile"
          name={editName}
          detail={editText}
          setName={setEditName}
          setDetail={setEditText}
          onSave={async () => {
            await handleSaveProfile();
            setEditorOpen(false);
          }}
          onCancel={() => {
            setEditProfile(null);
            setEditName('');
            setEditText('');
            setEditorOpen(false);
          }}
        />
      )}

    </div>
  );
};

export default UserProfileSection;