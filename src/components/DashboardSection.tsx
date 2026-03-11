import { motion } from "framer-motion";
import {
  BarChart3,
  Clock,
  TrendingUp,
  Target,
  Zap,
  CalendarDays,
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

interface DashboardProps {
  totalToday: number;
  totalWeek: number;
  totalMonth: number;
  avgDaily: number;
  sessionCount: number;
  weekSessionCount: number;
  sessions: StudySession[];
  weeklyGoalHours?: number;
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
  weeklyGoalHours = 40,
}: DashboardProps) => {
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
      icon: Zap,
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
              <stat.icon className="w-5 h-5 text-primary mb-2" />
              <p className="font-display font-bold text-xl text-foreground tabular-nums">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-xs font-body">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Weekly goal + Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weekly goal */}
          <motion.div
            className="bg-card rounded-3xl shadow-card p-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          >
            <h3 className="font-display font-bold text-foreground mb-4">
              Meta Semanal: {weeklyGoalHours}h
            </h3>
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
      </div>
    </section>
  );
};

export default DashboardSection;
