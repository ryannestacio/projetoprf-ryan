import { useState, useEffect, useCallback } from "react";

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

export function useWeeklyData() {
  const [days, setDays] = useState<DayData[]>(() =>
    loadFromStorage("prf-weekly-data", INITIAL_DAYS)
  );

  useEffect(() => {
    saveToStorage("prf-weekly-data", days);
  }, [days]);

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

  return { days, toggleTask, updateTask, deleteTask, addTask, moveTask };
}

export function useStudySessions() {
  const [sessions, setSessions] = useState<StudySession[]>(() =>
    loadFromStorage("prf-study-sessions", [])
  );

  useEffect(() => {
    saveToStorage("prf-study-sessions", sessions);
  }, [sessions]);

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
