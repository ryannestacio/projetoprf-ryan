import { useState, useEffect, useCallback, useRef } from "react";

import { loadCloudValue, saveCloudValue } from "@/lib/cloudSync";

export interface Task {
  id: string;
  text: string;
  time: string;
  completed: boolean;
}

export interface DayData {
  name: string;
  tasks: Task[];
}

export interface StudySession {
  id: string;
  durationSeconds: number;
  createdAt: string;
}

export interface SubjectReview {
  name: string;
  lastReview: string | null;
  nextReview: string | null;
  level: number; // 0-5
}

export interface SubjectNoteMeta {
  name: string;
  questions: number;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const INITIAL_DAYS: DayData[] = [
  {
    name: "Segunda-feira",
    tasks: [
      { id: generateId(), text: "Creatina?", time: "", completed: false },
      { id: generateId(), text: "+2L de agua tomados?", time: "", completed: false },
      { id: generateId(), text: "Oracao de Sao Tomas de Aquino.", time: "", completed: false },
      { id: generateId(), text: "Questoes", time: "12h10 - 12h45", completed: false },
      { id: generateId(), text: "Faculdade", time: "19h00 - 20h40", completed: false },
      { id: generateId(), text: "Lingua Portuguesa (PRF - PMAL)", time: "21h00 - 23h00", completed: false },
      { id: generateId(), text: "Geopolitica (PRF)", time: "23h00 - 00h00", completed: false },
    ],
  },
  {
    name: "Terca-feira",
    tasks: [
      { id: generateId(), text: "Creatina?", time: "", completed: false },
      { id: generateId(), text: "+2L de agua tomados?", time: "", completed: false },
      { id: generateId(), text: "Oracao de Sao Tomas de Aquino.", time: "", completed: false },
      { id: generateId(), text: "Questoes", time: "12h10 - 12h45", completed: false },
      { id: generateId(), text: "Transito (CTB + CONTRAN) (PRF)", time: "19h40 - 21h40", completed: false },
      { id: generateId(), text: "Geografia (PMAL) REPOR", time: "22h00 - 23h20", completed: false },
      { id: generateId(), text: "Informatica (PRF) REPOR", time: "23h20 - 00h00", completed: false },
    ],
  },
  {
    name: "Quarta-feira",
    tasks: [
      { id: generateId(), text: "Creatina?", time: "", completed: false },
      { id: generateId(), text: "+2L de agua tomados?", time: "", completed: false },
      { id: generateId(), text: "Oracao de Sao Tomas de Aquino.", time: "", completed: false },
      { id: generateId(), text: "Questoes", time: "12h00 - 13h00", completed: false },
      { id: generateId(), text: "Faculdade - Organizacao", time: "19h00 - 20h40", completed: false },
      { id: generateId(), text: "Direito Constitucional (PRF - PMAL)", time: "21h00 - 22h40", completed: false },
      { id: generateId(), text: "Raciocinio Logico Matematico (PRF - PMAL)", time: "22h50 - 00h00", completed: false },
    ],
  },
  {
    name: "Quinta-feira",
    tasks: [
      { id: generateId(), text: "Creatina?", time: "", completed: false },
      { id: generateId(), text: "+2L de agua tomados?", time: "", completed: false },
      { id: generateId(), text: "Oracao de Sao Tomas de Aquino.", time: "", completed: false },
      { id: generateId(), text: "Questoes", time: "12h10 - 12h45", completed: false },
      { id: generateId(), text: "Jiu-jitsu", time: "20h00 - 21h00", completed: false },
      { id: generateId(), text: "Ingles", time: "22h00 - 00h00", completed: false },
    ],
  },
  {
    name: "Sexta-feira",
    tasks: [
      { id: generateId(), text: "Creatina?", time: "", completed: false },
      { id: generateId(), text: "+2L de agua tomados?", time: "", completed: false },
      { id: generateId(), text: "Oracao de Sao Tomas de Aquino.", time: "", completed: false },
      { id: generateId(), text: "Questoes", time: "12h10 - 12h45", completed: false },
      { id: generateId(), text: "Faculdade", time: "19h00 - 20h40", completed: false },
      { id: generateId(), text: "Direitos Humanos (PRF - PMAL)", time: "21h00 - 22h10", completed: false },
      { id: generateId(), text: "Legislacao Extravagante e Especifica + Etica (PRF - PMAL)", time: "22h20 - 00h00", completed: false },
    ],
  },
  {
    name: "Sabado",
    tasks: [
      { id: generateId(), text: "Creatina?", time: "", completed: false },
      { id: generateId(), text: "+2L de agua tomados?", time: "", completed: false },
      { id: generateId(), text: "Oracao de Sao Tomas de Aquino.", time: "", completed: false },
      { id: generateId(), text: "Historia de Alagoas (PMAL)", time: "14h00 - 16h00", completed: false },
      { id: generateId(), text: "Atualidades (PMAL)", time: "16h30 - 18h00", completed: false },
      { id: generateId(), text: "Direito Administrativo (PRF - PMAL)", time: "18h30 - 20h00", completed: false },
    ],
  },
  {
    name: "Domingo",
    tasks: [
      { id: generateId(), text: "Creatina?", time: "", completed: false },
      { id: generateId(), text: "+2L de agua tomados?", time: "", completed: false },
      { id: generateId(), text: "Oracao de Sao Tomas de Aquino.", time: "", completed: false },
      { id: generateId(), text: "Direito Penal + Crimes de transito (PRF - PMAL)", time: "09h30 - 12h00", completed: false },
      { id: generateId(), text: "Direito Processual Penal (PRF - PMAL)", time: "14h00 - 16h00", completed: false },
      { id: generateId(), text: "Fisica", time: "19h00 - ...", completed: false },
    ],
  },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {}
  return fallback;
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

function useCloudHydration<T>(key: string, setState: (value: T) => void) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      const cloudValue = await loadCloudValue<T>(key);
      if (mounted && cloudValue !== null) {
        setState(cloudValue);
      }
      if (mounted) {
        setHydrated(true);
      }
    };

    void hydrate();

    return () => {
      mounted = false;
    };
  }, [key, setState]);

  return hydrated;
}

export function useWeeklyData() {
  const [days, setDays] = useState<DayData[]>(() =>
    loadFromStorage("prf-weekly-data", INITIAL_DAYS)
  );

  const cloudHydrated = useCloudHydration<DayData[]>("prf-weekly-data", setDays);

  useEffect(() => {
    saveToStorage("prf-weekly-data", days);
    if (cloudHydrated) {
      void saveCloudValue("prf-weekly-data", days);
    }
  }, [cloudHydrated, days]);

  const toggleTask = useCallback((dayIndex: number, taskId: string) => {
    setDays((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              tasks: day.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
          : day
      )
    );
  }, []);

  const updateTask = useCallback(
    (dayIndex: number, taskId: string, text: string, time: string) => {
      setDays((prev) =>
        prev.map((day, i) =>
          i === dayIndex
            ? {
                ...day,
                tasks: day.tasks.map((t) =>
                  t.id === taskId ? { ...t, text, time } : t
                ),
              }
            : day
        )
      );
    },
    []
  );

  const deleteTask = useCallback((dayIndex: number, taskId: string) => {
    setDays((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, tasks: day.tasks.filter((t) => t.id !== taskId) }
          : day
      )
    );
  }, []);

  const addTask = useCallback((dayIndex: number) => {
    setDays((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              tasks: [
                ...day.tasks,
                { id: generateId(), text: "Nova tarefa", time: "", completed: false },
              ],
            }
          : day
      )
    );
  }, []);

  const moveTask = useCallback(
    (dayIndex: number, fromIndex: number, toIndex: number) => {
      setDays((prev) =>
        prev.map((day, i) => {
          if (i !== dayIndex) return day;
          const tasks = [...day.tasks];
          const [moved] = tasks.splice(fromIndex, 1);
          tasks.splice(toIndex, 0, moved);
          return { ...day, tasks };
        })
      );
    },
    []
  );

  const rescheduleTask = useCallback(
    (fromDayIndex: number, taskId: string, toDayIndex: number) => {
      setDays((prev) => {
        const task = prev[fromDayIndex]?.tasks.find((t) => t.id === taskId);
        if (!task) return prev;
        return prev.map((day, i) => {
          if (i === fromDayIndex) {
            return { ...day, tasks: day.tasks.filter((t) => t.id !== taskId) };
          }
          if (i === toDayIndex) {
            return {
              ...day,
              tasks: [...day.tasks, { ...task, completed: false, id: generateId() }],
            };
          }
          return day;
        });
      });
    },
    []
  );

  return { days, toggleTask, updateTask, deleteTask, addTask, moveTask, rescheduleTask };
}

export function useStudySessions() {
  const [sessions, setSessions] = useState<StudySession[]>(() =>
    loadFromStorage("prf-study-sessions", [])
  );

  const cloudHydrated = useCloudHydration<StudySession[]>("prf-study-sessions", setSessions);

  useEffect(() => {
    saveToStorage("prf-study-sessions", sessions);
    if (cloudHydrated) {
      void saveCloudValue("prf-study-sessions", sessions);
    }
  }, [cloudHydrated, sessions]);

  const addSession = useCallback((durationSeconds: number) => {
    setSessions((prev) => [
      ...prev,
      {
        id: generateId(),
        durationSeconds,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const todaySessions = sessions.filter(
    (s) => new Date(s.createdAt).toDateString() === new Date().toDateString()
  );
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekSessions = sessions.filter(
    (s) => new Date(s.createdAt) >= weekStart
  );
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthSessions = sessions.filter(
    (s) => new Date(s.createdAt) >= monthStart
  );

  const totalToday = todaySessions.reduce((a, s) => a + s.durationSeconds, 0);
  const totalWeek = weekSessions.reduce((a, s) => a + s.durationSeconds, 0);
  const totalMonth = monthSessions.reduce((a, s) => a + s.durationSeconds, 0);

  const daysInWeek = Math.max(1, new Date().getDay() || 7);
  const avgDaily = totalWeek / daysInWeek;

  return {
    sessions,
    addSession,
    totalToday,
    totalWeek,
    totalMonth,
    avgDaily,
    sessionCount: sessions.length,
    weekSessionCount: weekSessions.length,
  };
}

export function useWeeklyGoal() {
  const [goalHours, setGoalHours] = useState<number>(() =>
    loadFromStorage("prf-weekly-goal", 40)
  );

  const cloudHydrated = useCloudHydration<number>("prf-weekly-goal", setGoalHours);

  useEffect(() => {
    saveToStorage("prf-weekly-goal", goalHours);
    if (cloudHydrated) {
      void saveCloudValue("prf-weekly-goal", goalHours);
    }
  }, [cloudHydrated, goalHours]);

  return { goalHours, setGoalHours };
}

export function useDailyNotes() {
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    loadFromStorage("prf-daily-notes", {})
  );

  const cloudHydrated = useCloudHydration<Record<string, string>>("prf-daily-notes", setNotes);

  useEffect(() => {
    saveToStorage("prf-daily-notes", notes);
    if (cloudHydrated) {
      void saveCloudValue("prf-daily-notes", notes);
    }
  }, [cloudHydrated, notes]);

  const setNote = useCallback((date: string, text: string) => {
    setNotes((prev) => ({ ...prev, [date]: text }));
  }, []);

  const getNote = useCallback(
    (date: string) => notes[date] || "",
    [notes]
  );

  return { notes, setNote, getNote };
}

export function useStopwatch() {
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

  const accumulatedHydrated = useCloudHydration<number>("prf-sw-accumulated", setAccumulated);
  const startedAtHydrated = useCloudHydration<number | null>("prf-sw-startedAt", setStartedAt);

  useEffect(() => {
    localStorage.setItem("prf-sw-accumulated", JSON.stringify(accumulated));
    if (accumulatedHydrated) {
      void saveCloudValue("prf-sw-accumulated", accumulated);
    }
  }, [accumulated, accumulatedHydrated]);
  useEffect(() => {
    localStorage.setItem("prf-sw-startedAt", JSON.stringify(startedAt));
    if (startedAtHydrated) {
      void saveCloudValue("prf-sw-startedAt", startedAt);
    }
  }, [startedAt, startedAtHydrated]);

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

  const start = useCallback(() => setStartedAt(Date.now()), []);
  const pause = useCallback(() => {
    if (startedAt) setAccumulated((a) => a + Math.floor((Date.now() - startedAt) / 1000));
    setStartedAt(null);
  }, [startedAt]);
  const reset = useCallback(() => {
    setStartedAt(null);
    setAccumulated(0);
  }, []);

  return { displaySeconds, running, start, pause, reset };
}

export function useDailyPlannedOverride() {
  const [overrides, setOverrides] = useState<Record<string, number>>(() =>
    loadFromStorage("prf-daily-planned-override", {})
  );

  const cloudHydrated = useCloudHydration<Record<string, number>>("prf-daily-planned-override", setOverrides);

  useEffect(() => {
    saveToStorage("prf-daily-planned-override", overrides);
    if (cloudHydrated) {
      void saveCloudValue("prf-daily-planned-override", overrides);
    }
  }, [cloudHydrated, overrides]);

  const setOverride = useCallback((dayIndex: number, seconds: number) => {
    setOverrides((prev) => ({ ...prev, [dayIndex.toString()]: seconds }));
  }, []);

  const getOverride = useCallback(
    (dayIndex: number) => overrides[dayIndex.toString()] ?? null,
    [overrides]
  );

  return { setOverride, getOverride };
}

export function useWeeklyPlannedOverride() {
  const [override, setOverrideRaw] = useState<number | null>(() =>
    loadFromStorage("prf-weekly-planned-override", null)
  );

  const cloudHydrated = useCloudHydration<number | null>("prf-weekly-planned-override", setOverrideRaw);

  useEffect(() => {
    saveToStorage("prf-weekly-planned-override", override);
    if (cloudHydrated) {
      void saveCloudValue("prf-weekly-planned-override", override);
    }
  }, [cloudHydrated, override]);

  const setOverride = useCallback((seconds: number) => {
    setOverrideRaw(seconds);
  }, []);

  return { weeklyPlannedOverride: override, setWeeklyPlannedOverride: setOverride };
}

export function useSubjectReviews() {
  const INITIAL_REVIEWS: SubjectReview[] = [
    { name: "Legislacao de Transito", lastReview: null, nextReview: null, level: 0 },
    { name: "Lingua Portuguesa", lastReview: null, nextReview: null, level: 0 },
    { name: "Raciocinio Logico-Matematico", lastReview: null, nextReview: null, level: 0 },
    { name: "Informatica", lastReview: null, nextReview: null, level: 0 },
    { name: "Fisica", lastReview: null, nextReview: null, level: 0 },
    { name: "Direito Administrativo", lastReview: null, nextReview: null, level: 0 },
    { name: "Direito Constitucional", lastReview: null, nextReview: null, level: 0 },
    { name: "Direito Penal", lastReview: null, nextReview: null, level: 0 },
    { name: "Direito Processual Penal", lastReview: null, nextReview: null, level: 0 },
    { name: "Direitos Humanos", lastReview: null, nextReview: null, level: 0 },
    { name: "Legislacao Especial", lastReview: null, nextReview: null, level: 0 },
    { name: "Etica", lastReview: null, nextReview: null, level: 0 },
    { name: "Geopolitica", lastReview: null, nextReview: null, level: 0 },
    { name: "Ingles", lastReview: null, nextReview: null, level: 0 },
  ];

  const [reviews, setReviews] = useState<SubjectReview[]>(() =>
    loadFromStorage("prf-subject-reviews", INITIAL_REVIEWS)
  );

  const cloudHydrated = useCloudHydration<SubjectReview[]>("prf-subject-reviews", setReviews);

  useEffect(() => {
    saveToStorage("prf-subject-reviews", reviews);
    if (cloudHydrated) {
      void saveCloudValue("prf-subject-reviews", reviews);
    }
  }, [cloudHydrated, reviews]);

  const INTERVALS = [1, 3, 7, 14, 30, 60];

  const markReviewed = useCallback((name: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.name !== name) return r;
        const newLevel = Math.min(r.level + 1, INTERVALS.length - 1);
        const next = new Date();
        next.setDate(next.getDate() + INTERVALS[newLevel]);
        return {
          ...r,
          lastReview: new Date().toISOString(),
          nextReview: next.toISOString(),
          level: newLevel,
        };
      })
    );
  }, []);

  const removeReview = useCallback((name: string) => {
    setReviews((prev) => prev.filter((r) => r.name !== name));
  }, []);

  return { reviews, markReviewed, removeReview };
}

const INITIAL_SUBJECT_NOTES: SubjectNoteMeta[] = [
  { name: "Legislacao de Transito", questions: 30 },
  { name: "Lingua Portuguesa", questions: 20 },
  { name: "Raciocinio Logico-Matematico", questions: 8 },
  { name: "Informatica", questions: 7 },
  { name: "Fisica", questions: 6 },
  { name: "Direito Administrativo", questions: 5 },
  { name: "Direito Constitucional", questions: 5 },
  { name: "Direito Penal", questions: 6 },
  { name: "Direito Processual Penal", questions: 4 },
  { name: "Direitos Humanos", questions: 5 },
  { name: "Legislacao Especial", questions: 2 },
  { name: "Etica", questions: 4 },
  { name: "Geopolitica", questions: 5 },
  { name: "Ingles", questions: 8 },
  { name: "Redacao", questions: 0 },
];

const INITIAL_SUBJECT_NOTES_STATE = INITIAL_SUBJECT_NOTES.reduce<Record<string, string>>(
  (acc, subject) => {
    acc[subject.name] = "";
    return acc;
  },
  {}
);

export function useSubjectNotes() {
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    loadFromStorage("prf-subject-notes", INITIAL_SUBJECT_NOTES_STATE)
  );

  const cloudHydrated = useCloudHydration<Record<string, string>>("prf-subject-notes", setNotes);

  useEffect(() => {
    saveToStorage("prf-subject-notes", notes);
    if (cloudHydrated) {
      void saveCloudValue("prf-subject-notes", notes);
    }
  }, [cloudHydrated, notes]);

  const setSubjectNote = useCallback((subject: string, text: string) => {
    setNotes((prev) => ({ ...prev, [subject]: text }));
  }, []);

  const getSubjectNote = useCallback(
    (subject: string) => notes[subject] || "",
    [notes]
  );

  return { subjects: INITIAL_SUBJECT_NOTES, getSubjectNote, setSubjectNote };
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function formatHoursMinutes(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
}

/** Parse time range like "19h00 - 21h00" to duration in seconds */
export function parseTimeDuration(timeStr: string): number {
  if (!timeStr) return 0;

  const match = timeStr.match(/(\d{1,2})h(\d{2})\s*-\s*(\d{1,2})h(\d{2})/);
  if (!match) return 0;

  const startHour = Number.parseInt(match[1], 10);
  const startMinute = Number.parseInt(match[2], 10);
  const endHour = Number.parseInt(match[3], 10);
  const endMinute = Number.parseInt(match[4], 10);

  const isValidTime =
    startHour >= 0 &&
    startHour <= 23 &&
    endHour >= 0 &&
    endHour <= 23 &&
    startMinute >= 0 &&
    startMinute <= 59 &&
    endMinute >= 0 &&
    endMinute <= 59;

  if (!isValidTime) return 0;

  const startMin = startHour * 60 + startMinute;
  let endMin = endHour * 60 + endMinute;
  if (endMin <= startMin) endMin += 24 * 60; // crosses midnight

  return (endMin - startMin) * 60;
}
