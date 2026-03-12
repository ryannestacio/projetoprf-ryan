import { useState, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import Stopwatch from "@/components/Stopwatch";
import WeeklyPlanner from "@/components/WeeklyPlanner";
import ThematicImage from "@/components/ThematicImage";
import NotesSection from "@/components/NotesSection";
import DashboardSection from "@/components/DashboardSection";
import PrayerSection from "@/components/PrayerSection";
import FocusMode from "@/components/FocusMode";
import DailyObservations from "@/components/DailyObservations";
import PerformancePanel from "@/components/PerformancePanel";
import SubjectReviewSection from "@/components/SubjectReviewSection";
import {
  useWeeklyData,
  useStudySessions,
  useWeeklyGoal,
  useDailyNotes,
  useSubjectReviews,
  useStopwatch,
  useDailyPlannedOverride,
  useWeeklyPlannedOverride,
} from "@/lib/store";
import { Crosshair } from "lucide-react";

import prf1 from "@/assets/prf-1.jpeg";
import prf3 from "@/assets/prf-3.png";
import prf4 from "@/assets/prf-4.png";
import prf5 from "@/assets/prf-5.png";

const Index = () => {
  const { days, toggleTask, updateTask, deleteTask, addTask, moveTask, rescheduleTask } =
    useWeeklyData();
  const {
    sessions,
    addSession,
    totalToday,
    totalWeek,
    totalMonth,
    avgDaily,
    sessionCount,
    weekSessionCount,
  } = useStudySessions();
  const { goalHours, setGoalHours } = useWeeklyGoal();
  const { getNote, setNote } = useDailyNotes();
  const { reviews, markReviewed, removeReview } = useSubjectReviews();
  const stopwatch = useStopwatch();
  const { setOverride, getOverride } = useDailyPlannedOverride();

  const [focusMode, setFocusMode] = useState(false);

  // Get current task (first incomplete task of today)
  const todayDayIndex = [6, 0, 1, 2, 3, 4, 5][new Date().getDay()];
  const currentTask =
    days[todayDayIndex]?.tasks.find((t) => !t.completed)?.text || "";

  const handleComplete = useCallback(() => {
    if (stopwatch.displaySeconds > 0) {
      addSession(stopwatch.displaySeconds);
      stopwatch.reset();
    }
  }, [stopwatch.displaySeconds, addSession, stopwatch.reset]);

  const handleCompleteFocus = useCallback(() => {
    if (stopwatch.displaySeconds > 0) {
      addSession(stopwatch.displaySeconds);
      stopwatch.reset();
      setFocusMode(false);
    }
  }, [stopwatch.displaySeconds, addSession, stopwatch.reset]);

  return (
    <>
      <FocusMode
        open={focusMode}
        onClose={() => setFocusMode(false)}
        currentTask={currentTask}
        displaySeconds={stopwatch.displaySeconds}
        running={stopwatch.running}
        onStart={stopwatch.start}
        onPause={stopwatch.pause}
        onReset={stopwatch.reset}
        onComplete={handleCompleteFocus}
      />

      <main className="min-h-screen bg-background text-foreground">
        {/* Focus mode FAB */}
        <button
          onClick={() => setFocusMode(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold px-5 py-3 rounded-xl shadow-gold hover:scale-[1.05] active:scale-[0.97] transition-transform"
        >
          <Crosshair className="w-5 h-5" />
          FOCO
        </button>

        <HeroSection />
        <Stopwatch
          displaySeconds={stopwatch.displaySeconds}
          running={stopwatch.running}
          onStart={stopwatch.start}
          onPause={stopwatch.pause}
          onReset={stopwatch.reset}
          onComplete={handleComplete}
        />

        <ThematicImage src={prf3} alt="PRF Operacao" />

        <WeeklyPlanner
          days={days}
          onToggle={toggleTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onAdd={addTask}
          onMove={moveTask}
          onReschedule={rescheduleTask}
        />

        <ThematicImage src={prf1} alt="PRF Tatico" />

        <NotesSection />

        <ThematicImage src={prf4} alt="PRF COEsp" />

        {/* Observations + Performance */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <DailyObservations getNote={getNote} setNote={setNote} />
            <PerformancePanel
              days={days}
              sessions={sessions}
              dailyPlannedOverride={getOverride}
              onDailyPlannedChange={setOverride}
            />
          </div>
        </section>

        <DashboardSection
          totalToday={totalToday}
          totalWeek={totalWeek}
          totalMonth={totalMonth}
          avgDaily={avgDaily}
          sessionCount={sessionCount}
          weekSessionCount={weekSessionCount}
          sessions={sessions}
          weeklyGoalHours={goalHours}
          onGoalChange={setGoalHours}
        />

        <ThematicImage src={prf5} alt="PRF Helicoptero" />

        <SubjectReviewSection reviews={reviews} onMarkReviewed={markReviewed} onRemoveReview={removeReview} />

        <PrayerSection />

        {/* Footer */}
        <footer className="py-8 px-4 text-center border-t border-border">
          <p className="text-muted-foreground text-xs font-body">
            Painel de Controle Tatico — Missao: Aprovacao PRF
          </p>
        </footer>
      </main>
    </>
  );
};

export default Index;