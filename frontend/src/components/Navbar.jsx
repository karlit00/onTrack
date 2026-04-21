import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Space+Mono:wght@400;700&display=swap');
        .font-bauhaus { font-family: 'Black Han Sans', sans-serif; }
        .font-mono-bh { font-family: 'Space Mono', monospace; }
        .bh-logout:hover { background-color: #D7191C !important; }
      `}</style>

      <nav className="grid h-[72px] border-[3px] border-bauhaus-dark overflow-hidden"
        style={{ gridTemplateColumns: "72px 72px 72px 1fr auto auto" }}>

        {/* Cell 1 — Red */}
        <div className="flex items-center justify-center bg-bauhaus-red border-r-[3px] border-bauhaus-dark">
          <svg width="40" height="40" viewBox="0 0 40 40">
            {[8, 14, 20, 26, 32].map(y => (
              <line key={y} x1="4" y1={y} x2="36" y2={y} stroke="#F5F0E8" strokeWidth="2.5"/>
            ))}
            <line x1="20" y1="4" x2="20" y2="36" stroke="#111111" strokeWidth="3"/>
          </svg>
        </div>

        {/* Cell 2 — Blue */}
        <div className="flex items-center justify-center bg-bauhaus-blue border-r-[3px] border-bauhaus-dark">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <line x1="4"  y1="4"  x2="36" y2="36" stroke="#F5F0E8" strokeWidth="2"/>
            <line x1="36" y1="4"  x2="4"  y2="36" stroke="#F5F0E8" strokeWidth="2"/>
            <line x1="4"  y1="20" x2="36" y2="20" stroke="#FFD600" strokeWidth="2.5"/>
            <line x1="20" y1="4"  x2="20" y2="36" stroke="#FFD600" strokeWidth="2.5"/>
          </svg>
        </div>

        {/* Cell 3 — Yellow */}
        <div className="flex items-center justify-center bg-bauhaus-yellow border-r-[3px] border-bauhaus-dark">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <polyline points="4,36 4,28 12,28 12,20 20,20 20,12 28,12 28,4 36,4"
              fill="none" stroke="#111111" strokeWidth="3" strokeLinejoin="miter"/>
            <polyline points="4,36 12,36 12,28 20,28 20,20 28,20 28,12 36,12 36,4"
              fill="none" stroke="#D7191C" strokeWidth="1.5" strokeLinejoin="miter"/>
          </svg>
        </div>

        {/* Logo — cream bg → dark text */}
        <div className="flex flex-col items-start justify-center px-5 bg-bauhaus-cream border-r-[3px] border-bauhaus-dark">
          <span className="font-bauhaus text-[13px] tracking-[8px] text-bauhaus-dark uppercase leading-none">
            —— on
          </span>
          <span className="font-bauhaus text-[26px] tracking-[2px] text-bauhaus-dark uppercase leading-none">
            TRACK
          </span>
          <div className="flex w-full h-[4px] mt-[5px]">
            <div className="flex-[4] bg-bauhaus-dark"/>
            <div className="flex-1 bg-bauhaus-red"/>
            <div className="flex-1 bg-bauhaus-blue"/>
            <div className="flex-1 bg-bauhaus-yellow"/>
          </div>
        </div>

        {/* User — yellow accent → dark text, cream area → dark text */}
        {username && (
          <div className="flex items-stretch border-r-[3px] border-bauhaus-dark">
            <div className="flex items-center px-[14px] bg-bauhaus-yellow border-r-[3px] border-bauhaus-dark">
              <svg width="10" height="10" viewBox="0 0 10 10">
                <rect width="10" height="10" fill="#111111"/>
              </svg>
            </div>
            <div className="flex flex-col justify-center px-4 bg-bauhaus-cream">
              <span className="font-mono-bh text-[9px] tracking-[3px] font-bold text-bauhaus-gray uppercase mb-[2px]">
                User
              </span>
              <span className="font-mono-bh text-[13px] tracking-wide font-bold text-bauhaus-dark uppercase">
                {username}
              </span>
            </div>
          </div>
        )}

        {/* Logout — dark bg → yellow text */}
        <button
          onClick={handleLogout}
          className="bh-logout flex flex-col items-center justify-center px-[22px] gap-1 bg-bauhaus-dark border-none cursor-pointer transition-colors duration-[120ms]"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <line x1="2" y1="9" x2="12" y2="9" stroke="#FFD600" strokeWidth="2"/>
            <polyline points="8,5 13,9 8,13" fill="none" stroke="#FFD600" strokeWidth="2"/>
            <path d="M9 2H16V16H9" stroke="#F5F0E8" strokeWidth="1.5" fill="none"/>
          </svg>
          <span className="font-mono-bh text-[8px] tracking-[3px] text-bauhaus-yellow uppercase font-bold">
            exit
          </span>
        </button>

      </nav>
    </>
  );
}