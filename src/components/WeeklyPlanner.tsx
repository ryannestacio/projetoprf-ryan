import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ListChecks, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import DayCard from "./DayCard";
import type { DayData } from "@/lib/store";

interface WeeklyPlannerProps {
  days: DayData[];
  onToggle: (dayIndex: number, taskId: string) => void;
  onUpdate: (dayIndex: number, taskId: string, text: string, time: string) => void;
  onDelete: (dayIndex: number, taskId: string) => void;
  onAdd: (dayIndex: number) => void;
  onMove: (dayIndex: number, from: number, to: number) => void;
  onReschedule: (fromDay: number, taskId: string, toDay: number) => void;
}

const WeeklyPlanner = ({
  days,
  onToggle,
  onUpdate,
  onDelete,
  onAdd,
  onMove,
  onReschedule,
}: WeeklyPlannerProps) => {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const totalTasks = days.reduce((a, d) => a + d.tasks.length, 0);
  const completedTasks = days.reduce(
    (a, d) => a + d.tasks.filter((t) => t.completed).length,
    0
  );
  const weekProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const dayNames = days.map((d) => d.name);

  const currentDay = days[currentDayIndex];

  const handlePrevDay = () => {
    setCurrentDayIndex((prev) => (prev === 0 ? days.length - 1 : prev - 1));
  };

  const handleNextDay = () => {
    setCurrentDayIndex((prev) => (prev === days.length - 1 ? 0 : prev + 1));
  };

  const handleResetDay = () => {
    currentDay.tasks.forEach((task) => {
      if (task.completed) {
        onToggle(currentDayIndex, task.id);
      }
    });
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
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
              Carrossel semanal com foco em um dia por vez.
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

        {/* Carousel Container */}
        <div className="relative">
          {/* Day Carousel */}
          <div className="flex items-center justify-between gap-4">
            {/* Previous Button */}
            <motion.button
              onClick={handlePrevDay}
              className="flex-shrink-0 p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </motion.button>

            {/* Card Container */}
            <div className="flex-1 min-h-[500px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDayIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  className="w-full"
                >
                  <DayCard
                    day={currentDay}
                    dayIndex={currentDayIndex}
                    filter={filter}
                    onToggle={(taskId) => onToggle(currentDayIndex, taskId)}
                    onUpdate={(taskId, text, time) => onUpdate(currentDayIndex, taskId, text, time)}
                    onDelete={(taskId) => onDelete(currentDayIndex, taskId)}
                    onAdd={() => onAdd(currentDayIndex)}
                    onMove={(from, to) => onMove(currentDayIndex, from, to)}
                    onReschedule={(taskId, toDayIndex) => onReschedule(currentDayIndex, taskId, toDayIndex)}
                    dayNames={dayNames}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Button */}
            <motion.button
              onClick={handleNextDay}
              className="flex-shrink-0 p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>

          {/* Day Indicator */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {days.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentDayIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentDayIndex ? "bg-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>

          {/* Reset Button */}
          <div className="flex justify-center mt-6">
            <motion.button
              onClick={handleResetDay}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors font-display font-bold text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-4 h-4" />
              Resetar cronograma
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeeklyPlanner;
