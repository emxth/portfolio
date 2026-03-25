import { motion } from "framer-motion";

export default function SectionWrapper({ id, children, className = "", alt = false }) {
  return (
    <section
      id={id}
      className={`relative py-18 md:py-22 px-4 ${
        alt ? "bg-section-alt" : "bg-background"
      } ${className}`}
    >
      {/* subtle section separator */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-border/70" />

      <motion.div
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        {children}
      </motion.div>
    </section>
  );
}