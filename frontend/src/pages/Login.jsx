import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.user.username);
    navigate("/dashboard");
  } catch {
    alert("Login failed");
  }
};

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#eeeeee" }}
    >
      {/* Background geometric shapes */}
      <div
        className="absolute top-0 right-0 w-64 h-64 -translate-y-1/4 translate-x-1/4"
        style={{ backgroundColor: "#ffd966" }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 translate-y-1/4 -translate-x-1/4"
        style={{ backgroundColor: "#f44336" }}
      />
      <div
        className="absolute bottom-24 right-20 w-28 h-28 rounded-full"
        style={{ backgroundColor: "#2986cc" }}
      />

      {/* Card */}
      <div
        className="relative z-10 flex w-[800px] h-[520px] border-[3px] border-[#1a1a1a]"
        style={{ boxShadow: "8px 8px 0px #1a1a1a" }}
      >
        {/* Left decorative panel */}
        <div
          className="w-[280px] flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          <div className="p-8 flex flex-col gap-2 w-full">
            <div
              className="text-5xl font-black leading-none tracking-widest"
              style={{ color: "#ffd966", fontFamily: "'Arial Black', sans-serif" }}
            >
              on
              <br />
              TRACK
            </div>
            <div className="w-16 h-1 my-2" style={{ backgroundColor: "#f44336" }} />
            <div
              className="text-[11px] font-bold tracking-[4px]"
              style={{ color: "#eeeeee", fontFamily: "Arial, sans-serif" }}
            >
              EST. 2025
            </div>

            {/* Bauhaus geometric composition */}
            <div className="relative mt-8 h-40">
              <div
                className="absolute top-0 left-0 w-16 h-16 rounded-full"
                style={{ backgroundColor: "#2986cc" }}
              />
              <div
                className="absolute top-8 left-12 w-14 h-14"
                style={{ backgroundColor: "#f44336" }}
              />
              <div
                className="absolute top-[90px] left-2"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "28px solid transparent",
                  borderRight: "28px solid transparent",
                  borderBottom: "48px solid #ffd966",
                }}
              />
              <div
                className="absolute top-24 left-20 w-20 h-4"
                style={{ backgroundColor: "#eeeeee" }}
              />
              <div
                className="absolute top-32 left-5 w-3 h-3 rounded-full"
                style={{ backgroundColor: "#f44336" }}
              />
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex flex-col" style={{ backgroundColor: "#eeeeee" }}>
          {/* Header bar */}
          <div
            className="flex items-center gap-4 px-10 py-5 border-b-[3px] border-[#1a1a1a]"
            style={{ backgroundColor: "#2986cc" }}
          >
            <span
              className="text-3xl font-black tracking-[6px]"
              style={{ color: "#eeeeee", fontFamily: "'Arial Black', sans-serif" }}
            >
              LOGIN
            </span>
            <div
              className="w-3 h-3 rounded-full border-2 border-[#1a1a1a]"
              style={{ backgroundColor: "#ffd966" }}
            />
          </div>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            className="flex-1 flex flex-col justify-center px-10 py-8"
          >
            <div className="mb-5">
              <label
                className="block text-[10px] font-bold tracking-[3px] mb-1.5"
                style={{ color: "#1a1a1a", fontFamily: "Arial, sans-serif" }}
              >
                EMAIL
              </label>
              <input
                className="w-full px-3.5 py-3 border-[3px] border-[#1a1a1a] text-sm outline-none transition-colors focus:border-[#2986cc] focus:bg-white"
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

            <div className="mb-5">
              <label
                className="block text-[10px] font-bold tracking-[3px] mb-1.5"
                style={{ color: "#1a1a1a", fontFamily: "Arial, sans-serif" }}
              >
                PASSWORD
              </label>
              <input
                type="password"
                className="w-full px-3.5 py-3 border-[3px] border-[#1a1a1a] text-sm outline-none transition-colors focus:border-[#2986cc] focus:bg-white"
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
              className="w-full py-3.5 mt-2 border-[3px] border-[#1a1a1a] text-sm font-black tracking-[4px] cursor-pointer transition-colors hover:text-[#ffd966]"
              style={{
                borderRadius: 0,
                backgroundColor: "#f44336",
                color: "#eeeeee",
                fontFamily: "'Arial Black', sans-serif",
                boxShadow: "3px 3px 0px #1a1a1a",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a1a1a")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f44336")}
            >
              LOGIN →
            </button>

            <div className="flex items-center gap-3 mt-6">
              <div className="flex-1 h-0.5" style={{ backgroundColor: "#1a1a1a" }} />
              <span
                className="text-[10px] font-bold tracking-[2px]"
                style={{ color: "#1a1a1a", fontFamily: "Arial, sans-serif" }}
              >
                NO ACCOUNT?
              </span>
              <Link
                to="/signup"
                className="text-[10px] font-black tracking-[2px] px-2.5 py-1 border-2 border-[#1a1a1a] no-underline"
                style={{
                  backgroundColor: "#1a1a1a",
                  color: "#eeeeee",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                SIGN UP
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}