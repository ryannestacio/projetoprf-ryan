import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Clock,
  TrendingUp,
  Target,
  Flame,
  CalendarDays,
  Pencil,
  Check,
} from "lucide-react";
import { formatHoursMinutes } from "@/lib/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { StudySession } from "@/lib/store";
import SessionCalendar from "./SessionCalendar";

interface DashboardProps {
  totalToday: number;
  totalWeek: number;
  totalMonth: number;
  avgDaily: number;
  sessionCount: number;
  weekSessionCount: number;
  sessions: StudySession[];
  weeklyGoalHours: number;
  onGoalChange: (hours: number) => void;
}

const DAYS_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

const DashboardSection = ({
  totalToday,
  totalWeek,
  totalMonth,
  avgDaily,
  sessionCount,
  weekSessionCount,
  sessions,
  weeklyGoalHours,
  onGoalChange,
}: DashboardProps) => {
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(weeklyGoalHours.toString());

  // Build chart data for current week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const chartData = DAYS_LABELS.map((label, i) => {
    const dayDate = new Date(weekStart);
    dayDate.setDate(dayDate.getDate() + i);
    const dayStr = dayDate.toDateString();
    const dayTotal = sessions
      .filter((s) => new Date(s.createdAt).toDateString() === dayStr)
      .reduce((a, s) => a + s.durationSeconds, 0);
    return { day: label, hours: +(dayTotal / 3600).toFixed(1) };
  });

  const weekGoalProgress = Math.min(
    100,
    (totalWeek / (weeklyGoalHours * 3600)) * 100
  );

  // Streak calculation
  const today = new Date();
  let streak = 0;
  for (let d = 0; d < 365; d++) {
    const check = new Date(today);
    check.setDate(check.getDate() - d);
    const hasSession = sessions.some(
      (s) => new Date(s.createdAt).toDateString() === check.toDateString()
    );
    if (hasSession) streak++;
    else break;
  }

  const handleGoalSave = () => {
    const val = parseInt(goalInput);
    if (!isNaN(val) && val > 0) {
      onGoalChange(val);
    }
    setEditingGoal(false);
  };

  const stats = [
    {
      label: "Hoje",
      value: formatHoursMinutes(totalToday),
      icon: Clock,
    },
    {
      label: "Semana",
      value: formatHoursMinutes(totalWeek),
      icon: CalendarDays,
    },
    {
      label: "Mes",
      value: formatHoursMinutes(totalMonth),
      icon: BarChart3,
    },
    {
      label: "Media Diaria",
      value: formatHoursMinutes(Math.round(avgDaily)),
      icon: TrendingUp,
    },
    {
      label: "Sessoes",
      value: sessionCount.toString(),
      icon: Target,
    },
    {
      label: "Sequencia",
      value: `${streak} dia${streak !== 1 ? "s" : ""}`,
      icon: Flame,
      isStreak: true,
      streakCount: streak,
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
        >
          <h2 className="font-display font-bold text-h2 text-foreground flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary" />
            Dashboard de Performance
          </h2>
          <p className="text-muted-foreground text-sm font-body mt-1">
            Banco de horas e estatisticas
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-card rounded-2xl shadow-card p-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                duration: 0.4,
                bounce: 0,
                delay: i * 0.05,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon
                  className={`w-5 h-5 ${
                    stat.isStreak && stat.streakCount > 0
                      ? "text-orange-400"
                      : "text-primary"
                  }`}
                />
                {stat.isStreak && stat.streakCount > 0 && (
                  <motion.span
                    className="text-orange-400 text-xs font-display font-bold"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    ATIVO
                  </motion.span>
                )}
              </div>
              <p className="font-display font-bold text-xl text-foreground tabular-nums">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-xs font-body">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Weekly goal + Chart + Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Weekly goal - editable */}
          <motion.div
            className="bg-card rounded-3xl shadow-card p-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-foreground">
                Meta Semanal
              </h3>
              {editingGoal ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    className="w-16 bg-input border border-border rounded-md px-2 py-1 text-sm text-foreground font-body text-center focus:ring-1 focus:ring-primary outline-none"
                    min={1}
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleGoalSave()}
                  />
                  <span className="text-sm text-muted-foreground font-body">h</span>
                  <button
                    onClick={handleGoalSave}
                    className="p-1 rounded-md bg-primary text-primary-foreground"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setGoalInput(weeklyGoalHours.toString());
                    setEditingGoal(true);
                  }}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="text-sm font-body">{weeklyGoalHours}h</span>
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="relative w-full h-4 bg-secondary rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${weekGoalProgress}%` }}
                transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              />
            </div>
            <p className="text-muted-foreground text-sm font-body">
              {formatHoursMinutes(totalWeek)} de {weeklyGoalHours}h (
              {Math.round(weekGoalProgress)}%)
            </p>
            <p className="text-muted-foreground text-xs font-body mt-1">
              {weekSessionCount} sessoes esta semana
            </p>
          </motion.div>

          {/* Chart */}
          <motion.div
            className="bg-card rounded-3xl shadow-card p-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.5, bounce: 0, delay: 0.1 }}
          >
            <h3 className="font-display font-bold text-foreground mb-4">
              Evolucao Semanal
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "hsl(220 25% 13%)",
                    border: "1px solid hsl(220 15% 25%)",
                    borderRadius: 8,
                    color: "hsl(210 20% 88%)",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value}h`, "Horas"]}
                />
                <Bar
                  dataKey="hours"
                  fill="hsl(45 100% 50%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Calendar */}
        <SessionCalendar sessions={sessions} />
      </div>
    </section>
  );
};

export default DashboardSection;
