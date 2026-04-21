import { useState } from "react";

export default function AddHabitModal({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onAdd,
  onClose,
}) {
  const [targetCount, setTargetCount] = useState(1);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gray-100 border-4 border-black shadow-[8px_8px_0_black] p-8 w-full max-w-md">

        <h2 className="text-sm font-extrabold tracking-widest mb-6">
          NEW HABIT
        </h2>

        {/* Title */}
        <input
          autoFocus
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd(targetCount)}
          placeholder="Habit title..."
          className="w-full mb-4 px-4 py-3 border-4 border-black bg-white outline-none focus:bg-yellow-100 font-bold"
        />

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Description (optional)..."
          rows={3}
          className="w-full mb-5 px-4 py-3 border-4 border-black bg-white outline-none resize-none focus:bg-blue-100"
        />

        {/* Daily Target */}
        <div className="mb-6">
          <label className="block text-[10px] font-black tracking-widest uppercase text-gray-500 mb-2">
            Daily target
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTargetCount((n) => Math.max(1, n - 1))}
              className="w-10 h-10 border-4 border-black bg-white font-black text-xl hover:bg-yellow-300 transition-colors"
            >
              −
            </button>

            <div className="flex-1 flex flex-col items-center border-4 border-black bg-white py-2">
              <span className="text-2xl font-black leading-none">{targetCount}</span>
              <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">
                {targetCount === 1 ? "time" : "times"} / day
              </span>
            </div>

            <button
              onClick={() => setTargetCount((n) => Math.min(20, n + 1))}
              className="w-10 h-10 border-4 border-black bg-white font-black text-xl hover:bg-yellow-300 transition-colors"
            >
              +
            </button>
          </div>

          {/* Visual hint */}
          <div className="mt-3 flex gap-1.5 flex-wrap">
            {Array.from({ length: targetCount }).map((_, i) => (
              <div
                key={i}
                className="w-5 h-5 border-2 border-black bg-yellow-300"
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-gray-500 hover:text-black"
          >
            CANCEL
          </button>

          <button
            onClick={() => onAdd(targetCount)}
            className="px-6 py-2 bg-blue-600 text-white font-bold text-xs border-4 border-black shadow-[4px_4px_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            + ADD
          </button>
        </div>
      </div>
    </div>
  );
}