import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", { username, email, password });
      navigate("/");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#eeeeee" }}
    >
      {/* Background geometric shapes */}
      <div
        className="absolute top-0 left-0 w-56 h-56 -translate-y-1/4 -translate-x-1/4"
        style={{ backgroundColor: "#2986cc" }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 translate-y-1/4 translate-x-1/4"
        style={{ backgroundColor: "#ffd966" }}
      />
      <div
        className="absolute top-16 right-48 w-24 h-24 rounded-full"
        style={{ backgroundColor: "#f44336" }}
      />
      <div
        className="absolute bottom-28 left-40 w-12 h-12"
        style={{ backgroundColor: "#1a1a1a" }}
      />

      {/* Card */}
      <div
        className="relative z-10 flex w-[800px] h-[560px] border-[3px] border-[#1a1a1a]"
        style={{ boxShadow: "8px 8px 0px #1a1a1a" }}
      >
        {/* Left form panel */}
        <div
          className="flex-1 flex flex-col border-r-[3px] border-[#1a1a1a]"
          style={{ backgroundColor: "#eeeeee" }}
        >
          {/* Header bar */}
          <div
            className="flex items-center gap-3 px-10 py-5 border-b-[3px] border-[#1a1a1a]"
            style={{ backgroundColor: "#f44336" }}
          >
            <div className="w-3.5 h-3.5 flex-shrink-0" style={{ backgroundColor: "#1a1a1a" }} />
            <span
              className="text-lg font-black tracking-[4px]"
              style={{ color: "#eeeeee", fontFamily: "'Arial Black', sans-serif" }}
            >
              CREATE ACCOUNT
            </span>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSignup}
            className="flex-1 flex flex-col justify-center px-10 py-7"
          >
            <div className="mb-4">
              <label
                className="block text-[10px] font-bold tracking-[3px] mb-1.5"
                style={{ color: "#1a1a1a", fontFamily: "Arial, sans-serif" }}
              >
                USERNAME
              </label>
              <input
                className="w-full px-3.5 py-3 border-[3px] border-[#1a1a1a] text-sm outline-none transition-colors focus:border-[#f44336] focus:bg-white"
                style={{
                  borderRadius: 0,
                  backgroundColor: "#eeeeee",
                  fontFamily: "Arial, sans-serif",
                  color: "#1a1a1a",
                }}
                placeholder="your_username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-[10px] font-bold tracking-[3px] mb-1.5"
                style={{ color: "#1a1a1a", fontFamily: "Arial, sans-serif" }}
              >
                EMAIL
              </label>
              <input
                className="w-full px-3.5 py-3 border-[3px] border-[#1a1a1a] text-sm outline-none transition-colors focus:border-[#f44336] focus:bg-white"
                style={{
                  borderRadius: 0,
                  backgroundColor: "#eeeeee",
                  fontFamily: "Arial, sans-serif",
                  color: "#1a1a1a",
                }}
                placeholder="your@email.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-[10px] font-bold tracking-[3px] mb-1.5"
                style={{ color: "#1a1a1a", fontFamily: "Arial, sans-serif" }}
              >
                PASSWORD
              </label>
              <input
                type="password"
                className="w-full px-3.5 py-3 border-[3px] border-[#1a1a1a] text-sm outline-none transition-colors focus:border-[#f44336] focus:bg-white"
                style={{
                  borderRadius: 0,
                  backgroundColor: "#eeeeee",
                  fontFamily: "Arial, sans-serif",
                  color: "#1a1a1a",
                }}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 border-[3px] border-[#1a1a1a] text-sm font-black tracking-[3px] cursor-pointer transition-colors"
              style={{
                borderRadius: 0,
                backgroundColor: "#ffd966",
                color: "#1a1a1a",
                fontFamily: "'Arial Black', sans-serif",
                boxShadow: "3px 3px 0px #1a1a1a",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1a1a1a";
                e.currentTarget.style.color = "#ffd966";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffd966";
                e.currentTarget.style.color = "#1a1a1a";
              }}
            >
              START TRACKING →
            </button>

            <div className="flex items-center gap-3 mt-5">
              <div className="flex-1 h-0.5" style={{ backgroundColor: "#1a1a1a" }} />
              <span
                className="text-[10px] font-bold tracking-[2px]"
                style={{ color: "#1a1a1a", fontFamily: "Arial, sans-serif" }}
              >
                HAVE AN ACCOUNT?
              </span>
              <Link
                to="/"
                className="text-[10px] font-black tracking-[2px] px-2.5 py-1 border-2 border-[#1a1a1a] no-underline"
                style={{
                  backgroundColor: "#2986cc",
                  color: "#eeeeee",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                LOGIN
              </Link>
            </div>
          </form>
        </div>

        {/* Right decorative panel */}
        <div
          className="w-[260px] flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          <div className="p-8 flex flex-col w-full">
            {/* Stacked label blocks */}
            <div className="self-start px-3.5 py-1.5 mb-1" style={{ backgroundColor: "#f44336" }}>
              <span
                className="text-2xl font-black tracking-[4px]"
                style={{ color: "#eeeeee", fontFamily: "'Arial Black', sans-serif" }}
              >
                BUILD
              </span>
            </div>
            <div className="self-start px-3.5 py-1.5 mb-1" style={{ backgroundColor: "#2986cc" }}>
              <span
                className="text-2xl font-black tracking-[4px]"
                style={{ color: "#eeeeee", fontFamily: "'Arial Black', sans-serif" }}
              >
                BETTER
              </span>
            </div>
            <div className="self-start px-3.5 py-1.5" style={{ backgroundColor: "#ffd966" }}>
              <span
                className="text-2xl font-black tracking-[4px]"
                style={{ color: "#1a1a1a", fontFamily: "'Arial Black', sans-serif" }}
              >
                HABITS
              </span>
            </div>

            {/* Bauhaus geometric composition */}
            <div className="relative mt-7 h-32">
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full"
                style={{ backgroundColor: "#2986cc" }}
              />
              <div
                className="absolute top-5 right-14 w-9 h-9"
                style={{ backgroundColor: "#f44336" }}
              />
              {/* Bar chart shapes */}
              <div
                className="absolute bottom-0 left-0 w-4 h-16"
                style={{ backgroundColor: "#f44336" }}
              />
              <div
                className="absolute bottom-0 left-6 w-4 h-24"
                style={{ backgroundColor: "#ffd966" }}
              />
              <div
                className="absolute bottom-0 left-12 w-4 h-12"
                style={{ backgroundColor: "#eeeeee" }}
              />
              <div
                className="absolute top-0 left-0 w-3 h-3 rounded-full"
                style={{ backgroundColor: "#ffd966" }}
              />
              <div
                className="absolute top-8 left-20 w-2 h-2 rounded-full"
                style={{ backgroundColor: "#eeeeee" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}