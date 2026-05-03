import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  BookMarked,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Clock3,
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type StatusRevisao = "Pendente" | "Revisada" | "Com dúvida";

interface Erro {
  id: string;
  link: string;
  materia: string;
  banca: string;
  assunto: string;
  enunciado: string;
  gabarito: string;
  tipoErro: string;
  porQueErrei: string;
  statusRevisao: StatusRevisao;
  date: string;
}

interface Materia {
  id: string;
  nome: string;
  dataCriacao: string;
}

interface ErrorFormState {
  link: string;
  materia: string;
  banca: string;
  assunto: string;
  enunciado: string;
  gabarito: string;
  tipoErro: string;
  porQueErrei: string;
  statusRevisao: StatusRevisao;
}

const MATERIAS_STORAGE_KEY = "caderno-erros-materias";
const ERROS_STORAGE_KEY = "caderno-erros-itens";
const REVIEW_STATUSES: StatusRevisao[] = ["Pendente", "Revisada", "Com dúvida"];
const PIE_COLORS = ["#f97316", "#06b6d4", "#22c55e", "#f43f5e", "#a855f7"];
const ENUNCIADO_PREVIEW_LIMIT = 230;
const STATUS_BADGE_STYLES: Record<StatusRevisao, string> = {
  Pendente: "bg-[#fcefd8] text-[#f09016] border-[#fcefd8]",
  Revisada: "bg-[#e8f7ef] text-[#1f9d60] border-[#e8f7ef]",
  "Com dúvida": "bg-[#fdecef] text-[#d74a61] border-[#fdecef]",
};

const getEmptyFormData = (): ErrorFormState => ({
  link: "",
  materia: "",
  banca: "",
  assunto: "",
  enunciado: "",
  gabarito: "",
  tipoErro: "",
  porQueErrei: "",
  statusRevisao: "Pendente",
});

const isStatusRevisao = (value: string): value is StatusRevisao => {
  return REVIEW_STATUSES.includes(value as StatusRevisao);
};

const getStatusIcon = (status: StatusRevisao) => {
  if (status === "Revisada") {
    return CheckCircle2;
  }

  if (status === "Com dúvida") {
    return CircleHelp;
  }

  return Clock3;
};

const CadernoDeErros = () => {
  const [erros, setErros] = useState<Erro[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [tab, setTab] = useState<"questoes" | "dashboard">("questoes");
  const [selectedSubject, setSelectedSubject] = useState("todos");
  const [selectedErrorType, setSelectedErrorType] = useState("todos");
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [openMateriasModal, setOpenMateriasModal] = useState(false);
  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [selectedErro, setSelectedErro] = useState<Erro | null>(null);
  const [novaMateria, setNovaMateria] = useState("");
  const [expandedEnunciados, setExpandedEnunciados] = useState<Record<string, boolean>>({});
  const [editReasonDraft, setEditReasonDraft] = useState("");
  const [reasonEditable, setReasonEditable] = useState(false);
  const [formData, setFormData] = useState<ErrorFormState>(getEmptyFormData());

  const errorTypes = [
    "Falta de atenção",
    "Conteúdo não visto",
    "Pegadinha da banca",
    "Interpretação",
  ];

  const bancas = ["CEBRASPE", "FGV", "VUNESP", "CONSULPLAN", "CESPE", "Outras"];

  useEffect(() => {
    const savedMaterias = localStorage.getItem(MATERIAS_STORAGE_KEY);
    if (savedMaterias) {
      try {
        const parsed = JSON.parse(savedMaterias) as Materia[];
        if (Array.isArray(parsed)) {
          setMaterias(parsed);
        }
      } catch {
        localStorage.removeItem(MATERIAS_STORAGE_KEY);
      }
    }

    const savedErros = localStorage.getItem(ERROS_STORAGE_KEY);
    if (!savedErros) {
      return;
    }

    try {
      const parsed = JSON.parse(savedErros) as Array<Partial<Erro>>;
      if (!Array.isArray(parsed)) {
        return;
      }

      const normalizedErros = parsed.map((item, index) => {
        const statusRaw = typeof item.statusRevisao === "string" ? item.statusRevisao : "Pendente";
        const status = isStatusRevisao(statusRaw) ? statusRaw : "Pendente";

        return {
          id: typeof item.id === "string" ? item.id : `legacy-${Date.now()}-${index}`,
          link: typeof item.link === "string" ? item.link : "",
          materia: typeof item.materia === "string" ? item.materia : "",
          banca: typeof item.banca === "string" ? item.banca : "",
          assunto: typeof item.assunto === "string" ? item.assunto : "",
          enunciado: typeof item.enunciado === "string" ? item.enunciado : "",
          gabarito: typeof item.gabarito === "string" ? item.gabarito : "",
          tipoErro: typeof item.tipoErro === "string" ? item.tipoErro : "",
          porQueErrei: typeof item.porQueErrei === "string" ? item.porQueErrei : "",
          statusRevisao: status,
          date: typeof item.date === "string" ? item.date : new Date().toLocaleDateString("pt-BR"),
        } satisfies Erro;
      });

      setErros(normalizedErros);
    } catch {
      localStorage.removeItem(ERROS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(MATERIAS_STORAGE_KEY, JSON.stringify(materias));
  }, [materias]);

  useEffect(() => {
    localStorage.setItem(ERROS_STORAGE_KEY, JSON.stringify(erros));
  }, [erros]);

  const subjects = useMemo(() => materias.map((materia) => materia.nome), [materias]);

  const filteredErros = useMemo(() => {
    return erros.filter((erro) => {
      const subjectMatch = selectedSubject === "todos" || erro.materia === selectedSubject;
      const errorTypeMatch = selectedErrorType === "todos" || erro.tipoErro === selectedErrorType;
      return subjectMatch && errorTypeMatch;
    });
  }, [erros, selectedSubject, selectedErrorType]);

  const dashboardStats = useMemo(() => {
    const total = erros.length;
    const revisadas = erros.filter((erro) => erro.statusRevisao === "Revisada").length;
    const comDuvida = erros.filter((erro) => erro.statusRevisao === "Com dúvida").length;
    const pendentes = erros.filter((erro) => erro.statusRevisao === "Pendente").length;

    return { total, revisadas, comDuvida, pendentes };
  }, [erros]);

  const subjectChartData = useMemo(() => {
    const map = erros.reduce<Record<string, number>>((acc, erro) => {
      if (!erro.materia) {
        return acc;
      }

      acc[erro.materia] = (acc[erro.materia] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(map)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }, [erros]);

  const errorTypeChartData = useMemo(() => {
    return errorTypes
      .map((type) => ({ name: type, total: erros.filter((erro) => erro.tipoErro === type).length }))
      .filter((item) => item.total > 0);
  }, [erros]);

  const addMateria = () => {
    const nomeLimpo = novaMateria.trim();

    if (!nomeLimpo) {
      alert("Digite o nome da matéria.");
      return;
    }

    const jaExiste = materias.some(
      (materia) => materia.nome.toLocaleLowerCase("pt-BR") === nomeLimpo.toLocaleLowerCase("pt-BR"),
    );

    if (jaExiste) {
      alert("Essa matéria já foi cadastrada.");
      return;
    }

    const materia: Materia = {
      id: Date.now().toString(),
      nome: nomeLimpo,
      dataCriacao: new Date().toLocaleDateString("pt-BR"),
    };

    setMaterias((prev) => [...prev, materia]);
    setNovaMateria("");
  };

  const removeMateria = (id: string, askBeforeDelete = true) => {
    if (askBeforeDelete && !window.confirm("Quer mesmo apagar esta matéria?")) {
      return false;
    }

    setMaterias((prev) => {
      const materiaRemovida = prev.find((materia) => materia.id === id);
      const next = prev.filter((materia) => materia.id !== id);

      if (materiaRemovida && selectedSubject === materiaRemovida.nome) {
        setSelectedSubject("todos");
      }

      if (materiaRemovida && formData.materia === materiaRemovida.nome) {
        setFormData((current) => ({ ...current, materia: "" }));
      }

      return next;
    });

    return true;
  };

  const addError = () => {
    if (!formData.materia || !formData.tipoErro) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    const novoErro: Erro = {
      id: Date.now().toString(),
      ...formData,
      date: new Date().toLocaleDateString("pt-BR"),
    };

    setErros((prev) => [...prev, novoErro]);
    setFormData(getEmptyFormData());
    setOpenErrorModal(false);
  };

  const removeError = (id: string, askBeforeDelete = true) => {
    if (askBeforeDelete && !window.confirm("Quer mesmo apagar esta questão?")) {
      return false;
    }

    setErros((prev) => prev.filter((erro) => erro.id !== id));

    return true;
  };

  const openQuestionDetails = (erro: Erro) => {
    setSelectedErro(erro);
    setEditReasonDraft(erro.porQueErrei || "");
    setReasonEditable(false);
    setOpenQuestionModal(true);
  };

  const closeQuestionDetails = () => {
    setOpenQuestionModal(false);
    setSelectedErro(null);
    setEditReasonDraft("");
    setReasonEditable(false);
  };

  const saveReasonOnly = () => {
    if (!selectedErro) {
      return;
    }

    const nextReason = editReasonDraft.trim();
    setErros((prev) =>
      prev.map((erro) =>
        erro.id === selectedErro.id
          ? {
              ...erro,
              porQueErrei: nextReason,
            }
          : erro,
      ),
    );
    setSelectedErro((prev) => (prev ? { ...prev, porQueErrei: nextReason } : prev));
  };

  const handleCloseQuestionDetails = () => {
    saveReasonOnly();
    closeQuestionDetails();
  };

  const handleDeleteFromDetails = () => {
    if (!selectedErro) {
      return;
    }

    const wasRemoved = removeError(selectedErro.id);
    if (wasRemoved) {
      closeQuestionDetails();
    }
  };

  const updateErrorStatus = (id: string, status: string) => {
    if (!isStatusRevisao(status)) {
      return;
    }

    setErros((prev) =>
      prev.map((erro) =>
        erro.id === id
          ? {
              ...erro,
              statusRevisao: status,
            }
          : erro,
      ),
    );
  };

  const errorTypeCount = (type: string) => erros.filter((erro) => erro.tipoErro === type).length;
  const subjectCount = (subject: string) => erros.filter((erro) => erro.materia === subject).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-white" />
            <h1 className="font-display font-black text-h2 text-white">Caderno de Erros</h1>
          </div>
          <p className="text-white/80 font-body text-sm">Estudo inteligente para concursos</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 flex-wrap">
          <motion.button
            onClick={() => setOpenErrorModal(true)}
            className="flex items-center gap-2 bg-primary text-white font-display font-bold px-4 py-2 rounded-lg hover:scale-[1.03] active:scale-[0.98] transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            Nova Questão
          </motion.button>
          <motion.button
            onClick={() => setOpenMateriasModal(true)}
            className="flex items-center gap-2 bg-secondary text-foreground font-display font-bold px-4 py-2 rounded-lg hover:scale-[1.03] active:scale-[0.98] transition-transform hover:bg-secondary/80"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookMarked className="w-4 h-4" />
            Cadastrar Matérias
          </motion.button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("questoes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-display font-bold transition-all ${
              tab === "questoes"
                ? "bg-primary text-white"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            Questões
          </button>
          <button
            onClick={() => setTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-display font-bold transition-all ${
              tab === "dashboard"
                ? "bg-primary text-white"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </button>
        </div>

        {tab === "questoes" ? (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas as matérias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as matérias</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={selectedErrorType} onValueChange={setSelectedErrorType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos os erros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os erros</SelectItem>
                    {errorTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-right py-2">
                <p className="text-muted-foreground text-sm font-body">
                  {filteredErros.length} {filteredErros.length === 1 ? "questão" : "questões"}
                </p>
              </div>
            </div>

            {filteredErros.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground font-body">Nenhuma questão encontrada.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-7">
                {filteredErros.map((erro, idx) => {
                  const StatusIcon = getStatusIcon(erro.statusRevisao);
                  const learningLines = erro.porQueErrei
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line) =>
                      line
                        .replace(/^(por\s*que\s*errei)\s*[:\-]?\s*/iu, "")
                        .replace(/^(explica(?:c|ç)(?:a|ã)o)\s*[:\-]?\s*/iu, "")
                        .trim(),
                    )
                    .filter(Boolean);
                  const reasonSummary = learningLines[0] || "Sem observações.";
                  const detailedExplanation = learningLines.slice(1).join("\n\n");
                  const enunciadoOriginal = (erro.enunciado || "").trim();
                  const enunciadoFallback = "Adicione o enunciado da questão para visualizar aqui.";
                  const hasEnunciado = enunciadoOriginal.length > 0;
                  const enunciadoLongo = hasEnunciado && enunciadoOriginal.length > ENUNCIADO_PREVIEW_LIMIT;
                  const enunciadoExpandido = !!expandedEnunciados[erro.id];
                  const enunciadoExibido =
                    hasEnunciado && enunciadoLongo && !enunciadoExpandido
                      ? `${enunciadoOriginal.slice(0, ENUNCIADO_PREVIEW_LIMIT).trimEnd()}...`
                      : hasEnunciado
                        ? enunciadoOriginal
                        : enunciadoFallback;

                  return (
                    <motion.div
                      key={erro.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="font-display rounded-2xl border border-[#cfcac0] bg-[#f4f4f4] p-5 text-[#1f2b44] shadow-[0_8px_22px_rgba(15,23,42,0.09)] md:p-7"
                    >
                      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-[#c7cfdd] bg-[#f8f8f8] px-3 py-1 text-sm font-medium text-[#1f2b44]">
                            {erro.materia || "Sem matéria"}
                          </span>
                          {erro.assunto && (
                            <span className="rounded-full bg-[#1f2b44] px-3 py-1 text-sm font-semibold text-[#ffc400]">
                              {erro.assunto}
                            </span>
                          )}
                          <span className="rounded-full border border-[#d7b86a] bg-[#efe6cf] px-3 py-1 text-sm font-medium text-[#2f3f5e]">
                            {erro.tipoErro}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-start">
                          <button
                            onClick={() => openQuestionDetails(erro)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#cad0db] bg-[#f8f8f8] text-[#25324a] transition-colors hover:bg-[#e9edf4]"
                            title="Editar questão"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>

                          <Select
                            value={erro.statusRevisao}
                            onValueChange={(status) => updateErrorStatus(erro.id, status)}
                          >
                            <SelectTrigger
                              className={`h-10 w-auto min-w-[146px] rounded-xl border px-3 text-sm font-semibold [&>svg]:hidden ${STATUS_BADGE_STYLES[erro.statusRevisao]}`}
                            >
                              <span className="flex items-center gap-2">
                                <StatusIcon className="h-4 w-4" />
                                <SelectValue placeholder="Status" />
                              </span>
                            </SelectTrigger>
                            <SelectContent>
                              {REVIEW_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {erro.link && (
                            <a
                              href={erro.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#cad0db] bg-[#f8f8f8] text-[#25324a] transition-colors hover:bg-[#e9edf4]"
                              title="Abrir questão em nova aba"
                            >
                              <ExternalLink className="h-5 w-5" />
                            </a>
                          )}

                          <button
                            onClick={() => removeError(erro.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#f2c7cb] bg-[#f8f8f8] text-[#e24b52] transition-colors hover:bg-[#ffeef0]"
                            title="Remover questão"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <p className="mb-2 text-[1.1rem] leading-relaxed text-[#1f2b44]">
                        {enunciadoExibido}
                      </p>
                      {enunciadoLongo && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedEnunciados((prev) => ({
                              ...prev,
                              [erro.id]: !prev[erro.id],
                            }))
                          }
                          className="mb-4 text-sm font-semibold text-[#1f2b44] underline underline-offset-4 hover:text-[#334a75]"
                        >
                          {enunciadoExpandido ? "Ler menos" : "Ler mais"}
                        </button>
                      )}

                      <p className="mb-5 text-xl font-semibold leading-none text-[#1f2b44] md:text-[2.05rem]">
                        <span className="text-[#627393]">Gabarito:</span> {erro.gabarito || "-"}
                      </p>

                      <div className="rounded-xl border border-[#e7dcc5] bg-[#eee8db] p-4 md:p-5">
                        <p className="mb-5 text-[1.1rem] leading-relaxed text-[#1f2b44]">
                          <span className="font-semibold">Por que errei:</span> {reasonSummary}
                        </p>
                        <p className="mb-2 text-[1.1rem] font-semibold text-[#1f2b44]">Explicação:</p>
                        <p className="whitespace-pre-line text-[1.1rem] leading-relaxed text-[#1f2b44]">
                          {detailedExplanation || "Sem explicação detalhada."}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm font-bold tracking-[0.08em] text-[#6c7d9c] uppercase md:text-[1.15rem]">
                          {erro.banca || "Sem banca"}
                        </p>
                        <p className="text-sm font-semibold text-[#6c7d9c] md:text-[1.15rem]">{erro.date}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="font-display font-black text-2xl text-foreground">{dashboardStats.total}</p>
                <p className="text-xs font-body text-muted-foreground">Total de erros</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="font-display font-black text-2xl text-emerald-500">{dashboardStats.revisadas}</p>
                <p className="text-xs font-body text-muted-foreground">Revisadas</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="font-display font-black text-2xl text-rose-500">{dashboardStats.comDuvida}</p>
                <p className="text-xs font-body text-muted-foreground">Com dúvida</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="font-display font-black text-2xl text-amber-500">{dashboardStats.pendentes}</p>
                <p className="text-xs font-body text-muted-foreground">Pendentes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-display font-bold text-foreground mb-3">Erros por matéria</h3>

                {subjectChartData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-muted-foreground font-body text-sm">
                    Nenhum dado disponível.
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={subjectChartData} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} height={55} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip
                          formatter={(value) => [`${value} questão(ões)`, "Total"]}
                          labelFormatter={(label) => `Matéria: ${label}`}
                        />
                        <Bar dataKey="total" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-display font-bold text-foreground mb-3">Tipos de erro</h3>

                {errorTypeChartData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-muted-foreground font-body text-sm">
                    Nenhum dado disponível.
                  </div>
                ) : (
                  <>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={errorTypeChartData}
                            dataKey="total"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={85}
                            paddingAngle={2}
                          >
                            {errorTypeChartData.map((item, index) => (
                              <Cell key={item.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} questão(ões)`, "Total"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-3">
                      {errorTypeChartData.map((item, index) => (
                        <div key={item.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                          />
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {errorTypes.map((type) => {
                const count = errorTypeCount(type);
                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors"
                  >
                    <h4 className="font-body font-bold text-foreground mb-2">{type}</h4>
                    <p className="text-primary font-display font-black text-2xl">{count}</p>
                  </motion.div>
                );
              })}
            </div>

            {subjects.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {subjects.map((subject) => {
                  const count = subjectCount(subject);
                  return (
                    <motion.div
                      key={subject}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors"
                    >
                      <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                      <h3 className="font-body text-sm font-bold text-foreground mb-1">{subject}</h3>
                      <p className="text-primary font-display font-bold text-lg">{count}</p>
                      <p className="text-xs text-muted-foreground font-body">
                        {count === 1 ? "questão" : "questões"}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <Dialog
          open={openQuestionModal}
          onOpenChange={(open) => {
            if (!open) {
              handleCloseQuestionDetails();
            }
          }}
        >
          <DialogContent className="[&>button]:hidden max-w-[640px] max-h-[86vh] overflow-y-auto border-[#d6d3cc] bg-[#f5f5f5] p-0">
            {selectedErro && (
              <div className="font-display p-4 md:p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h2 className="text-[1.45rem] leading-none font-semibold text-[#25324a]">
                      {selectedErro.materia || "Sem matéria"}
                    </h2>
                    <p className="mt-1 text-[0.95rem] text-[#627393]">
                      {selectedErro.assunto || "Sem assunto"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseQuestionDetails}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#25324a] hover:bg-[#e8ebf1]"
                    title="Fechar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-[1rem] font-semibold text-[#1f2b44]">Enunciado</p>
                    <p className="mt-1 whitespace-pre-line text-[0.98rem] leading-relaxed text-[#1f2b44]">
                      {selectedErro.enunciado || "Sem enunciado."}
                    </p>
                  </div>

                  <div>
                    <p className="text-[1rem] font-semibold text-[#1f2b44]">Gabarito</p>
                    <Input
                      value={selectedErro.gabarito || "-"}
                      readOnly
                      className="mt-1 h-10 border-[#e6c977] bg-[#efe9db] text-[#cc9809] text-base font-semibold"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[1rem] font-semibold text-[#1f2b44]">Por que errei?</p>
                      <button
                        type="button"
                        onClick={() => setReasonEditable(true)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#25324a] hover:bg-[#e8ebf1]"
                        title="Editar por que errei"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                    <Textarea
                      value={editReasonDraft}
                      onChange={(e) => setEditReasonDraft(e.target.value)}
                      readOnly={!reasonEditable}
                      rows={6}
                      className="resize-none border-[#ddd6c7] bg-[#efede8] text-[0.98rem] leading-relaxed text-[#1f2b44] read-only:cursor-default read-only:opacity-100"
                    />
                  </div>

                  <div className="rounded-xl border border-[#ddd6c7] bg-[#efede8] p-3">
                    <div className="grid grid-cols-2 gap-y-1.5 text-[0.95rem]">
                      <p className="text-[#627393]">Banca</p>
                      <p className="text-right text-[#1f2b44]">{selectedErro.banca || "-"}</p>

                      <p className="text-[#627393]">Tipo de erro</p>
                      <p className="text-right text-[#1f2b44]">{selectedErro.tipoErro || "-"}</p>

                      <p className="text-[#627393]">Status</p>
                      <p className="text-right text-[#1f2b44]">{selectedErro.statusRevisao}</p>

                      <p className="text-[#627393]">Criada em</p>
                      <p className="text-right text-[#1f2b44]">{selectedErro.date}</p>

                      <p className="text-[#627393]">Link</p>
                      <p className="text-right break-all text-[#1f2b44]">{selectedErro.link || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleDeleteFromDetails}
                    className="h-10 rounded-xl border border-[#f2a7aa] text-[#e25157] hover:bg-[#fff1f2]"
                  >
                    Excluir
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseQuestionDetails}
                    className="h-10 rounded-xl bg-primary text-white hover:bg-primary/90"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={openErrorModal} onOpenChange={setOpenErrorModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Nova Questão</DialogTitle>
              <DialogDescription>Preencha os campos para adicionar um novo erro ao caderno.</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-body font-bold text-foreground mb-2">Link da questão</label>
                <Input
                  placeholder="https://..."
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body font-bold text-foreground mb-2">
                    Matéria <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.materia}
                    onValueChange={(value) => setFormData({ ...formData, materia: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={subjects.length > 0 ? "Selecione" : "Cadastre uma matéria primeiro"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-body font-bold text-foreground mb-2">Banca</label>
                  <Select
                    value={formData.banca}
                    onValueChange={(value) => setFormData({ ...formData, banca: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {bancas.map((banca) => (
                        <SelectItem key={banca} value={banca}>
                          {banca}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-body font-bold text-foreground mb-2">Assunto</label>
                <Input
                  placeholder="Ex: Direção defensiva"
                  value={formData.assunto}
                  onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-body font-bold text-foreground mb-2">Enunciado</label>
                <Textarea
                  placeholder="Cole o enunciado da questão..."
                  value={formData.enunciado}
                  onChange={(e) => setFormData({ ...formData, enunciado: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h3 className="font-display font-bold text-foreground mb-4">Pulo do Gato</h3>
                <p className="text-xs text-muted-foreground font-body mb-4">
                  Registre o gabarito, o tipo de erro e o aprendizado.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-body font-bold text-foreground mb-2">
                      Gabarito <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Ex: A"
                      value={formData.gabarito}
                      onChange={(e) => setFormData({ ...formData, gabarito: e.target.value.toUpperCase() })}
                      maxLength={1}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-body font-bold text-foreground mb-2">
                      Tipo de erro <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.tipoErro}
                      onValueChange={(value) => setFormData({ ...formData, tipoErro: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {errorTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-body font-bold text-foreground mb-2">
                      Status da revisão
                    </label>
                    <Select
                      value={formData.statusRevisao}
                      onValueChange={(value) => {
                        if (isStatusRevisao(value)) {
                          setFormData({ ...formData, statusRevisao: value });
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {REVIEW_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-body font-bold text-foreground mb-2">
                      Por que errei? <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder="Descreva o motivo do erro e o aprendizado..."
                      value={formData.porQueErrei}
                      onChange={(e) => setFormData({ ...formData, porQueErrei: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setOpenErrorModal(false)}
                  className="px-4 py-2 rounded-lg text-foreground hover:bg-secondary transition-colors font-body font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={addError}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-display font-bold"
                >
                  Salvar
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openMateriasModal} onOpenChange={setOpenMateriasModal}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Cadastrar Matérias</DialogTitle>
              <DialogDescription>Adicione, revise ou remova as matérias usadas no caderno.</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o nome da matéria..."
                  value={novaMateria}
                  onChange={(e) => setNovaMateria(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addMateria()}
                  className="flex-1"
                />
                <motion.button
                  onClick={addMateria}
                  className="flex items-center gap-2 bg-primary text-white font-display font-bold px-4 py-2 rounded-lg hover:scale-[1.03] active:scale-[0.98] transition-transform"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </motion.button>
              </div>

              <div>
                <h3 className="font-display font-bold text-foreground mb-3">
                  Matérias cadastradas ({materias.length})
                </h3>

                {materias.length === 0 ? (
                  <div className="text-center py-8 bg-card border border-border rounded-lg">
                    <BookMarked className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-60" />
                    <p className="text-muted-foreground font-body">Nenhuma matéria cadastrada ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {materias.map((materia) => (
                      <div
                        key={materia.id}
                        className="bg-card border border-border rounded-lg p-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-body font-bold text-foreground">{materia.nome}</p>
                          <p className="text-xs text-muted-foreground">Adicionada em {materia.dataCriacao}</p>
                        </div>
                        <button
                          onClick={() => removeMateria(materia.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          title="Remover matéria"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CadernoDeErros;


