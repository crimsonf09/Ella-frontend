import React, { useEffect, useState } from "react";
import { useStatus } from "../../utils/StatusContext"; // Adjust path as needed

type StatusType =
  | "off"
  | "warning"
  | "error"
  | "Rewrite & Correct Mode"
  | "Contextual Expansion Mode"
  | "Full Prompt Generator Mode";

type ModeOption = {
  value: StatusType;
  label: string;
  description: string;
  ring: string; // Tailwind ring color
  bg: string;   // Tailwind background color
  text: string; // Tailwind text color
};

const MODES: ModeOption[] = [
  {
    value: "off",
    label: "Rewrite & Correct Mode",
    description: "Fix grammar and paraphrase sentences.",
    ring: "ring-gray-400",
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
  {
    value: "Rewrite & Correct Mode",
    label: "Rewrite & Correct Mode",
    description: "Fix grammar and paraphrase sentences.",
    ring: "ring-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
  },
  {
    value: "Contextual Expansion Mode",
    label: "Contextual Expansion Mode",
    description: "Add more context from previous user input to the sentence.",
    ring: "ring-blue-400",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  {
    value: "Full Prompt Generator Mode",
    label: "Full Prompt Generator Mode",
    description: "Generate a full, ready-to-use prompt for the AI.",
    ring: "ring-fuchsia-400",
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-700",
  },
];

const MODE_STORAGE_KEY = "assistantMode";

const SettingsPanel: React.FC = () => {
  const { status, setStatus } = useStatus();
  const [selectedMode, setSelectedMode] = useState<StatusType>("off");

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(MODE_STORAGE_KEY);
    if (stored && MODES.some(m => m.value === stored)) {
      setSelectedMode(stored as StatusType);
    }
  }, []);

  // Save to localStorage and set context status on change
  useEffect(() => {
    localStorage.setItem(MODE_STORAGE_KEY, selectedMode);
    if (status !== "error" && status !== "warning") {
      setStatus(selectedMode);
      console.log(selectedMode)
    }
    // eslint-disable-next-line
  }, [selectedMode]);

  return (
    <div className="mb-4 p-4 bg-slate-50 rounded border border-slate-200">
      <div className="font-bold text-lg mb-2">Assistant Mode</div>
      {MODES.map(mode => {
        const isSelected = selectedMode === mode.value;
        return (
          <label
            key={mode.value}
            className={`flex items-start gap-3 w-full rounded-xl p-4 mb-3 cursor-pointer transition
              border ${isSelected ? `${mode.ring} ring-2 border-transparent` : "border-slate-200"}
              ${mode.bg}
            `}
          >
            <input
              type="radio"
              name="assistantMode"
              value={mode.value}
              checked={isSelected}
              onChange={() => setSelectedMode(mode.value)}
              className={`mt-1 accent-current focus:ring-2 ${mode.ring}`}
            />
            <span>
              <span className={`font-semibold ${mode.text}`}>{mode.label}</span>
              <span className="block text-sm text-gray-500 mt-1">{mode.description}</span>
            </span>
          </label>
        );
      })}
      <div className="mt-2 text-sm">
        <span>Current mode: </span>
        <span
          className={
            "font-semibold " +
            (MODES.find(m => m.value === selectedMode)?.text || "text-gray-800")
          }
        >
          {MODES.find(m => m.value === selectedMode)?.label}
        </span>
      </div>
    </div>
  );
};

export default SettingsPanel;