import React, { useState } from "react";
import { useStatus } from "../utils/StatusContext";
import { generatePrompt } from "../utils/GeneratePrompt";
import { mountSettingsModal } from "../content";
import MessageClassSelector from "./MessageClassSelectorMessageClassSelector";

export default function Box() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const score = 0.75; // Dummy score, range 0 to 1
  const suggestions = [
    "Add more detail to the task profile",
    "Clarify the role expectations",
    "Include timeline for hiring"
  ]; // Dummy suggestions

  const getEmoji = (score: number) => {
    if (score > 0.8) return "😄";
    if (score > 0.6) return "🙂";
    if (score > 0.4) return "😐";
    return "😟";
  };

  return (
    <div
      className={`relative flex flex-col border border-amber-500 rounded-xl transition-all duration-300 ease-in-out shadow-[0_0_10px_rgba(0,0,0,0.10)] bg-gray-300`}
      style={{
        height: "255px",
        width: isCollapsed ? "40px" : "250px",
        marginLeft: "12px",
        marginTop: "39px",
        overflow: "hidden"
      }}
    >
      <div className="w-full h-[30px] flex items-center px-2 bg-amber-100 border-b border-amber-400">
        <span className="text-lg">{isCollapsed ? "" : getEmoji(score)}</span>
        <button
          className="ml-auto text-xs bg-amber-400 text-white rounded px-2 py-1 hover:bg-amber-500"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? "⮞" : "×"}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 p-2 overflow-auto text-sm">
          <div className="mb-2 font-semibold">Suggestions:</div>
          <ul className="list-disc list-inside space-y-1">
            {suggestions.map((suggestion, idx) => (
              <li key={idx}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
