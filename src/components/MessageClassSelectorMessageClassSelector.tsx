// MessageClassSelector.tsx
import React, { useRef } from 'react';

const MESSAGESCLASS = [
  { id: "auto", name: "Auto Mode (Smart)", icon: "✨" },
  { id: "general", name: "General Mode", icon: "🌐" },
  { id: "research_insight", name: "Research Insight", icon: "🔬" },
  { id: "strategy_planning", name: "Strategy Planning", icon: "🧭" },
  { id: "goal_breakdown", name: "Goal Breakdown", icon: "🎯" },
  { id: "creative_idea_generation", name: "Creative Idea Generation", icon: "💡" },
  { id: "judgment_decision", name: "Judgment Decision", icon: "⚖️" },
  { id: "judgment_hr_decision", name: "HR Judgment Decision", icon: "👥" },
  { id: "idea_validation", name: "Idea Validation", icon: "✅" },
  { id: "paraphrase", name: "Paraphrase", icon: "🔁" },
  { id: "candidate_screening", name: "Candidate Screening", icon: "📋" }
];


interface MessageClassSelectorProps {
  currentClass: string;
  onClassChange: (classId: string) => void;
}

const MessageClassSelector: React.FC<MessageClassSelectorProps> = ({
  currentClass,
  onClassChange
}) => {
  const [showClassSelector, setShowClassSelector] = React.useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  const handleClassSelect = (classId: string) => {
    onClassChange(classId);
    setShowClassSelector(false);
  };

  const current = MESSAGESCLASS.find((c) => c.id === currentClass);

  return (
    <div className="mb-2 relative" ref={selectorRef}>
      <div
        className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-white/70 transition-colors border border-gray-300"
        onClick={() => setShowClassSelector(prev => !prev)}
      >
        <span className="text-sm">{current?.icon || '❓'}</span>
        <span className="text-sm font-medium text-gray-700 flex-1">{current?.name || 'Unknown Class'}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${showClassSelector ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {showClassSelector && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[120px] overflow-y-auto">
          {MESSAGESCLASS.map((classOption) => (
            <div
              key={classOption.id}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                currentClass === classOption.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleClassSelect(classOption.id);
              }}
            >
              <span className="text-sm">{classOption.icon}</span>
              <span className={`text-sm ${currentClass === classOption.id ? 'font-semibold text-blue-700' : 'text-gray-700'}`}>
                {classOption.name}
              </span>
              {currentClass === classOption.id && (
                <svg className="w-4 h-4 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageClassSelector;
