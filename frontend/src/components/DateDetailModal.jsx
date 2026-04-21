export default function DateDetailModal({ selectedDate, selectedDateDetails, onClose }) {
  if (!selectedDate || !selectedDateDetails) return null;

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-4 border-black w-[460px] shadow-[8px_8px_0_black] max-h-[80vh] flex flex-col"
      >
        {/* Static header */}
        <div className="p-6 pb-0">
          <h2 className="text-3xl font-black mb-4">
            {formatDate(selectedDate)}
          </h2>

          <div className="bg-yellow-300 border-4 border-black p-4 mb-4">
            <p className="font-black text-lg">
              Completion: {Math.round(selectedDateDetails.completion)}%
            </p>
            <div className="w-full bg-black/20 h-2 mt-2">
              <div
                className="bg-black h-2 transition-all"
                style={{ width: `${selectedDateDetails.completion}%` }}
              />
            </div>
            <p className="text-sm mt-2">
              ✅ {selectedDateDetails.completedHabits}/{selectedDateDetails.totalHabits} habits completed
            </p>
          </div>

          <p className="font-black text-sm mb-3">Habit Details:</p>
        </div>

        {/* Only this section scrolls */}
        <div className="overflow-y-auto flex-1 px-6 space-y-3">
          {selectedDateDetails.records.length === 0 ? (
            <p className="text-gray-500 italic">No activity recorded this day.</p>
          ) : (
            selectedDateDetails.records.map((r) => (
              <div key={r.habitId} className="border-4 border-black p-3">
                <p className="font-black">{r.habitTitle}</p>
                <p className="text-sm mt-1">
                  {r.wasCompleted
                    ? "✓ Completed"
                    : `${r.completedCount}/${r.targetCount} completions (${r.progress}%)`}
                </p>
                <div className="w-full bg-gray-200 h-1.5 mt-2">
                  <div
                    className="bg-black h-1.5"
                    style={{ width: `${r.progress}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Static footer */}
        <div className="p-6 pt-4">
          <button
            onClick={onClose}
            className="w-full bg-red-400 border-4 border-black py-3 font-black hover:bg-red-500 transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}