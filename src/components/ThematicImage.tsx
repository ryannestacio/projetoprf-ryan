import { motion } from "framer-motion";

interface ThematicImageProps {
  src: string;
  alt: string;
}

const ThematicImage = ({ src, alt }: ThematicImageProps) => {
  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", duration: 0.5, bounce: 0 }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-elevated"
        style={{
          outline: "1px solid hsl(220 15% 25% / 0.5)",
          outlineOffset: "-1px",
        }}
        loading="lazy"
      />
    </motion.div>
  );
};

export default ThematicImage;
