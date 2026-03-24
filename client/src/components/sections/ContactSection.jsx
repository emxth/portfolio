import { useState } from "react";
import SectionWrapper from "../SectionWrapper";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors";

  return (
    <SectionWrapper id="contact" alt>
      <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">Get In Touch</h2>
      <div className="max-w-lg">
        <form onSubmit={onSubmit} className="space-y-4">
          <motion.input initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className={inputClasses} name="name" placeholder="Your name" value={form.name} onChange={onChange} required />
          <motion.input initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className={inputClasses} type="email" name="email" placeholder="Your email" value={form.email} onChange={onChange} required />
          <motion.textarea initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className={inputClasses} name="message" placeholder="Your message" rows={5} value={form.message} onChange={onChange} required />
          <motion.button initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium">
            <Send className="h-4 w-4" /> Send Message
          </motion.button>
        </form>
        {submitted && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm text-primary font-medium">
            Thank you! Your message has been sent.
          </motion.p>
        )}
      </div>
    </SectionWrapper>
  );
}