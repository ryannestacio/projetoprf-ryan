import { motion } from "framer-motion";
import prfLogo from "@/assets/prf-logo.jpeg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, hsl(220 25% 15%), hsl(220 25% 10%))",
        }}
      />
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      }} />
      
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0 }}
      >
        <motion.img
          src={prfLogo}
          alt="PRF Logo"
          className="w-48 md:w-64 h-auto mb-8 rounded-2xl shadow-elevated"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0, delay: 0.1 }}
        />
        
        <h1 className="font-display font-black text-hero text-foreground tracking-tight mb-4">
          MISSAO: <span className="text-primary">APROVACAO.</span>
        </h1>
        
        <p className="font-body text-muted-foreground text-sm md:text-base max-w-xl mb-8 leading-relaxed">
          Painel de Controle Tatico. Cronograma semanal, checklist e horas liquidas para sua jornada PRF.
        </p>
        
        <a
          href="#cronometro"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold px-6 py-3 rounded-lg hover:scale-[1.03] active:scale-[0.98] transition-transform shadow-gold"
        >
          INICIAR OPERACAO
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
