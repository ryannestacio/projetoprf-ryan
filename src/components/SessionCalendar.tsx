import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { formatHoursMinutes } from "@/lib/store";
import type { StudySession } from "@/lib/store";

interface SessionCalendarProps {
  sessions: StudySession[];
}

const SessionCalendar = ({ sessions }: SessionCalendarProps) => {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const MONTH_NAMES = [
    "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const dayMap = useMemo(() => {
    const map: Record<string, number> = {};
    sessions.forEach((s) => {
      const d = new Date(s.createdAt);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = d.getDate().toString();
        map[key] = (map[key] || 0) + s.durationSeconds;
      }
    });
    return map;
  }, [sessions, year, month]);

  const maxSeconds = Math.max(...Object.values(dayMap), 1);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const today = new Date();

  return (
    <motion.div
      className="bg-card rounded-3xl shadow-card p-6"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", duration: 0.5, bounce: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-foreground flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          Historico
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 rounded-md hover:bg-secondary text-muted-foreground">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-body text-foreground min-w-[120px] text-center">
            {MONTH_NAMES[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-1 rounded-md hover:bg-secondary text-muted-foreground">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
          <div key={i} className="text-center text-xs text-muted-foreground font-body py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const secs = dayMap[day.toString()] || 0;
          const intensity = secs > 0 ? Math.max(0.2, secs / maxSeconds) : 0;
          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;

          return (
            <div
              key={day}
              className={`relative aspect-square rounded-md flex flex-col items-center justify-center text-xs font-body transition-colors ${
                isToday ? "ring-1 ring-primary" : ""
              }`}
              style={{
                backgroundColor:
                  secs > 0
                    ? `hsl(45 100% 50% / ${intensity * 0.35})`
                    : "hsl(220 25% 15%)",
              }}
              title={secs > 0 ? `${formatHoursMinutes(secs)}` : ""}
            >
              <span
                className={`${
                  secs > 0 ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-xs text-muted-foreground font-body">Menos</span>
        {[0.1, 0.25, 0.5, 0.75, 1].map((v) => (
          <div
            key={v}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: `hsl(45 100% 50% / ${v * 0.35})` }}
          />
        ))}
        <span className="text-xs text-muted-foreground font-body">Mais</span>
      </div>
    </motion.div>
  );
};

export default SessionCalendar;
