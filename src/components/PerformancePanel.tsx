import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown, Pencil, Check } from "lucide-react";
import { formatHoursMinutes, parseTimeDuration } from "@/lib/store";
import type { DayData, StudySession } from "@/lib/store";

interface PerformancePanelProps {
  days: DayData[];
  sessions: StudySession[];
  dailyPlannedOverride: (dayIndex: number) => number | null;
  onDailyPlannedChange: (dayIndex: number, seconds: number) => void;
  weeklyPlannedOverride: number | null;
  onWeeklyPlannedChange: (seconds: number) => void;
}

const PerformancePanel = ({ days, sessions, dailyPlannedOverride, onDailyPlannedChange, weeklyPlannedOverride, onWeeklyPlannedChange }: PerformancePanelProps) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayMapping = [6, 0, 1, 2, 3, 4, 5];
  const todayIndex = dayMapping[dayOfWeek];

  const calcPlanned = (dayIdx: number) => {
    const override = dailyPlannedOverride(dayIdx);
    if (override !== null) return override;
    return days[dayIdx]?.tasks.reduce((sum, t) => sum + parseTimeDuration(t.time), 0) || 0;
  };

  const totalPlannedToday = calcPlanned(todayIndex);
  const autoPlannedWeek = days.reduce((sum, _, i) => sum + calcPlanned(i), 0);
  const totalPlannedWeek = weeklyPlannedOverride !== null ? weeklyPlannedOverride : autoPlannedWeek;

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekSessions = sessions.filter((s) => new Date(s.createdAt) >= weekStart);
  const todaySessions = sessions.filter(
    (s) => new Date(s.createdAt).toDateString() === today.toDateString()
  );

  const actualToday = todaySessions.reduce((a, s) => a + s.durationSeconds, 0);
  const actualWeek = weekSessions.reduce((a, s) => a + s.durationSeconds, 0);

  const todayPercent = totalPlannedToday > 0 ? Math.round((actualToday / totalPlannedToday) * 100) : 0;
  const weekPercent = totalPlannedWeek > 0 ? Math.round((actualWeek / totalPlannedWeek) * 100) : 0;

  const [editing, setEditing] = useState<string | null>(null);
  const [editInput, setEditInput] = useState("");

  const parseInput = (input: string): number | null => {
    const match = input.match(/^(\d+)h\s*(\d+)?/i);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const mins = parseInt(match[2] || "0");
      return (hours * 60 + mins) * 60;
    }
    const hours = parseFloat(input);
    if (!isNaN(hours)) return hours * 3600;
    return null;
  };

  const handleSave = (key: string) => {
    const seconds = parseInput(editInput);
    if (seconds !== null) {
      if (key === "Hoje") onDailyPlannedChange(todayIndex, seconds);
      else onWeeklyPlannedChange(seconds);
    }
    setEditing(null);
  };

  const items = [
    { label: "Hoje", planned: totalPlannedToday, actual: actualToday, percent: todayPercent },
    { label: "Semana", planned: totalPlannedWeek, actual: actualWeek, percent: weekPercent },
  ];

  return (
    <motion.div
      className="bg-card rounded-3xl shadow-card p-6"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", duration: 0.5, bounce: 0, delay: 0.1 }}
    >
      <h3 className="font-display font-bold text-foreground flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        Planejado vs Realizado
      </h3>

      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-sm text-foreground">{item.label}</span>
              <div className="flex items-center gap-1">
                {item.percent >= 100 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="font-display font-bold text-sm text-foreground">
                  {item.percent}%
                </span>
              </div>
            </div>

            <div className="relative w-full h-3 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="absolute h-full bg-muted-foreground/30 rounded-full"
                style={{ width: "100%" }}
              />
              <motion.div
                className="absolute h-full bg-primary rounded-full"
                animate={{ width: `${Math.min(100, item.percent)}%` }}
                transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              />
            </div>

            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground font-body">
                Realizado: {formatHoursMinutes(item.actual)}
              </span>
              <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                Planejado: {formatHoursMinutes(item.planned)}
                {editing !== item.label && (
                  <button
                    onClick={() => {
                      const h = Math.floor(item.planned / 3600);
                      const m = Math.floor((item.planned % 3600) / 60);
                      setEditInput(`${h}h${m.toString().padStart(2, "0")}`);
                      setEditing(item.label);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
                {editing === item.label && (
                  <span className="flex items-center gap-1 ml-1">
                    <input
                      type="text"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      className="w-16 bg-input border border-border rounded px-1 py-0.5 text-xs text-foreground font-body focus:ring-1 focus:ring-primary outline-none"
                      placeholder="4h30"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleSave(item.label)}
                    />
                    <button onClick={() => handleSave(item.label)} className="p-0.5 rounded bg-primary text-primary-foreground">
                      <Check className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PerformancePanel;