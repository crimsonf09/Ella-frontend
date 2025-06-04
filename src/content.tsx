// content.tsx
import type { ChangeClassProps } from "./utils/ChangeClass";
import ChangeClass from "./utils/ChangeClass";

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
