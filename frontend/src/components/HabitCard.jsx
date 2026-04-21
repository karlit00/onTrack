const CARD_COLORS = [
  { bg: "bg-yellow-300", text: "text-black", border: "border-black", accent: "bg-black", bar: "bg-black" },
  { bg: "bg-blue-600", text: "text-white", border: "border-white", accent: "bg-white", bar: "bg-yellow-300" },
  { bg: "bg-red-500", text: "text-white", border: "border-white", accent: "bg-white", bar: "bg-white" },
  { bg: "bg-black", text: "text-white", border: "border-yellow-300", accent: "bg-yellow-300", bar: "bg-yellow-300" },
  { bg: "bg-green-500", text: "text-white", border: "border-white", accent: "bg-white", bar: "bg-white" },
  { bg: "bg-orange-500", text: "text-white", border: "border-white", accent: "bg-white", bar: "bg-yellow-200" },
];

const TILTS = [
  "rotate-[-2deg]",
  "rotate-[1.5deg]",
  "rotate-[-1deg]",
  "rotate-[2deg]",
  "rotate-[0deg]",
  "rotate-[-0.5deg]",
  "rotate-[1deg]",
];

const SIZE_CLASSES = [
  "row-span-1",
  "row-span-2",
  "row-span-1",
  "row-span-1",
  "row-span-2",
  "row-span-1",
];

export default function HabitCard({ habit, index, onDelete, onToggle, onUpdate }) {
  const color = CARD_COLORS[index % CARD_COLORS.length];
  const tilt = TILTS[index % TILTS.length];
  const isTall = SIZE_CLASSES[index % SIZE_CLASSES.length] === "row-span-2";

  const {
    _id,
    title,
    description = "",
    completed,
    streak = 0,
    progress = 0,
    targetCount = 1,
    currentCount = 0,
  } = habit;

  const isMultiStep = targetCount > 1;

  return (
    <div
      className={`
        ${color.bg} ${color.border} border-4
        ${tilt}
        ${isTall ? "py-8 px-6" : "p-5"}
        flex flex-col justify-between relative
        shadow-[8px_8px_0_black]
        hover:translate-x-[3px] hover:translate-y-[3px]
        hover:shadow-none hover:rotate-0
        transition-all duration-200 ease-in-out
        ${completed ? "opacity-70 scale-[0.97]" : ""}
        h-full
      `}
    >
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-4">
        <span className={`text-[10px] font-black tracking-widest uppercase opacity-50 border px-2 py-0.5 ${color.border} ${color.text}`}>
          #{String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => onUpdate(habit)}
            className={`w-7 h-7 flex items-center justify-center text-[12px] font-black border-2 ${color.border} ${color.text} hover:bg-black hover:text-white hover:border-black transition-all duration-100`}
            title="Edit"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(_id)}
            className={`w-7 h-7 flex items-center justify-center text-[12px] font-black border-2 ${color.border} ${color.text} hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-100`}
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className={`flex-1 ${isTall ? "my-6" : "my-3"}`}>
        <h3
          className={`
            ${isTall ? "text-2xl" : "text-lg"}
            font-black leading-tight tracking-tight
            ${color.text}
            ${completed ? "line-through opacity-60" : ""}
          `}
        >
          {title}
        </h3>

        {description && (
          <p className={`text-xs mt-2 opacity-75 leading-relaxed ${color.text}`}>
            {description}
          </p>
        )}
      </div>

      {/* DIVIDER */}
      <div className={`w-full h-[2px] ${color.accent} opacity-20 my-3`} />

      {/* STREAK + COUNTER */}
      <div className="flex items-center justify-between mb-2">
        <div className={`px-3 py-1 text-[11px] font-black border-2 ${color.border} ${color.text} flex items-center gap-1.5`}>
          🔥 <span>{streak} day{streak !== 1 ? "s" : ""}</span>
        </div>

        <span className={`text-[11px] font-black tabular-nums ${color.text}`}>
          {isMultiStep ? `${currentCount}/${targetCount}` : `${progress}%`}
        </span>
      </div>

      {/* PROGRESS */}
      {isMultiStep ? (
        <div className="flex gap-1.5 flex-wrap mb-4">
          {Array.from({ length: targetCount }).map((_, i) => (
            <div
              key={i}
              className={`
                w-5 h-5 border-2 border-black/40
                transition-all duration-200
                ${i < currentCount ? color.bar : "bg-black/10"}
              `}
            />
          ))}
        </div>
      ) : (
        <div className="w-full h-3 bg-black/20 border-2 border-black/30 overflow-hidden mb-4">
          <div
            className={`h-full ${color.bar} transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* ACTION BUTTON */}
      <button
        onClick={() => { if (!completed) onToggle(_id); }}
        className={`
          w-full py-2.5 text-[11px] font-black tracking-widest uppercase
          border-2 border-black
          transition-all duration-150
          ${completed
            ? "bg-green-400 text-black cursor-default shadow-[2px_2px_0_black]"
            : `bg-transparent border-current ${color.text} shadow-[4px_4px_0_rgba(0,0,0,0.4)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]`
          }
        `}
      >
        {completed
          ? "✓ Done!"
          : isMultiStep
            ? `Log +1 (${currentCount}/${targetCount})`
            : "Mark complete"
        }
      </button>

      {/* DONE BADGE */}
      {completed && (
        <div className="absolute -top-3 -right-3 text-[10px] font-black bg-green-400 text-black px-2.5 py-1 border-2 border-black rotate-12 shadow-[2px_2px_0_black]">
          DONE
        </div>
      )}
    </div>
  );
}