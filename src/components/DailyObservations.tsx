import { motion } from "framer-motion";
import { StickyNote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DailyObservationsProps {
  getNote: (date: string) => string;
  setNote: (date: string, text: string) => void;
}

const DailyObservations = ({ getNote, setNote }: DailyObservationsProps) => {
  const [viewDate, setViewDate] = useState(new Date());

  const dateStr = viewDate.toDateString();
  const note = getNote(dateStr);

  const WEEKDAYS = ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"];

  const formatDate = (d: Date) => {
    return `${WEEKDAYS[d.getDay()]}, ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="bg-card rounded-3xl shadow-card p-6"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", duration: 0.5, bounce: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-foreground flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-primary" />
          Observacoes do Dia
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const d = new Date(viewDate);
              d.setDate(d.getDate() - 1);
              setViewDate(d);
            }}
            className="p-1 rounded-md hover:bg-secondary text-muted-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-body text-foreground min-w-[140px] text-center">
            {formatDate(viewDate)}
          </span>
          <button
            onClick={() => {
              const d = new Date(viewDate);
              d.setDate(d.getDate() + 1);
              setViewDate(d);
            }}
            className="p-1 rounded-md hover:bg-secondary text-muted-foreground"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(dateStr, e.target.value)}
        placeholder="Escreva suas observacoes do dia aqui..."
        className="w-full h-32 bg-input border border-border rounded-xl p-4 text-foreground font-body text-sm resize-none focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground"
      />
    </motion.div>
  );
};

export default DailyObservations;
