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
      className="min-h-screen flex items-center justify-center font-sans bg-gradient-to-br from-blue-100 to-purple-100"
    >
      <div className="bg-white rounded-3xl shadow-xl p-12 w-full max-w-md transition-shadow overflow-hidden">
        <div className="flex mb-8 space-x-4">
          <button
            className={`flex-1 py-3 rounded-2xl text-lg font-semibold transition-colors cursor-pointer ${
              tab === "login"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 rounded-2xl text-lg font-semibold transition-colors cursor-pointer ${
              tab === "register"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setTab("register")}
          >
            Register
          </button>
        </div>
        <div className="h-fit">
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