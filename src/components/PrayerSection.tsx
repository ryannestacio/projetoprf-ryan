import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import santoTomas from "@/assets/santo-tomas.jpeg";

const PRAYER_TEXT = `Infalível Criador, que, dos tesouros da Vossa sabedoria, tirastes as hierarquias dos anjos, colocando-as com ordem admirável no céu;

Vós, que distribuístes o universo com encantadora harmonia; Vós, que sois a verdadeira fonte da luz e o princípio supremo da sabedoria,

Difundi sobre as trevas da minha mente o raio do esplendor, removendo as duplas trevas nas quais nasci: o pecado e a ignorância.

Vós, que tornastes fecunda a língua das crianças, tornai erudita a minha língua e espalhai sobre os meus lábios a vossa bênção.

Concedei-me a agudeza de entender,
a capacidade de reter,
a sutileza de relevar,
a facilidade de aprender,
a graça abundante de falar e de escrever.

Ensinai-me a começar, regei-me no continuar e no perseverar até o término.

Vós, que sois verdadeiro Deus e verdadeiro homem,
que viveis e reinais pelos séculos dos séculos. Amém!`;

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