import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, FileText } from "lucide-react";

const SUBJECTS = [
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

const NotesSection = () => {
  const [selected, setSelected] = useState<(typeof SUBJECTS)[0] | null>(null);

  const totalQuestions = SUBJECTS.reduce((a, s) => a + s.questions, 0);

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
        >
          <h2 className="font-display font-bold text-h2 text-foreground flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-primary" />
            Anotacoes: Materias
          </h2>
          <p className="text-muted-foreground text-sm font-body mt-1">
            {SUBJECTS.length} disciplinas | {totalQuestions} questoes totais
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {SUBJECTS.map((subject, i) => (
            <motion.button
              key={subject.name}
              onClick={() => setSelected(subject)}
              className="bg-card rounded-2xl shadow-card p-4 text-left hover:bg-surface-elevated transition-colors group"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.4, bounce: 0, delay: i * 0.03 }}
            >
              <FileText className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-foreground font-body text-xs font-semibold leading-tight">
                {subject.name}
              </p>
              {subject.questions > 0 && (
                <p className="text-muted-foreground font-body text-xs mt-1">
                  {subject.questions} questoes
                </p>
              )}
            </motion.button>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                className="bg-card rounded-3xl shadow-elevated p-8 max-w-md w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-display font-bold text-xl text-foreground">
                      {selected.name}
                    </h3>
                    {selected.questions > 0 && (
                      <p className="text-muted-foreground text-sm font-body mt-1">
                        {selected.questions} questoes na prova
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-secondary rounded-xl p-4">
                  <p className="text-muted-foreground text-sm font-body">
                    Area reservada para anotacoes sobre {selected.name}.
                    Adicione links, resumos e materiais de estudo aqui.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default NotesSection;
