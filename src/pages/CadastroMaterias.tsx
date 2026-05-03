import { useState } from "react";
import { motion } from "framer-motion";
import { BookMarked, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Materia {
  id: string;
  nome: string;
  dataCriacao: string;
}

const CadastroMaterias = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [novaMateria, setNovaMateria] = useState("");

  const adicionarMateria = () => {
    if (novaMateria.trim()) {
      const materia: Materia = {
        id: Date.now().toString(),
        nome: novaMateria,
        dataCriacao: new Date().toLocaleDateString("pt-BR"),
      };
      setMaterias([...materias, materia]);
      setNovaMateria("");
    }
  };

  const removerMateria = (id: string) => {
    setMaterias(materias.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-3">
            <BookMarked className="w-8 h-8 text-white" />
            <h1 className="font-display font-black text-h2 text-white">
              Cadastro de Matérias
            </h1>
          </div>
          <p className="text-white/80 font-body text-sm mt-2">
            Gerencie as matérias para sua preparação para a PRF
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Add new material form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6 mb-8"
        >
          <h2 className="font-display font-bold text-lg text-foreground mb-4">
            Adicionar Nova Matéria
          </h2>
          <div className="flex gap-2">
            <Input
              placeholder="Digite o nome da matéria..."
              value={novaMateria}
              onChange={(e) => setNovaMateria(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && adicionarMateria()}
              className="flex-1"
            />
            <motion.button
              onClick={adicionarMateria}
              className="flex items-center gap-2 bg-primary text-white font-display font-bold px-6 py-2 rounded-lg hover:scale-[1.03] active:scale-[0.98] transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </motion.button>
          </div>
        </motion.div>

        {/* Materials list */}
        <div>
          <h2 className="font-display font-bold text-lg text-foreground mb-4">
            Matérias Cadastradas ({materias.length})
          </h2>

          {materias.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <BookMarked className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground font-body">
                Nenhuma matéria cadastrada ainda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materias.map((materia, idx) => (
                <motion.div
                  key={materia.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <BookMarked className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-display font-bold text-foreground">
                        {materia.nome}
                      </h3>
                      <p className="text-xs text-muted-foreground font-body">
                        Adicionado em {materia.dataCriacao}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => removerMateria(materia.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CadastroMaterias;
