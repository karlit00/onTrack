import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import DateDetailModal from "../components/DateDetailModal";

export default function Calendar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [records, setRecords] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateDetails, setSelectedDateDetails] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const headers = { Authorization: token };

  const formatLocalDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const habitsRes = await api.get("/habits", { headers });
        setHabits(habitsRes.data);

        const start = new Date();
        start.setDate(start.getDate() - 90);

        const recordsRes = await api.get("/habits/records", {
          headers,
          params: {
            startDate: formatLocalDate(start),
            endDate: formatLocalDate(new Date()),
          },
        });

        setRecords(recordsRes.data);
      } catch (err) {
        console.error("Calendar load error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token]);

  if (!token) return <Navigate to="/" replace />;

  /* =========================
     HELPERS
  ========================= */
  const getDateCompletion = (date) => {
    const dateStr = formatLocalDate(date);
    const dayRecords = records.filter((r) => {
      const recordDate = new Date(r.date);
      return formatLocalDate(recordDate) === dateStr;
    });

    if (habits.length === 0) return 0;

    const completed = dayRecords.filter((r) => r.wasCompleted).length;
    return (completed / habits.length) * 100;
  };

  const getHeatmapColor = (p) => {
    if (p === 0) return "bg-gray-100";
    if (p < 25) return "bg-red-300";
    if (p < 50) return "bg-orange-300";
    if (p < 75) return "bg-yellow-300";
    if (p < 100) return "bg-lime-300";
    return "bg-green-500 text-white";
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

  const nextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const handleDateClick = (date) => {
    const dateStr = formatLocalDate(date);
    const dayRecords = records.filter((r) => {
      const recordDate = new Date(r.date);
      return formatLocalDate(recordDate) === dateStr;
    });

    const completion = getDateCompletion(date);

    setSelectedDate(date);
    setSelectedDateDetails({
      date: dateStr,
      completion,
      records: dayRecords,
      totalHabits: habits.length,
      completedHabits: dayRecords.filter((r) => r.wasCompleted).length,
    });
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
    setSelectedDateDetails(null);
  };

  /* =========================
     CALENDAR
  ========================= */
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const boxes = [];

    for (let i = 0; i < firstDay; i++) {
      boxes.push(
        <div key={`empty-${i}`} className="h-24 border-4 border-black bg-gray-100" />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day, 12, 0, 0);
      const completion = getDateCompletion(date);
      const color = getHeatmapColor(completion);
      const isToday = formatLocalDate(new Date()) === formatLocalDate(date);

      boxes.push(
        <div
          key={day}
          onClick={() => handleDateClick(date)}
          className={`
            h-24 border-4 border-black cursor-pointer p-2
            flex flex-col justify-between
            shadow-[4px_4px_0_black]
            hover:translate-x-[2px] hover:translate-y-[2px]
            hover:shadow-none transition-all
            ${color}
          `}
        >
          <div className="flex justify-between">
            <span className={`font-black text-lg ${isToday ? "underline underline-offset-2" : ""}`}>
              {day}
            </span>
            {completion === 100 && <span className="text-xl">🎉</span>}
          </div>

          <div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-2 bg-black transition-all duration-300"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="text-xs font-black mt-1">{Math.round(completion)}%</p>
          </div>
        </div>
      );
    }

    return boxes;
  };

  const totalDays = [
    ...new Set(records.map((r) => formatLocalDate(new Date(r.date)))),
  ].length;

  const perfectDays = (() => {
    if (habits.length === 0) return 0;

    const recordsByDate = {};
    records.forEach((record) => {
      const dateStr = formatLocalDate(new Date(record.date));
      if (!recordsByDate[dateStr]) recordsByDate[dateStr] = [];
      recordsByDate[dateStr].push(record);
    });

    let perfectCount = 0;
    for (const dateStr in recordsByDate) {
      const completedCount = recordsByDate[dateStr].filter((r) => r.wasCompleted).length;
      if (completedCount === habits.length) perfectCount++;
    }

    return perfectCount;
  })();

  return (
    <div className="min-h-screen bg-[#f4f0e6]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 pt-10 pb-24">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">
              Habit Progress
            </p>
            <h1 className="text-6xl font-black tracking-tight">CALENDAR</h1>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-yellow-300 border-4 border-black px-5 py-3 font-black shadow-[5px_5px_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            ← DASHBOARD
          </button>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="bg-red-400 border-4 border-black p-5 shadow-[5px_5px_0_black]">
            <p className="text-xs font-black">TOTAL HABITS</p>
            <h2 className="text-4xl font-black">{habits.length}</h2>
          </div>

          <div className="bg-blue-400 border-4 border-black p-5 shadow-[5px_5px_0_black]">
            <p className="text-xs font-black">TRACKED DAYS</p>
            <h2 className="text-4xl font-black">{totalDays}</h2>
          </div>

          <div className="bg-green-400 border-4 border-black p-5 shadow-[5px_5px_0_black]">
            <p className="text-xs font-black">PERFECT DAYS</p>
            <h2 className="text-4xl font-black">{perfectDays}</h2>
          </div>
        </div>

        {/* MONTH NAV */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={prevMonth}
            className="bg-white border-4 border-black px-4 py-2 font-black shadow-[3px_3px_0_black] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            ← PREV
          </button>

          <h2 className="text-3xl font-black">
            {currentMonth.toLocaleString("default", { month: "long" })}{" "}
            {currentMonth.getFullYear()}
          </h2>

          <button
            onClick={nextMonth}
            className="bg-white border-4 border-black px-4 py-2 font-black shadow-[3px_3px_0_black] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            NEXT →
          </button>
        </div>

        {/* WEEK HEADERS */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div
              key={day}
              className="bg-black text-white text-center py-2 font-black border-4 border-black"
            >
              {day}
            </div>
          ))}
        </div>

        {/* GRID */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20">
            <div className="w-4 h-4 bg-black animate-bounce" />
            <div className="w-4 h-4 bg-black animate-bounce [animation-delay:0.1s]" />
            <div className="w-4 h-4 bg-black animate-bounce [animation-delay:0.2s]" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
        )}
      </div>

      {/* MODAL — now a separate component */}
      <DateDetailModal
        selectedDate={selectedDate}
        selectedDateDetails={selectedDateDetails}
        onClose={handleCloseModal}
      />
    </div>
  );
}