import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, GripVertical, Pencil, Check, X } from "lucide-react";
import type { Task } from "@/lib/store";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onUpdate: (text: string, time: string) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const TaskItem = ({
  task,
  onToggle,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: TaskItemProps) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editTime, setEditTime] = useState(task.time);

  const handleSave = () => {
    onUpdate(editText, editTime);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditTime(task.time);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-2 p-3 rounded-lg bg-secondary/50">
        <input
          className="bg-input text-foreground font-body text-sm px-3 py-2 rounded-md border border-border focus:ring-1 focus:ring-primary outline-none"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <input
          className="bg-input text-foreground font-body text-sm px-3 py-2 rounded-md border border-border focus:ring-1 focus:ring-primary outline-none"
          value={editTime}
          onChange={(e) => setEditTime(e.target.value)}
          placeholder="Ex: 19h00 - 21h00"
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 text-xs font-display font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-md"
          >
            <Check className="w-3 h-3" /> Salvar
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 text-xs font-display font-bold bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md ring-1 ring-inset ring-border"
          >
            <X className="w-3 h-3" /> Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="group flex items-center gap-2 p-2 rounded-lg hover:bg-surface-elevated transition-colors"
      layout
      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
    >
      {/* Reorder controls */}
      <div className="flex flex-col opacity-0 group-hover:opacity-60 transition-opacity">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="text-muted-foreground hover:text-foreground disabled:opacity-20 p-0.5"
        >
          <GripVertical className="w-3 h-3" />
        </button>
      </div>

      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`w-5 h-5 rounded-sm border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          task.completed
            ? "bg-primary border-primary"
            : "border-border hover:border-muted-foreground"
        }`}
      >
        {task.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
          >
            <Check className="w-3 h-3 text-primary-foreground" />
          </motion.div>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          {task.time && (
            <span className="text-muted-foreground text-xs font-body flex-shrink-0">
              {task.time}
            </span>
          )}
          <span
            className={`text-sm font-body transition-colors ${
              task.completed
                ? "line-through text-muted-foreground"
                : "text-foreground"
            }`}
          >
            {task.text}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-md hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskItem;
