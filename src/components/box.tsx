import React, { useState, useEffect, useRef } from "react";
import { generatePromptSuggestion } from "../utils/GenerateContextSuggestion";

export default function Box() {
  const [score, setScore] = useState<number>(0);
  const [suggestion, setSuggestion] = useState<[string]>([""]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const lastQuestionRef = useRef("");
  const [requestInProgress, setRequestInProgress] = useState(false); // Add this state

  const getEmoji = (score: number) => {
    if (score > 0.7) return "😄";
    if (score > 0.5) return "🙂";
    if (score > 0.3) return "😐";
    return "😟";
  };

  const fetchSuggestions = async () => {
    const box = document.getElementById("chat-input") as HTMLTextAreaElement | null;
    if (!box || box.value.trim() === "") {
      setSuggestion([""]);
      return;
    }

    const currentQuestion = box.value;
    if (currentQuestion === lastQuestionRef.current) {
      return;
    }

    lastQuestionRef.current = currentQuestion;

    if (requestInProgress) {  // Check if a request is already in progress
      return;
    }

    setIsLoading(true);
    setRequestInProgress(true); // Set the flag

    try {
      const result = await generatePromptSuggestion(currentQuestion);
      console.log("Generated suggestion:", result);
      console.log(typeof result.score)
      console.log(typeof result.suggestions)
      if (result && typeof result.score === "number" && typeof result.suggestions === "string") {
        setScore(result.score);
        setSuggestion(result.suggestions.split("\n"));
        console.log("Suggestion set:", result.suggestion);
      } else {
        console.warn("Unexpected result format from generatePromptSuggestion:", result);
        setSuggestion(["Error getting suggestion."]);
        setScore(0);
      }
    } catch (err) {
      console.error("Error fetching prompt suggestion:", err);
      setSuggestion(["Error getting suggestion."]);
      setScore(0);
      if (typingTimer.current) {
        clearTimeout(typingTimer.current); // Clear the timer on error
        typingTimer.current = null;
      }
    } finally {
      setIsLoading(false);
      setRequestInProgress(false); // Clear the flag
    }
  };

  useEffect(() => {
    const box = document.getElementById("chat-input") as HTMLTextAreaElement | null;
    if (!box) return;

    const handleInput = () => {

      if (typingTimer.current) clearTimeout(typingTimer.current);

      if (box.value.trim() !== "") {
        typingTimer.current = setTimeout(() => {
          fetchSuggestions();
        }, 4000);
      } else {
        setSuggestion([""]);
      }
    };

    box.addEventListener("input", handleInput);

    return () => {
      box.removeEventListener("input", handleInput);
      if (typingTimer.current) clearTimeout(typingTimer.current);

    };
  }, []);

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
      <div className="w-full h-[30px] flex items-center px-2 pt-2 bg-amber-100 border-b border-amber-400">
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
          <div className="mb-2 font-semibold">Suggestion:</div>
          <p className="text-gray-800">
            {isLoading ? (
              <span className="text-gray-500">Loading...</span>
            ) : suggestion ? (
              suggestion.map((line, index) => (
                <span key={index} className="block mb-1">
                  {line}
                </span>
              ))
            ) : (
              <span className="text-gray-500">No suggestions yet.</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}