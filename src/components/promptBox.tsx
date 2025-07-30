import React, { useState, useEffect, useRef } from "react";
import { useStatus } from "../utils/StatusContext";
import { generatePrompt } from "../utils/GeneratePrompt";
import { mountSettingsModal } from "../content";
import MessageClassSelector from "./MessageClassSelectorMessageClassSelector";


export default function PromptBox() {
  const [promptAidMessage, setPromptAidMessage] = useState<string>("");
  const [promptAidUserMessages, setPromptAidUserMessages] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [lastestMessage, setLastestMessage] = useState<string>("");
  const { status, setStatus } = useStatus();
  const [messageClass, setMessageClass] = useState<string>("general");
  const [mode, setMode] = useState("")
  const promptAidUserMessagesRef = useRef<string>(promptAidUserMessages);

  useEffect(() => {
    setMode(status)
    console.log('update mode')
  }, [status])

  useEffect(() => {
    promptAidUserMessagesRef.current = promptAidUserMessages;
  }, [promptAidUserMessages]);

  const sendPromptMessage = () => {
    const message = promptAidUserMessagesRef.current;
    const box = document.getElementById("chat-input") as HTMLTextAreaElement | null;
    if (box) {
      box.value = message;
      box.dispatchEvent(new Event("input", { bubbles: true }));
      box.focus();
      const sendButton = document.querySelector('svg[viewBox="0 0 24 24"][class="tabler-icon tabler-icon-send "]');

      if (sendButton) {
        (sendButton as SVGElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
        setPromptAidUserMessages("");
        setPromptAidMessage("");
      }
    }
  };

  const sendMessage = () => {
    const sendButton = document.querySelector('svg[viewBox="0 0 24 24"][class="tabler-icon tabler-icon-send "]');
    (sendButton as SVGElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }

  const clickedGeneratePrompt = async () => {
    setIsThinking(true);
    const res = await generatePrompt(status,messageClass);
    if (res === "Ella is dead") {
      setStatus('error');
    }
    const box = document.getElementById("chat-input") as HTMLTextAreaElement | null;
    if (box) {
      setLastestMessage(box.value);
    }
    setPromptAidMessage(res);
    setPromptAidUserMessages(res);
    setIsThinking(false);
    return res;
  };

  const handleMessageClassChange = (messageClass: string) => {
    setMessageClass(messageClass);
  };

  useEffect(() => {
    const box = document.getElementById("chat-input") as HTMLTextAreaElement | null;
    if (!box) return;
    let typingTimer: ReturnType<typeof setTimeout> | undefined;

    const handleInput = () => {
      if (promptAidMessage !== promptAidUserMessages || box.value === lastestMessage) return;
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        clickedGeneratePrompt();
      }, 2000);
    };

    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey) && !event.shiftKey) {
        event.preventDefault();
        clearTimeout(typingTimer);
        console.log('ctrl enter')
        if (!box) return;
        if (promptAidMessage !== promptAidUserMessages || box.value === lastestMessage) {
          sendPromptMessage();
          return;
        }
        const generated = await clickedGeneratePrompt();
        if (generated) {
          await new Promise(resolve => setTimeout(resolve, 4000));
          setPromptAidMessage(generated);
          setPromptAidUserMessages(generated);
          sendPromptMessage();
        }
      } else if (event.key === "Enter" && !event.shiftKey) {
        console.log('norm enter')
        event.preventDefault();
        clearTimeout(typingTimer);
        sendMessage();
      }
    };

    box.addEventListener("input", handleInput);
    box.addEventListener("keydown", handleKeyDown);

    return () => {
      box.removeEventListener("input", handleInput);
      box.removeEventListener("keydown", handleKeyDown);
      clearTimeout(typingTimer);
    };
  }, [promptAidMessage, promptAidUserMessages, lastestMessage]);

  const toggleSettingsModal = () => {
    mountSettingsModal();
  };

  // Status color gradient map (inline)
  const statusGradient: Record<string, string> = {
    normal: "from-green-400 to-green-700",
    warning: "from-yellow-300 to-yellow-600",
    error: "from-red-400 to-red-700",
    off: "from-gray-400 to-gray-600",
    "Rewrite & Correct Mode": "from-green-300 to-green-600",
    "Contextual Expansion Mode": "from-blue-300 to-blue-600",
    "Full Prompt Generator Mode": "from-fuchsia-400 to-fuchsia-700",
    creative: "from-purple-400 to-purple-700",
    analytical: "from-indigo-400 to-indigo-700",
    technical: "from-gray-400 to-gray-700",
    casual: "from-orange-400 to-orange-700",
    professional: "from-slate-400 to-slate-700",
    debug: "from-red-400 to-red-700",
  };

  return (
    <div className="h-[160px] relative flex p-3 flex-col border border-amber-500 rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.10)]"
      style={{
        background: "#d1d5db",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)"
      }}
    >
      {(mode !== "off" && mode !== "Rewrite & Correct Mode")&&
      <MessageClassSelector 
        currentClass={messageClass}
        onClassChange={handleMessageClassChange}
      />
      }
      <div className="w-full relative flex-1">
        {/* Text Skeleton Lines */}
        {isThinking && (
          <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
            style={{
              background: "#d1d5db"
            }}
          >
            <div className="space-y-2 gap-1 flex-col flex h-full w-full pb-4">
              <div className="h-full w-3/4 bg-gray-500 rounded animate-pulse"></div>
              <div className="h-full w-full bg-gray-500 rounded animate-pulse"></div>
              <div className="h-full w-2/3 bg-gray-500 rounded animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Actual Textarea */}
        <textarea
          className={`w-full h-full rounded bg-transparent flex text-black truncate focus:outline-none whitespace-pre-wrap resize-none relative z-0 ${
            isThinking ? 'text-transparent caret-transparent' : ''
          }`}
          id="chat-input"
          placeholder={!isThinking ? "Ella" : "Ella . . ."}
          value={promptAidUserMessages}
          style={{ overflow: 'auto' }}
          rows={1}
          onChange={(e) => setPromptAidUserMessages(e.target.value)}
          disabled={isThinking}
        ></textarea>
      </div>

      <div className="absolute flex left-2 gap-2 bottom-2 rounded-sm p-1 text-neutral-800 opacity-60">
        <div
          className={`relative h-3 w-3 flex items-center justify-center rounded-full
            bg-gradient-to-br
            shadow-inner shadow-black/30
            ring-1 ring-white/20
            transition duration-300 ease-in-out
            ${statusGradient[status] || "from-gray-400 to-gray-600"}
          `}
        >
          <div className="absolute inset-0 rounded-full bg-white/10 blur-sm pointer-events-none"></div>
          <div className="absolute top-[2px] left-[2px] right-[2px] h-[2px] bg-white/20 rounded-full"></div>
        </div>
      </div>

      <div className="absolute flex right-2 gap-2 bottom-2 rounded-sm p-1 text-neutral-800 opacity-60">
        <div
          className="hover:bg-neutral-200 hover:text-neutral-900 w-fit h-fit cursor-pointer rounded-full p-1"
          onClick={clickedGeneratePrompt}
        >
          <svg fill="#6b7280" width="18px" height="18px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <title />
            <g data-name="Layer 2" id="Layer_2">
              <path d="M18,11a1,1,0,0,1-1,1,5,5,0,0,0-5,5,1,1,0,0,1-2,0,5,5,0,0,0-5-5,1,1,0,0,1,0-2,5,5,0,0,0,5-5,1,1,0,0,1,2,0,5,5,0,0,0,5,5A1,1,0,0,1,18,11Z" />
              <path d="M19,24a1,1,0,0,1-1,1,2,2,0,0,0-2,2,1,1,0,0,1-2,0,2,2,0,0,0-2-2,1,1,0,0,1,0-2,2,2,0,0,0,2-2,1,1,0,0,1,2,0,2,2,0,0,0,2,2A1,1,0,0,1,19,24Z" />
              <path d="M28,17a1,1,0,0,1-1,1,4,4,0,0,0-4,4,1,1,0,0,1-2,0,4,4,0,0,0-4-4,1,1,0,0,1,0-2,4,4,0,0,0,4-4,1,1,0,0,1,2,0,4,4,0,0,0,4,4A1,1,0,0,1,28,17Z" />
            </g>
          </svg>
        </div>
        <div
          className="hover:bg-neutral-200 hover:text-neutral-900 w-fit h-fit cursor-pointer rounded-full p-1"
          onClick={toggleSettingsModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="currentColor"
            className="text-gray-500"
          >
            <path d="M12.66 6.38L14.48 5.99L15 7.26L13.44 8.27A4.5 4.5 0 0 1 13.44 9.73L13.44 9.73L15 10.74L14.48 12.01L12.66 11.62A4.5 4.5 0 0 1 11.62 12.66L11.62 12.66L12.01 14.48L10.74 15L9.73 13.44A4.5 4.5 0 0 1 8.27 13.44L8.27 13.44L7.26 15L5.99 14.48L6.38 12.66A4.5 4.5 0 0 1 5.34 11.62L5.34 11.62L3.52 12.01L3 10.74L4.56 9.73A4.5 4.5 0 0 1 4.56 8.27L4.56 8.27L3 7.26L3.52 5.99L5.34 6.38A4.5 4.5 0 0 1 6.38 5.34L6.38 5.34L5.99 3.52L7.26 3L8.27 4.56A4.5 4.5 0 0 1 9.73 4.56L9.73 4.56L10.74 3L12.01 3.52L11.62 5.34A4.5 4.5 0 0 1 12.66 6.38ZM11.5 9a2.5 2.5 0 0 0 -5 -0a2.5 2.5 0 0 0 5 -0Z" />
          </svg>
        </div>

        <div
          onClick={() => { sendPromptMessage(); }}
          className="hover:bg-neutral-200 hover:text-neutral-900 w-fit h-fit cursor-pointer rounded-full p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="tabler-icon tabler-icon-send text-gray-500"
          >
            <path d="M10 14l11 -11" stroke="none" />
            <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" stroke="none" />
          </svg>
        </div>
      </div>
    </div>
  );
};