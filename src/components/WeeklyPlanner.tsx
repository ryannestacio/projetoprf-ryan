import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, ListChecks } from "lucide-react";
import DayCard from "./DayCard";
import type { DayData } from "@/lib/store";

interface WeeklyPlannerProps {
  days: DayData[];
  onToggle: (dayIndex: number, taskId: string) => void;
  onUpdate: (dayIndex: number, taskId: string, text: string, time: string) => void;
  onDelete: (dayIndex: number, taskId: string) => void;
  onAdd: (dayIndex: number) => void;
  onMove: (dayIndex: number, from: number, to: number) => void;
}

const WeeklyPlanner = ({
  days,
  onToggle,
  onUpdate,
  onDelete,
  onAdd,
  onMove,
}: WeeklyPlannerProps) => {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const totalTasks = days.reduce((a, d) => a + d.tasks.length, 0);
  const completedTasks = days.reduce(
    (a, d) => a + d.tasks.filter((t) => t.completed).length,
    0
  );
  const weekProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
        >
          <div>
            <h2 className="font-display font-bold text-h2 text-foreground flex items-center gap-3">
              <ListChecks className="w-7 h-7 text-primary" />
              Cronograma Semanal
            </h2>
            <p className="text-muted-foreground text-sm font-body mt-1">
              Trabalho + DEV + PRF
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Weekly progress */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-body text-muted-foreground">
                Semana: {completedTasks}/{totalTasks}
              </span>
              <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${weekProgress}%` }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              {(["all", "pending", "completed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-xs font-display font-bold transition-colors ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f === "all" ? "Todos" : f === "pending" ? "Pendentes" : "Concluidos"}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Day cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {days.map((day, i) => (
            <DayCard
              key={day.name}
              day={day}
              dayIndex={i}
              filter={filter}
              onToggle={(taskId) => onToggle(i, taskId)}
              onUpdate={(taskId, text, time) => onUpdate(i, taskId, text, time)}
              onDelete={(taskId) => onDelete(i, taskId)}
              onAdd={() => onAdd(i)}
              onMove={(from, to) => onMove(i, from, to)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeeklyPlanner;
