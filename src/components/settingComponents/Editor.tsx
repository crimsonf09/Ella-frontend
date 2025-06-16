import React from 'react';

type EditorSectionProps = {
  label: string;
  name: string;
  detail: string;
  setName: (v: string) => void;
  setDetail: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

const EditorSection: React.FC<EditorSectionProps> = ({
  label, name, detail, setName, setDetail, onSave, onCancel
}) => (
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
      {label} Name:
    </label>
    <input
      value={name}
      onChange={e => setName(e.target.value)}
      className="p-2"
      style={{ border: '1px solid #ccc', borderRadius: '6px' }}
    />
    <label className="font-semibold text-sm text-gray-800">
      {label} Detail:
    </label>
    <textarea
      value={detail}
      onChange={e => setDetail(e.target.value)}
      className="p-2"
      style={{ height: '100px', border: '1px solid #ccc', borderRadius: '6px' }}
    />
    <div className="flex gap-2 justify-end mt-2">
      <button
        onClick={onCancel}
        style={{
          padding: '6px 12px',
          background: '#aaa',
          color: 'white',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
      <button
        onClick={onSave}
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
        Save {label}
      </button>
    </div>
  </div>
);

export default EditorSection;