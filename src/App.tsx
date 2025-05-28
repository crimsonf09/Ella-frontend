import { useState } from "react";

function App() {
  console.log("App component rendered");
  const [isOn, setIsOn] = useState(false);
  const toggleSwitch = async () => {
    setIsOn(!isOn);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (tab?.id) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const existing = document.getElementById("my-extension-div");
            if (existing) return;

            const cover = document.querySelector("#__next > div > div.w-screen.h-screen.flex.overflow-hidden.light > main > div > div.flex.flex-col.justify-end.w-full.lg\\:px-6.md\\:px-4.px-4.bg-gradient-to-b.from-transparent.via-white.to-white.dark\\:border-white\\/20.dark\\:via-\\[\\#343541\\].dark\\:to-\\[\\#343541\\].absolute.bottom-0 > div > div.stretch.flex.flex-col.gap-3.lg\\:mx-auto.lg\\:max-w-3xl.mt-\\[40px\\]");
            if (!cover) {
              console.error("Cover element not found.");
              return;
            }

            const div = document.createElement("div");
            div.id = "my-extension-div";
            div.textContent = "🚀 Hello from the extension!";
            Object.assign(div.style, {
              position: "flex",
              padding: "10px 15px",
              backgroundColor: "#4ade80",
              color: "#000",
              fontSize: "14px",
              zIndex: "999999",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              height: "150px",
              width: "100%",
              textAlign: "left",
            });
            cover.appendChild(div);
          },
        });
      } else {
        console.error("No active tab or tab.id not found.");
      }
    } catch (err) {
      console.error("Error injecting script:", err);
    }
  };
  return (
    <div className="p-4 font-sans bg-blue-400 flex flex-col">
      <h1 className="text-2xl font-bold mb-10">🚀 PromptAID Extension</h1>
      <div className="flex items-center space-x-3 bg-sf">
        {/* Switch */}
        <div
          onClick={toggleSwitch}
          className={`relative inline-flex items-center h-6 w-11 rounded-full bg-blue-50 ${isOn ? "bg-green-600" : "bg-gray-300"
            }`}
        >
          <span
            className={`absolute left-0 top-0 h-full aspect-square rounded-full bg-white transition-transform ${isOn ? "translate-x-5" : "translate-x-0"
              }`}
          ></span>
        </div>

        {/* Label */}
        <span className="text-gray-900 font-medium">
          {isOn ? "ON" : "OFF"}
        </span>
      </div>
    </div>
  );
}

export default App;
