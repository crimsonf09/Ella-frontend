import React, { useEffect, useState } from 'react';
import EditorSection from './Editor.tsx';
import { secureFetch } from '../../api/secureFetch';

// ---- Types ----
export interface TaskProfileSummary {
  TPId: string;
  taskProfileName: string;
}
export interface TaskProfile extends TaskProfileSummary {
  content: string;
  email: string;
  created: string; // ISO string
  lastUsed: string; // ISO string
  share: boolean;
}

// ---- API helpers ----
const BASE_URL: string = 'http://127.0.0.1:3000/api';

async function fetchTaskProfiles(): Promise<TaskProfileSummary[]> {
  const res: Response = await secureFetch(`${BASE_URL}/taskProfile/getAllTaskProfile`);
  if (!res.ok) throw new Error('Failed to fetch task profiles');
  return res.json();
}

async function fetchTaskProfileById(TPId: string): Promise<TaskProfile> {
  const res: Response = await secureFetch(
    `${BASE_URL}/taskProfile/getTaskProfile?TPId=${encodeURIComponent(TPId)}`
  );
  if (!res.ok) throw new Error('Failed to fetch task profile');
  return res.json();
}

async function createTaskProfile(name: string, content: string): Promise<TaskProfile> {
  const res: Response = await secureFetch(`${BASE_URL}/taskProfile/createTaskProfile`, {
    method: 'POST',
    body: JSON.stringify({ taskProfileName: name, content }),
  });
  if (!res.ok) throw new Error('Failed to create task profile');
  return res.json();
}

async function updateTaskProfile(TPId: string, name: string, content: string): Promise<TaskProfile> {
  const res: Response = await secureFetch(`${BASE_URL}/taskProfile/updateTaskProfile`, {
    method: 'PUT',
    body: JSON.stringify({ TPId, taskProfileName: name, content }),
  });
  if (!res.ok) throw new Error('Failed to update task profile');
  return res.json();
}

async function deleteTaskProfile(TPId: string): Promise<any> {
  const res: Response = await secureFetch(
    `${BASE_URL}/taskProfile/deleteTaskProfile`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ TPId }),
    }
  );
  if (!res.ok) throw new Error('Failed to delete task profile');
  return res.json();
}

// ---- Main Component ----
const TaskProfileSection: React.FC = () => {
  const [profiles, setProfiles] = useState<TaskProfileSummary[]>([]);
  const [chosenTPIds, setChosenTPIds] = useState<string[]>([]);
  const [editProfile, setEditProfile] = useState<TaskProfile | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editText, setEditText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  // On mount: fetch all task profiles, get chosen from localStorage
  useEffect(() => {
    setLoading(true);
    fetchTaskProfiles()
      .then((data: TaskProfileSummary[]) => setProfiles(data))
      .catch((err: Error) => alert(err.message))
      .finally(() => setLoading(false));
    const storedTPIds: string | null = localStorage.getItem('chosenTaskProfiles');
    if (storedTPIds) {
      try {
        setChosenTPIds(JSON.parse(storedTPIds));
      } catch {
        setChosenTPIds([]);
      }
    }
  }, []);

  // Save chosen task profile ids (array) to localStorage
  useEffect(() => {
    localStorage.setItem('chosenTaskProfiles', JSON.stringify(chosenTPIds));
  }, [chosenTPIds]);

  // Multi-select: add or remove TPId
  const handleToggleChooseProfile = (TPId: string) => {
    setChosenTPIds(current =>
      current.includes(TPId)
        ? current.filter(id => id !== TPId)
        : [...current, TPId]
    );
  };

  // Remove all chosen
  const handleRemoveAllProfiles = () => setChosenTPIds([]);

  // Edit (fetch full detail)
  const handleEditProfile = async (TPId: string) => {
    setLoading(true);
    try {
      const profile: TaskProfile = await fetchTaskProfileById(TPId);
      setEditProfile(profile);
      setEditName(profile.taskProfileName);
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
      if (editProfile && editProfile.TPId) {
        // update
        const updated: TaskProfile = await updateTaskProfile(editProfile.TPId, editName, editText);
        setProfiles(ps =>
          ps.map(p =>
            p.TPId === updated.TPId
              ? { TPId: updated.TPId, taskProfileName: updated.taskProfileName }
              : p
          )
        );
      } else {
        // create
        const created: TaskProfile = await createTaskProfile(editName, editText);
        setProfiles(ps => [
          { TPId: created.TPId, taskProfileName: created.taskProfileName },
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
  const handleDeleteProfile = async (TPId: string) => {
    if (!window.confirm('Are you sure you want to delete this task profile?')) return;
    setLoading(true);
    try {
      await deleteTaskProfile(TPId);
      setProfiles(ps => ps.filter(p => p.TPId !== TPId));
      setChosenTPIds(ids => ids.filter(id => id !== TPId));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="font-bold text-lg mb-1">Task Profiles</div>
      {/* Chosen Task Profiles */}
      <div style={{ width: '100%', padding: '10px' }}>
        {chosenTPIds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chosenTPIds.map(TPId => (
              <div
                key={TPId}
                className="inline-flex items-center px-3 py-1 m-1 text-sm"
                style={{
                  background: '#D1C4E9',
                  borderRadius: '20px',
                  color: '#333',
                }}
              >
                {profiles.find((p: TaskProfileSummary) => p.TPId === TPId)?.taskProfileName || 'Chosen'}
                <button
                  onClick={() => handleToggleChooseProfile(TPId)}
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
            <button
              onClick={handleRemoveAllProfiles}
              style={{
                marginLeft: '8px',
                background: '#eee',
                border: 'none',
                color: '#444',
                cursor: 'pointer',
                borderRadius: '16px',
                padding: '4px 10px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>
      {/* All Task Profiles */}
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
          profiles.map((profile: TaskProfileSummary) => (
            <div key={profile.TPId} className="flex justify-between items-center">
              <span>{profile.taskProfileName}</span>
              <div className="flex gap-2">
                <button
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #aaa',
                    background: '#e0e0e0',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleEditProfile(profile.TPId)}
                >
                  Edit
                </button>
                <button
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #aaa',
                    background: chosenTPIds.includes(profile.TPId) ? '#bdbdbd' : '#d1c4e9',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleToggleChooseProfile(profile.TPId)}
                >
                  {chosenTPIds.includes(profile.TPId) ? 'Unchoose' : 'Choose'}
                </button>
                <button
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #aaa',
                    background: '#ffcdd2',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleDeleteProfile(profile.TPId)}
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
          + New Task Profile
        </button>
      </div>
      {/* Profile Editor */}
      {editorOpen && (
        <EditorSection
          label="Task Profile"
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

export default TaskProfileSection;