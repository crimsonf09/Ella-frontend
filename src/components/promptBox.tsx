// promptBox.tsx
import React, { useState } from "react";
import  { createRoot, type Root } from "react-dom/client";

const PromptBox: React.FC = () => {
  return (
    // <div className="relative flex flex-grow flex-col rounded-xl border border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-gray-900/50 dark:bg-[#40414F] dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
    //   <div className="relative flex items-center">
    //     <textarea
    //       className="w-full resize-none border-0 rounded bg-transparent py-3 px-4 text-black dark:bg-transparent dark:text-white dark:placeholder-gray-500 truncate focus:outline-none whitespace-pre-wrap max-h-[150px]"
    //       id="chat-input"
    //       placeholder="promptAid . . ."
    //       rows={1}
    //       style={{ overflow: 'auto', height: 'auto', bottom: '64px' }}
    //     ></textarea>
    //   </div>

    //   <div
    //     className="absolute right-2 bottom-2 rounded-sm p-1 text-neutral-800 opacity-60 dark:bg-opacity-50 dark:text-neutral-100 focus:outline focus:outline-1 dark:focus:outline-white hover:bg-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-200"
    //     onClick={() => { console.log("senddddd") }}
    //   >
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       width="18"
    //       height="18"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //       stroke="currentColor"
    //       strokeWidth="2"
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //       className="tabler-icon tabler-icon-send"
    //     >
    //       <path d="M10 14l11 -11"></path>
    //       <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
    //     </svg>
    //   </div>
    // </div>
    <div>
      x
    </div>
  );
};
export { PromptBox };


const PromptBoxWrapper = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Change Class & Inject PromptBox
      </button>
      <div
        className={
          expanded
            ? "stretch flex flex-col gap-3 lg:mx-auto lg:max-w-3xl mt-[40px]"
            : "stretch flex flex-row gap-3 lg:mx-auto lg:max-w-3xl mt-[40px]"
        }
      >
        {expanded && <PromptBox />}
      </div>
    </div>
  );
};

let reactRoot: Root | null = null;
let shadowHost: HTMLElement | null = null;

function mountPromptBox() {
  if (reactRoot) {
    // Already mounted
    return;
  }

  const containerSelector = `#__next > div > div.w-screen.h-screen.flex.overflow-hidden.light > main > div > div.flex.flex-col.justify-end.w-full.lg\\:px-6.md\\:px-4.px-4.bg-gradient-to-b.from-transparent.via-white.to-white.dark\\:border-white\\/20.dark\\:via-\\[\\#343541\\].dark\\:to-\\[\\#343541\\].absolute.bottom-0 > div > div.stretch.flex.flex-row.gap-3.lg\\:mx-auto.lg\\:max-w-3xl.mt-\\[40px\\]`;

  const parent = document.querySelector(containerSelector);
  if (!parent) {
    console.warn("Mount parent container not found, will retry");
    return;
  }

  // Create container div if not exist
  if (!shadowHost) {
    shadowHost = document.createElement("div");
    shadowHost.id = "prompt-box-root";
    parent.appendChild(shadowHost);
  }

  const shadowRoot = shadowHost.shadowRoot ?? shadowHost.attachShadow({ mode: "open" });

  let mountNode = shadowRoot.querySelector("#react-root-container");
  if (!mountNode) {
    mountNode = document.createElement("div");
    mountNode.id = "react-root-container";
    shadowRoot.appendChild(mountNode);
  }

  reactRoot = createRoot(mountNode);
  reactRoot.render(<PromptBoxWrapper />);
}

function unmountPromptBox() {
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }
  if (shadowHost && shadowHost.parentElement) {
    shadowHost.parentElement.removeChild(shadowHost);
    shadowHost = null;
  }
}

// Retry logic using MutationObserver instead of setInterval

function waitForParentAndMount() {
  const containerSelector = `#__next > div > div.w-screen.h-screen.flex.overflow-hidden.light > main > div > div.flex.flex-col.justify-end.w-full.lg\\:px-6.md\\:px-4.px-4.bg-gradient-to-b.from-transparent.via-white.to-white.dark\\:border-white\\/20.dark\\:via-\\[\\#343541\\].dark\\:to-\\[\\#343541\\].absolute.bottom-0 > div > div.stretch.flex.flex-row.gap-3.lg\\:mx-auto.lg\\:max-w-3xl.mt-\\[40px\\]`;

  const tryMount = () => {
    const parent = document.querySelector(containerSelector);
    if (parent) {
      mountPromptBox();
      observer.disconnect();
    }
  };

  const observer = new MutationObserver(tryMount);
  observer.observe(document.body, { childList: true, subtree: true });

  // Try immediately once
  tryMount();
}

// Call this once on content script load or extension page load
waitForParentAndMount();

// Optionally listen to unload to clean up
window.addEventListener("beforeunload", () => {
  unmountPromptBox();
});