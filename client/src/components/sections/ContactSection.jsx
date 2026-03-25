import { useState } from "react";
import SectionWrapper from "../SectionWrapper";
import { motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <SectionWrapper id="contact" alt>
      <div className="relative">
        {/* subtle decorative glow */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left copy */}
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-display font-bold section-title">
              Get In Touch
            </h2>
            <p className="mt-3 text-muted-foreground text-lg leading-relaxed">
              Want to collaborate or have an opportunity in mind? Send a message and
              I’ll get back to you as soon as possible.
            </p>

            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground/85">Tip:</span>{" "}
                Include project scope, timeline, and your preferred tech stack.
              </p>
            </div>
          </div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="form-card p-6 md:p-7"
          >
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="field-label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  className="field"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={onChange}
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className="field"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  className="field"
                  name="message"
                  placeholder="Tell me about your idea, project, or role..."
                  rows={5}
                  value={form.message}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="pt-1 flex items-center gap-3">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitted}
                >
                  <Send className="h-4 w-4" />
                  {submitted ? "Sent" : "Send Message"}
                </button>

                <span className="text-xs text-muted-foreground">
                  No spam. Just a quick reply.
                </span>
              </div>
            </form>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="toast-success"
              >
                <CheckCircle2 className="h-4 w-4" />
                Thank you! Your message has been sent.
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}