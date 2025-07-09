import React, { useState } from "react";
import { register as registerAPI, login as loginAPI } from "../../api/auth";
import LoginForm from "./LoginForm.tsx";
import RegisterForm from "./RegisterForm.tsx";

const Authentication: React.FC<{ onLoginSuccess?: () => void }> = ({
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [regSuccess, setRegSuccess] = useState("");

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans"
      style={{
        background: `linear-gradient(135deg, #e3f0fc 0%, #edeaff 100%)`, // keep gradient as inline style
      }}
    >
      <div
        className="bg-[#f6f7fa] rounded-[22px] shadow-[0_4px_24px_rgba(80,120,200,0.07)] p-9 w-full max-w-[430px] transition-shadow overflow-hidden"
      >
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 rounded-l-[16px] ${
              tab === "login"
                ? "bg-[#90caf9] text-[#234] font-bold shadow-[0_2px_8px_#90caf930]"
                : "bg-[#f6f7fa] text-[#888] font-medium"
            } border-none outline-none transition-colors cursor-pointer`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-r-[16px] ${
              tab === "register"
                ? "bg-[#90caf9] text-[#234] font-bold shadow-[0_2px_8px_#90caf930]"
                : "bg-[#f6f7fa] text-[#888] font-medium"
            } border-none outline-none transition-colors cursor-pointer`}
            onClick={() => setTab("register")}
          >
            Register
          </button>
        </div>
        <div className="h-fit pr-2">
          {/* h-fit makes the height adjust to the content */}
          {tab === "login" ? (
            <LoginForm onLoginSuccess={onLoginSuccess} />
          ) : (
            <RegisterForm
              registerAPI={registerAPI}
              regSuccess={regSuccess}
              setRegSuccess={setRegSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Authentication;