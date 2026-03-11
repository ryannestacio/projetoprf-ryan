import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import santoTomas from "@/assets/santo-tomas.jpeg";

const PRAYER_TEXT = `Criador inefavel, que dos tesouros de Vossa sabedoria
designastes tres hierarquias de Anjos e as colocastes numa ordem admiravel
acima dos ceus e dispusestes com tanta beleza as partes do universo:

Vos que sois chamado a verdadeira fonte de luz e de sabedoria
e o principio supereminente, dignai-Vos derramar sobre as trevas
da minha inteligencia um raio da Vossa claridade,
afastando de mim as duplas trevas em que nasci: o pecado e a ignorancia.

Vos, que fazeis eloqeente a lingua das criancas,
instruí a minha lingua e derramai nos meus labios a graca de Vossa bencao.

Dai-me agudeza para entender, capacidade para reter,
metodo e facilidade para aprender,
subtileza para interpretar e graca abundante para falar.

Dai-me Vos o inicio, dirigi o meu progresso
e coroai o meu fim.

Por Nosso Senhor Jesus Cristo, Vosso Filho,
que convosco vive e reina, na unidade do Espirito Santo.

Amem.`;

const PrayerSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
        >
          <h2 className="font-display font-bold text-h2 text-foreground flex items-center justify-center gap-3">
            <BookOpen className="w-7 h-7 text-primary" />
            Oracao de Sao Tomas de Aquino para os Estudos
          </h2>
        </motion.div>

        <motion.div
          className="bg-card rounded-3xl shadow-elevated p-8 md:p-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-start"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", duration: 0.5, bounce: 0, delay: 0.1 }}
        >
          <div className="whitespace-pre-line text-foreground/90 font-body text-sm leading-relaxed">
            {PRAYER_TEXT}
          </div>

          <img
            src={santoTomas}
            alt="Sao Tomas de Aquino"
            className="w-full md:w-64 h-auto rounded-2xl shadow-elevated object-cover"
            style={{
              outline: "1px solid hsl(220 15% 25% / 0.5)",
              outlineOffset: "-1px",
            }}
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default PrayerSection;
