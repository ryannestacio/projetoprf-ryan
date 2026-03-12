import { motion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import { formatHoursMinutes, parseTimeDuration } from "@/lib/store";
import type { DayData, StudySession } from "@/lib/store";

interface PerformancePanelProps {
  days: DayData[];
  sessions: StudySession[];
}

const PerformancePanel = ({ days, sessions }: PerformancePanelProps) => {
  // Calculate planned time from task time ranges for current week
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  // Map: 0=Domingo(index 6), 1=Segunda(0), 2=Terca(1), ...
  const dayMapping = [6, 0, 1, 2, 3, 4, 5];

  let totalPlannedWeek = 0;
  let totalPlannedToday = 0;

  days.forEach((day, i) => {
    const planned = day.tasks.reduce((sum, t) => sum + parseTimeDuration(t.time), 0);
    totalPlannedWeek += planned;
    if (dayMapping[dayOfWeek] === i) {
      totalPlannedToday = planned;
    }
  });

  // Actual time from sessions
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

  const items = [
    {
      label: "Hoje",
      planned: totalPlannedToday,
      actual: actualToday,
      percent: todayPercent,
    },
    {
      label: "Semana",
      planned: totalPlannedWeek,
      actual: actualWeek,
      percent: weekPercent,
    },
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
              <span className="text-xs text-muted-foreground font-body">
                Planejado: {formatHoursMinutes(item.planned)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PerformancePanel;
