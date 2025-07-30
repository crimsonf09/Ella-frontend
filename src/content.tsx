// content.tsx
import type { ChangeClassProps } from "./utils/ChangeClass";
import ChangeClass from "./utils/ChangeClass";
import { createRoot, type Root } from "react-dom/client";
import PromptBox from "./components/promptBox";
import SettingsModal from "./components/SettingsModal";
import Box from "./components/box"; // ✅ Added your Box component
import { StatusProvider } from "./utils/StatusContext";

import tailwindStyles from "./App.css?inline";
import './index.css';
import './App.css';

const initialize = () => {
  const cover: ChangeClassProps = {
    name: "chatbox",
    selector: '#__next > div > div.w-screen.h-screen.flex.overflow-hidden.light > main > div > div.flex.flex-col.justify-end.w-full.lg\\:px-6.md\\:px-4.px-4.bg-gradient-to-b.from-transparent.via-white.to-white.dark\\:border-white\\/20.dark\\:via-\\[\\#343541\\].dark\\:to-\\[\\#343541\\].absolute.bottom-0 > div > div.stretch.flex.flex-row.gap-3.lg\\:mx-auto.lg\\:max-w-3xl.mt-\\[40px\\]',
    changedClassName: "stretch flex flex-col gap-3 lg:mx-auto lg:max-w-3xl mt-[40px] w-full"
  };
  ChangeClass(cover);

  const scroll: ChangeClassProps = {
    name: "scroll",
    selector: '#__next > div > div.w-screen.h-screen.flex.overflow-hidden.light > main > div > div.w-full.h-full.overflow-x-hidden',
    changedClassName: "w-full h-full overflow-x-hidden pb-30"
  };
  const targetElement = document.querySelector(scroll.selector);

  const cover1: ChangeClassProps = {
    name: "chatbox",
    selector: '#__next > div > div.w-screen.h-screen.flex.overflow-hidden.light > main > div.relative.flex.flex-col.w-full.h-screen.justify-between.bg-white.dark\\:bg-\\[\\#343541\\].overflow-y-auto.overflow-x-hidden > div.flex.flex-col.justify-end.w-full.lg\\:px-6.md\\:px-4.px-4.bg-gradient-to-b.from-transparent.via-white.to-white.dark\\:border-white\\/20.dark\\:via-\\[\\#343541\\].dark\\:to-\\[\\#343541\\].absolute.bottom-0 > div',
    changedClassName: "w-full max-[880px]:py-3 py-5 relative flex"
  };
  ChangeClass(cover1);

  // ✅ Mount <Box /> inside cover1 element
  const cover1Element = document.querySelector(cover1.selector);
  if (cover1Element && !document.getElementById("box-mount-root")) {
    const boxMount = document.createElement("div");
    boxMount.id = "box-mount-root";
    cover1Element.appendChild(boxMount);

    const boxRoot = createRoot(boxMount);
    boxRoot.render(
      <StatusProvider>
        <Box />
      </StatusProvider>
    );

  }

  if (targetElement) {
    (targetElement as HTMLElement).style.paddingBottom = "200px";
  }
};

const boxCheck = () => {
  const box = document.getElementById("chat-input") as HTMLTextAreaElement | null;
  if (!box) return false;
  box.addEventListener("input", () => {});
  return true;
};

const interval = setInterval(() => {
  if (boxCheck()) {
    clearInterval(interval);
    initialize();
  }
}, 500);

let reactRoot: Root | null = null;
let shadowHost: HTMLElement | null = null;

const containerSelector =
  "main div.flex.flex-col.justify-end.w-full.lg\\:px-6.md\\:px-4.px-4.bg-gradient-to-b.from-transparent.via-white.to-white.dark\\:border-white\\/20.dark\\:via-\\[\\#343541\\].dark\\:to-\\[\\#343541\\].absolute.bottom-0 > div > div.stretch.flex.flex-row.gap-3.lg\\:mx-auto.lg\\:max-w-3xl.mt-\\[40px\\]";

function mountPromptBox() {
  if (reactRoot) return;

  const parent = document.querySelector(containerSelector);
  if (!parent) return;

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
  reactRoot.render(
    <StatusProvider>
      <PromptBox />
    </StatusProvider>
  );
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

  if (document.querySelector(containerSelector)) {
    mountPromptBox();
  }
}

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
    root?.render(<></>);
  };

  root?.render(
    <StatusProvider>
      <SettingsModal isOpen={true} onClose={handleClose} />
    </StatusProvider>
  );
}

mountSettingsModal();
