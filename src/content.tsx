// content.tsx
import type { ChangeClassProps } from "./utils/ChangeClass";
import ChangeClass from "./utils/ChangeClass";
import { createRoot, type Root } from "react-dom/client";
import PromptBox from "./components/promptBox"; // Your actual component
import tailwindStyles from "./App.css?inline"; // Raw text import of Tailwind
import SettingsModal from "./components/SettingsModal";
import { useState } from "react";
import './index.css'
import './App.css'
// 1. Change target class using classList.contains (not selector string)
const initialize = () => {
  const cover: ChangeClassProps = {
    name: "chatbox",
    selector: '#__next > div > div.w-screen.h-screen.flex.overflow-hidden.light > main > div > div.flex.flex-col.justify-end.w-full.lg\\:px-6.md\\:px-4.px-4.bg-gradient-to-b.from-transparent.via-white.to-white.dark\\:border-white\\/20.dark\\:via-\\[\\#343541\\].dark\\:to-\\[\\#343541\\].absolute.bottom-0 > div > div.stretch.flex.flex-row.gap-3.lg\\:mx-auto.lg\\:max-w-3xl.mt-\\[40px\\]',
    changedClassName: "stretch flex flex-col gap-3 lg:mx-auto lg:max-w-3xl mt-[40px]"
  };
  ChangeClass(cover);
  const scroll: ChangeClassProps = {
    name: "scroll",
    selector: '#__next > div > div.w-screen.h-screen.flex.overflow-hidden.light > main > div > div.w-full.h-full.overflow-x-hidden',
    changedClassName: "w-full h-full overflow-x-hidden pb-30"
  };
  const targetElement = document.querySelector(scroll.selector)
  if (targetElement) {
    (targetElement as HTMLElement).style.paddingBottom = "200px";
  }
  else {
    console.warn(`Target element "${scroll.name}" not found.`);
  }


};

// 3. Attach listener when the chat input is ready
const boxCheck = () => {
  const box = document.getElementById("chat-input") as HTMLTextAreaElement | null;

  if (!box) {
    console.log("Waiting for chat input...");
    return false;
  }

  box.addEventListener("input", () => {
    console.log("User typed:", box.value);
  });

  console.log("Listener attached");
  return true;
};

const interval = setInterval(() => {
  if (boxCheck()) {
    clearInterval(interval);
    initialize();
  }
}, 500);

// 4.injection
// content-script.tsx (or wherever you run this)

let reactRoot: Root | null = null;
let shadowHost: HTMLElement | null = null;
const containerSelector =
  "main div.flex.flex-col.justify-end.w-full.lg\\:px-6.md\\:px-4.px-4.bg-gradient-to-b.from-transparent.via-white.to-white.dark\\:border-white\\/20.dark\\:via-\\[\\#343541\\].dark\\:to-\\[\\#343541\\].absolute.bottom-0 > div > div.stretch.flex.flex-row.gap-3.lg\\:mx-auto.lg\\:max-w-3xl.mt-\\[40px\\]";

function mountPromptBox() {
  if (reactRoot) return;

  const parent = document.querySelector(containerSelector);
  if (!parent) {
    console.warn("Target container not found.");
    return;
  }

  shadowHost = document.createElement("div");
  shadowHost.id = "prompt-box-root";
  parent.appendChild(shadowHost);

  const shadowRoot = shadowHost.attachShadow({ mode: "open" });

  const styleTag = document.createElement("style");
  styleTag.textContent = tailwindStyles;
  shadowRoot.appendChild(styleTag);

  const container = document.createElement("div");
  container.id = "react-root-container";
  shadowRoot.appendChild(container);

  reactRoot = createRoot(container);
  reactRoot.render(<PromptBox />);
}

function unmountPromptBox() {
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }
  if (shadowHost?.parentElement) {
    shadowHost.parentElement.removeChild(shadowHost);
    shadowHost = null;
  }
}

function waitForContainerAndMount() {
  const observer = new MutationObserver(() => {
    const target = document.querySelector(containerSelector);
    if (target) {
      observer.disconnect();
      mountPromptBox();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Fallback: also try immediately in case it's already there
  if (document.querySelector(containerSelector)) {
    mountPromptBox();
  }
}

// INIT
waitForContainerAndMount();
window.addEventListener("beforeunload", unmountPromptBox);
 

let root: Root | null = null;
let host: HTMLElement | null = null;

export function mountSettingsModal() {
  if (!host) {
    host = document.createElement('div');
    host.id = 'settings-modal-host';
    document.body.appendChild(host);

    const shadowRoot = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = tailwindStyles;
    shadowRoot.appendChild(style);

    const mountNode = document.createElement('div');
    shadowRoot.appendChild(mountNode);

    root = createRoot(mountNode);
  }

  const handleClose = () => {
    root?.render(<></>); // Just unrender the modal component but keep host/root alive
  };

  root?.render(<SettingsModal isOpen={true} onClose={handleClose} />);
}
mountSettingsModal();