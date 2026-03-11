import HeroSection from "@/components/HeroSection";
import Stopwatch from "@/components/Stopwatch";
import WeeklyPlanner from "@/components/WeeklyPlanner";
import ThematicImage from "@/components/ThematicImage";
import NotesSection from "@/components/NotesSection";
import DashboardSection from "@/components/DashboardSection";
import PrayerSection from "@/components/PrayerSection";
import { useWeeklyData, useStudySessions } from "@/lib/store";

import prf1 from "@/assets/prf-1.jpeg";
import prf2 from "@/assets/prf-2.jpeg";
import prf3 from "@/assets/prf-3.png";
import prf4 from "@/assets/prf-4.png";
import prf5 from "@/assets/prf-5.png";
import prf6 from "@/assets/prf-6.jpeg";

const Index = () => {
  const { days, toggleTask, updateTask, deleteTask, addTask, moveTask } =
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <Stopwatch onSessionComplete={addSession} />

      <ThematicImage src={prf3} alt="PRF Operacao" />

      <WeeklyPlanner
        days={days}
        onToggle={toggleTask}
        onUpdate={updateTask}
        onDelete={deleteTask}
        onAdd={addTask}
        onMove={moveTask}
      />

      <ThematicImage src={prf1} alt="PRF Tatico" />

      <NotesSection />

      <ThematicImage src={prf4} alt="PRF COEsp" />

      <DashboardSection
        totalToday={totalToday}
        totalWeek={totalWeek}
        totalMonth={totalMonth}
        avgDaily={avgDaily}
        sessionCount={sessionCount}
        weekSessionCount={weekSessionCount}
        sessions={sessions}
      />

      <ThematicImage src={prf5} alt="PRF Helicoptero" />

      <PrayerSection />

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-border">
        <p className="text-muted-foreground text-xs font-body">
          Painel de Controle Tatico — Missao: Aprovacao PRF
        </p>
      </footer>
    </main>
  );
};

export default Index;
