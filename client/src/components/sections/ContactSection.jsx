import { useState } from "react";
import SectionWrapper from "../SectionWrapper";
import { motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import api from "../../api/axios";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      await api.post("/contact", form);
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <SectionWrapper id="contact" alt>
      <div className="relative">
        <div className="absolute w-56 h-56 rounded-full pointer-events-none -top-10 -right-10 bg-primary/10 blur-3xl" />

        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold md:text-4xl font-display section-title">Get In Touch</h2>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              Want to collaborate or have an opportunity in mind? Send a message and I’ll get back to you as soon as possible.
            </p>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p><span className="font-semibold text-foreground/85">Tip:</span> Include project scope, timeline, and your preferred tech stack.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="p-6 form-card md:p-7"
          >
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="field-label" htmlFor="name">Name</label>
                <input id="name" className="field" name="name" placeholder="Your name" value={form.name} onChange={onChange} required />
              </div>

              <div>
                <label className="field-label" htmlFor="email">Email</label>
                <input id="email" className="field" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
              </div>

              <div>
                <label className="field-label" htmlFor="message">Message</label>
                <textarea id="message" className="field" name="message" placeholder="Tell me about your idea, project, or role..." rows={5} value={form.message} onChange={onChange} required />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button type="submit" className="btn-primary" disabled={sending}>
                  <Send className="w-4 h-4" />
                  {sending ? "Sending..." : "Send Message"}
                </button>
                <span className="text-xs text-muted-foreground">No spam. Just a quick reply.</span>
              </div>
            </form>

            {submitted && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="toast-success">
                <CheckCircle2 className="w-4 h-4" />
                Thank you! Your message has been sent.
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}