import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import HabitCard from "../components/HabitCard";
import AddHabitModal from "../components/AddHabitModal";

const SIZE_CLASSES = [
  "row-span-1",
  "row-span-2",
  "row-span-1",
  "row-span-1",
  "row-span-2",
  "row-span-1",
];

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: token };

  useEffect(() => {
    if (!token) navigate("/");
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/habits", { headers });
        setHabits(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
  const completedToday = habits.filter(h => h.completed).length;

  const addHabit = async (targetCount = 1) => {
    if (!title.trim()) return;
    try {
      const res = await api.post("/habits", { title, description, targetCount }, { headers });
      setHabits(prev => [res.data, ...prev]);
      setTitle("");
      setDescription("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await api.delete(`/habits/${id}`, { headers });
      setHabits(prev => prev.filter(h => h._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const res = await api.patch(`/habits/${id}`, { increment: true }, { headers });
      setHabits(prev => prev.map(h => (h._id === id ? res.data : h)));
    } catch (err) {
      console.error(err);
    }
  };

  const updateHabit = async (habit) => {
    const newTitle = prompt("Update title:", habit.title);
    const newDesc = prompt("Update description:", habit.description);
    if (!newTitle) return;
    try {
      const res = await api.patch(`/habits/${habit._id}`, { title: newTitle, description: newDesc }, { headers });
      setHabits(prev => prev.map(h => (h._id === habit._id ? res.data : h)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Navbar />

      {/* Header */}
      <div className="px-8 pt-10 pb-6 flex items-end justify-between border-b-[3px] border-[#111]">
        <div>
          <p className="text-[10px] font-black tracking-[4px] uppercase text-[#888] mb-1">
            Your board
          </p>
          <h1 className="text-6xl font-black tracking-tight text-[#111] uppercase">
            My Habits
          </h1>
        </div>
        <button
          onClick={() => navigate("/calendar")}
          className="border-[3px] border-[#111] bg-[#1A56DB] px-6 py-3 text-[11px] font-black tracking-[3px] text-white uppercase shadow-[4px_4px_0_#111] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          Calendar
        </button>
      </div>

      {/* Stats */}
      <div className="px-8 py-8 flex gap-6">

        {/* Habits */}
        <div className="bg-[#FFD600] border-[3px] border-[#111] p-8 flex flex-col justify-between w-48 h-48 shadow-[8px_8px_0_#111] flex-shrink-0">
          <p className="text-[9px] font-black tracking-[4px] uppercase text-[#111]/60">
            Habits
          </p>
          <div>
            <p className="text-6xl font-black text-[#111] leading-none">{habits.length}</p>
            <p className="text-[9px] font-black tracking-[2px] uppercase text-[#111]/50 mt-1">
              tracked
            </p>
          </div>
        </div>

        {/* Best Streak */}
        <div className="bg-[#D7191C] border-[3px] border-[#111] p-8 flex flex-col justify-between w-48 h-48 shadow-[8px_8px_0_#111] flex-shrink-0">
          <p className="text-[9px] font-black tracking-[4px] uppercase text-white/60">
            Best Streak
          </p>
          <div>
            <p className="text-6xl font-black text-white leading-none">{bestStreak}</p>
            <p className="text-[9px] font-black tracking-[2px] uppercase text-white/50 mt-1">
              days
            </p>
          </div>
        </div>

        {/* Completed Today */}
        <div className="bg-[#111] border-[3px] border-[#111] p-8 flex flex-col justify-between w-48 h-48 shadow-[8px_8px_0_#555] flex-shrink-0">
          <p className="text-[9px] font-black tracking-[4px] uppercase text-white/40">
            Completed
          </p>
          <div>
            <p className="text-6xl font-black text-[#FFD600] leading-none">{completedToday}</p>
            <p className="text-[9px] font-black tracking-[2px] uppercase text-white/30 mt-1">
              today
            </p>
          </div>
        </div>

      </div>

      {/* Grid */}
      <div className="px-8 pb-32">
        {loading ? (
          <div className="flex items-center gap-3 py-12">
            <div className="w-4 h-4 bg-[#111] animate-bounce" />
            <div className="w-4 h-4 bg-[#D7191C] animate-bounce [animation-delay:0.1s]" />
            <div className="w-4 h-4 bg-[#FFD600] animate-bounce [animation-delay:0.2s]" />
          </div>
        ) : habits.length === 0 ? (
          <div className="border-[3px] border-dashed border-[#111] p-16 text-center">
            <p className="text-xl font-black text-[#888] uppercase tracking-widest">No habits yet.</p>
            <p className="text-sm text-[#888] mt-2 tracking-wider">Hit + to add your first one.</p>
          </div>
        ) : (
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: "repeat(3, 1fr)",
              gridAutoRows: "minmax(220px, auto)",
            }}
          >
            {habits.map((h, index) => (
              <div
                key={h._id}
                style={{
                  gridRow: SIZE_CLASSES[index % SIZE_CLASSES.length] === "row-span-2"
                    ? "span 2"
                    : "span 1",
                }}
              >
                <HabitCard
                  habit={h}
                  index={index}
                  onDelete={deleteHabit}
                  onToggle={toggleComplete}
                  onUpdate={updateHabit}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#FFD600] text-[#111] text-3xl font-black border-[3px] border-[#111] shadow-[6px_6px_0_#111] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150"
      >
        +
      </button>

      {showModal && (
        <AddHabitModal
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onAdd={addHabit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}