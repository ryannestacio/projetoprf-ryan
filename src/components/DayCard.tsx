import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import TaskItem from "./TaskItem";
import type { DayData } from "@/lib/store";

interface DayCardProps {
  day: DayData;
  dayIndex: number;
  onToggle: (taskId: string) => void;
  onUpdate: (taskId: string, text: string, time: string) => void;
  onDelete: (taskId: string) => void;
  onAdd: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  filter: "all" | "pending" | "completed";
}

const DayCard = ({
  day,
  dayIndex,
  onToggle,
  onUpdate,
  onDelete,
  onAdd,
  onMove,
  filter,
}: DayCardProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const filteredTasks = day.tasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const completedCount = day.tasks.filter((t) => t.completed).length;
  const progress = day.tasks.length > 0 ? (completedCount / day.tasks.length) * 100 : 0;

  return (
    <motion.div
      className="bg-card rounded-3xl shadow-card p-6"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", duration: 0.4, bounce: 0, delay: dayIndex * 0.05 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="font-display font-bold text-foreground text-lg">
            {day.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-body text-muted-foreground">
            {completedCount}/{day.tasks.length}
          </span>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-secondary text-muted-foreground"
          >
            {collapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-secondary rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
        />
      </div>

      {/* Tasks */}
      {!collapsed && (
        <div className="space-y-1">
          {filteredTasks.map((task, i) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => onToggle(task.id)}
              onUpdate={(text, time) => onUpdate(task.id, text, time)}
              onDelete={() => onDelete(task.id)}
              onMoveUp={() => {
                const realIndex = day.tasks.findIndex((t) => t.id === task.id);
                if (realIndex > 0) onMove(realIndex, realIndex - 1);
              }}
              onMoveDown={() => {
                const realIndex = day.tasks.findIndex((t) => t.id === task.id);
                if (realIndex < day.tasks.length - 1) onMove(realIndex, realIndex + 1);
              }}
              isFirst={i === 0}
              isLast={i === filteredTasks.length - 1}
            />
          ))}

          <button
            onClick={onAdd}
            className="flex items-center gap-2 w-full p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-surface-elevated transition-colors text-sm font-body"
          >
            <Plus className="w-4 h-4" />
            Adicionar tarefa
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default DayCard;
