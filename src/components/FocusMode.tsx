import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle2, X, Clock, Crosshair } from "lucide-react";
import { formatTime } from "@/lib/store";

interface FocusModeProps {
  open: boolean;
  onClose: () => void;
  currentTask: string;
  onSessionComplete: (seconds: number) => void;
}

const FocusMode = ({ open, onClose, currentTask, onSessionComplete }: FocusModeProps) => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const handleComplete = useCallback(() => {
    if (seconds > 0) {
      onSessionComplete(seconds);
      setRunning(false);
      setSeconds(0);
    }
  }, [seconds, onSessionComplete]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <motion.div
          className="flex flex-col items-center gap-8 max-w-lg px-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Focus label */}
          <div className="flex items-center gap-2 text-primary">
            <Crosshair className="w-5 h-5" />
            <span className="font-display font-bold text-sm tracking-widest uppercase">
              Modo Foco
            </span>
          </div>

          {/* Current task */}
          {currentTask && (
            <p className="text-foreground font-body text-center text-lg max-w-md">
              {currentTask}
            </p>
          )}

          {/* Timer */}
          <div
            className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center ring-2 ${
              running ? "ring-primary animate-pulse-gold" : "ring-border"
            }`}
            style={{
              boxShadow: running
                ? "inset 0 0 40px hsl(45 100% 50% / 0.08), 0 0 40px hsl(45 100% 50% / 0.15)"
                : "inset 0 0 30px hsl(0 0% 0% / 0.3)",
              background: "hsl(220 25% 11%)",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
              <Clock className="w-36 h-36" />
            </div>
            <span className="font-display font-black text-5xl md:text-6xl text-foreground tabular-nums relative z-10">
              {formatTime(seconds)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!running ? (
              <button
                onClick={() => setRunning(true)}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground font-display font-bold px-6 py-3 rounded-lg ring-1 ring-inset ring-border hover:bg-surface-elevated transition-colors"
              >
                <Play className="w-4 h-4" />
                {seconds > 0 ? "CONTINUAR" : "INICIAR"}
              </button>
            ) : (
              <button
                onClick={() => setRunning(false)}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground font-display font-bold px-6 py-3 rounded-lg ring-1 ring-inset ring-border hover:bg-surface-elevated transition-colors"
              >
                <Pause className="w-4 h-4" />
                PAUSAR
              </button>
            )}

            <button
              onClick={() => { setRunning(false); setSeconds(0); }}
              className="flex items-center gap-2 bg-secondary text-secondary-foreground font-display font-bold px-6 py-3 rounded-lg ring-1 ring-inset ring-border hover:bg-surface-elevated transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              RESETAR
            </button>

            <button
              onClick={handleComplete}
              disabled={seconds === 0}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold px-6 py-3 rounded-lg hover:scale-[1.03] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:pointer-events-none shadow-gold"
            >
              <CheckCircle2 className="w-4 h-4" />
              ESTUDO REALIZADO
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FocusMode;
