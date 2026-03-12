import { motion } from "framer-motion";
import { RotateCw, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import type { SubjectReview } from "@/lib/store";

interface SubjectReviewSectionProps {
  reviews: SubjectReview[];
  onMarkReviewed: (name: string) => void;
  onRemoveReview: (name: string) => void;
}

const SubjectReviewSection = ({ reviews, onMarkReviewed, onRemoveReview }: SubjectReviewSectionProps) => {
  const today = new Date();

  const getStatus = (r: SubjectReview) => {
    if (!r.nextReview) return "pending";
    return new Date(r.nextReview) <= today ? "due" : "ok";
  };

  const sorted = [...reviews].sort((a, b) => {
    const order = { due: 0, pending: 1, ok: 2 };
    return order[getStatus(a)] - order[getStatus(b)];
  });

  const LEVEL_LABELS = ["Novo", "1d", "3d", "7d", "14d", "30d"];

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
            <RotateCw className="w-7 h-7 text-primary" />
            Revisao de Materias
          </h2>
          <p className="text-muted-foreground text-sm font-body mt-1">
            Sistema de repeticao espacada
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map((review, i) => {
            const status = getStatus(review);
            return (
              <motion.div
                key={review.name}
                className={`bg-card rounded-2xl shadow-card p-4 flex items-center gap-3 ${
                  status === "due" ? "ring-1 ring-primary/50" : ""
                }`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 0.4, bounce: 0, delay: i * 0.03 }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-body text-sm font-semibold truncate">
                    {review.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-body ${
                      status === "due" ? "text-primary" : status === "pending" ? "text-muted-foreground" : "text-green-400"
                    }`}>
                      {status === "due" && (
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Revisar agora
                        </span>
                      )}
                      {status === "pending" && "Nao revisada"}
                      {status === "ok" && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Em dia
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground font-body">
                      Nivel: {LEVEL_LABELS[review.level]}
                    </span>
                  </div>
                  {review.lastReview && (
                    <p className="text-xs text-muted-foreground font-body mt-0.5">
                      Ultima: {new Date(review.lastReview).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => onMarkReviewed(review.name)}
                    className={`px-3 py-2 rounded-lg font-display font-bold text-xs transition-colors ${
                      status === "due" || status === "pending"
                        ? "bg-primary text-primary-foreground hover:scale-[1.03] active:scale-[0.98]"
                        : "bg-secondary text-secondary-foreground hover:bg-surface-elevated"
                    }`}
                  >
                    Revisar
                  </button>
                  <button
                    onClick={() => onRemoveReview(review.name)}
                    className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors flex items-center gap-1 justify-center"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remover
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SubjectReviewSection;