import { motion } from "framer-motion";

export default function SectionWrapper({ id, children, className = "", alt = false }) {
  return (
    <section id={id} className={`py-20 px-4 ${alt ? "bg-section-alt" : "bg-background"} ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        {children}
      </motion.div>
    </section>
  );
}