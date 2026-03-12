import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle2, Clock, Timer } from "lucide-react";
import { formatTime } from "@/lib/store";

interface StopwatchProps {
  onSessionComplete: (seconds: number) => void;
}

const Stopwatch = ({ onSessionComplete }: StopwatchProps) => {
  // Persist: accumulated seconds when paused, and startedAt timestamp when running
  const [accumulated, setAccumulated] = useState<number>(() => {
    try { return JSON.parse(localStorage.getItem("prf-sw-accumulated") || "0"); } catch { return 0; }
  });
  const [startedAt, setStartedAt] = useState<number | null>(() => {
    try { return JSON.parse(localStorage.getItem("prf-sw-startedAt") || "null"); } catch { return null; }
  });

  const running = startedAt !== null;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [displaySeconds, setDisplaySeconds] = useState(() => {
    if (startedAt) return accumulated + Math.floor((Date.now() - startedAt) / 1000);
    return accumulated;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("prf-sw-accumulated", JSON.stringify(accumulated));
  }, [accumulated]);
  useEffect(() => {
    localStorage.setItem("prf-sw-startedAt", JSON.stringify(startedAt));
  }, [startedAt]);

  // Tick
  useEffect(() => {
    if (running) {
      const tick = () => setDisplaySeconds(accumulated + Math.floor((Date.now() - startedAt!) / 1000));
      tick();
      intervalRef.current = setInterval(tick, 1000);
    } else {
      setDisplaySeconds(accumulated);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, accumulated, startedAt]);

  const handleStart = useCallback(() => setRunning(true), []);
  const handlePause = useCallback(() => setRunning(false), []);
  const handleReset = useCallback(() => {
    setRunning(false);
    setSeconds(0);
  }, []);
  const handleComplete = useCallback(() => {
    if (seconds > 0) {
      onSessionComplete(seconds);
      setRunning(false);
      setSeconds(0);
    }
  }, [seconds, onSessionComplete]);

  return (
    <section id="cronometro" className="py-16 px-4">
      <motion.div
        className="max-w-lg mx-auto"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", duration: 0.5, bounce: 0 }}
      >
        <div className="text-center mb-6">
          <h2 className="font-display font-bold text-h2 text-foreground flex items-center justify-center gap-3">
            <Timer className="w-7 h-7 text-primary" />
            CRONOMETRO
          </h2>
          <p className="text-muted-foreground text-sm mt-1 font-body">
            Registre suas horas liquidas de estudo
          </p>
        </div>

        <div className="bg-card rounded-3xl shadow-card p-8 flex flex-col items-center">
          {/* Timer circle */}
          <div
            className={`relative w-52 h-52 md:w-64 md:h-64 rounded-full flex items-center justify-center mb-8 ring-2 ${
              running ? "ring-primary animate-pulse-gold" : "ring-border"
            }`}
            style={{
              boxShadow: running
                ? "inset 0 0 30px hsl(45 100% 50% / 0.08), 0 0 20px hsl(45 100% 50% / 0.15)"
                : "inset 0 0 20px hsl(0 0% 0% / 0.3)",
              background: "hsl(220 25% 11%)",
            }}
          >
            {/* Skull + hourglass watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
              <Clock className="w-28 h-28" />
            </div>
            <span className="font-display font-black text-4xl md:text-5xl text-foreground tabular-nums relative z-10">
              {formatTime(seconds)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!running ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground font-display font-bold px-5 py-3 rounded-lg ring-1 ring-inset ring-border hover:bg-surface-elevated transition-colors text-sm"
              >
                <Play className="w-4 h-4" />
                {seconds > 0 ? "CONTINUAR" : "INICIAR"}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground font-display font-bold px-5 py-3 rounded-lg ring-1 ring-inset ring-border hover:bg-surface-elevated transition-colors text-sm"
              >
                <Pause className="w-4 h-4" />
                PAUSAR
              </button>
            )}

            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-secondary text-secondary-foreground font-display font-bold px-5 py-3 rounded-lg ring-1 ring-inset ring-border hover:bg-surface-elevated transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              RESETAR
            </button>

            <button
              onClick={handleComplete}
              disabled={seconds === 0}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold px-5 py-3 rounded-lg hover:scale-[1.03] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:pointer-events-none text-sm shadow-gold"
            >
              <CheckCircle2 className="w-4 h-4" />
              ESTUDO REALIZADO
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Stopwatch;
