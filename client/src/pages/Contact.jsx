import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onChange = (e) =>
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));

  const onSubmit = (e) => {
    e.preventDefault();
    alert("Contact form submitted (backend endpoint can be wired in next step).");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <form onSubmit={onSubmit} className="grid gap-3 border rounded-xl p-4">
        <input
          className="border rounded p-2"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          className="border rounded p-2"
          type="email"
          name="email"
          placeholder="Your email"
          value={form.email}
          onChange={onChange}
          required
        />
        <textarea
          className="border rounded p-2"
          name="message"
          placeholder="Message"
          rows={5}
          value={form.message}
          onChange={onChange}
          required
        />
        <button className="bg-black text-white rounded p-2">Send</button>
      </form>
    </main>
  );
}