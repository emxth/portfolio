import { useEffect, useState } from "react";
import api from "../../api/axios";

const initialSkillForm = {
  name: "",
  level: "",
  category: "General",
  visible: true,
};

export default function AdminSkillsSection() {
  const [skills, setSkills] = useState([]);
  const [skillForm, setSkillForm] = useState(initialSkillForm);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSkills = async () => {
    const { data } = await api.get("/skills");
    setSkills(data || []);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const resetSkillForm = () => {
    setSkillForm(initialSkillForm);
    setEditingSkillId(null);
  };

  const onSkillChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSkillForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitSkill = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingSkillId) {
        await api.put(`/skills/${editingSkillId}`, skillForm);
      } else {
        await api.post("/skills", skillForm);
      }
      await fetchSkills();
      resetSkillForm();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save skill");
    } finally {
      setLoading(false);
    }
  };

  const editSkill = (s) => {
    setEditingSkillId(s.id);
    setSkillForm({
      name: s.name || "",
      level: s.level || "",
      category: s.category || "General",
      visible: s.visible !== false,
    });
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    await api.delete(`/skills/${id}`);
    await fetchSkills();
  };

  const toggleSkillVisibility = async (s) => {
    await api.put(`/skills/${s.id}`, { visible: !s.visible });
    await fetchSkills();
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={submitSkill} className="grid gap-3 p-4 border rounded-xl">
        <h2 className="text-xl font-semibold">{editingSkillId ? "Edit Skill" : "Add Skill"}</h2>

        <input className="p-2 border rounded" name="name" placeholder="Skill name (React, Node.js...)" value={skillForm.name} onChange={onSkillChange} required />
        <input className="p-2 border rounded" name="level" placeholder="Beginner / Intermediate / Advanced" value={skillForm.level} onChange={onSkillChange} />
        <input className="p-2 border rounded" name="category" placeholder="Frontend / Backend / DevOps" value={skillForm.category} onChange={onSkillChange} />

        <label className="flex items-center gap-2">
          <input type="checkbox" name="visible" checked={skillForm.visible} onChange={onSkillChange} />
          Visible
        </label>

        <div className="flex gap-2">
          <button className="px-4 py-2 text-white bg-black rounded" disabled={loading}>
            {loading ? "Saving..." : editingSkillId ? "Update Skill" : "Create Skill"}
          </button>
          {editingSkillId && (
            <button type="button" onClick={resetSkillForm} className="px-4 py-2 border rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-3">
        {skills.map((s) => (
          <div key={s.id} className="flex items-start justify-between p-4 border rounded-xl">
            <div>
              <h3 className="font-semibold">{s.name}</h3>
              <p className="text-sm text-gray-700">Level: {s.level || "-"}</p>
              <p className="text-sm text-gray-700">Category: {s.category || "-"}</p>
              <p className="text-sm text-gray-700">Visible: {s.visible ? "Yes" : "No"}</p>
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={() => editSkill(s)} className="px-3 py-1 border rounded">Edit</button>
              <button onClick={() => toggleSkillVisibility(s)} className="px-3 py-1 border rounded">
                {s.visible ? "Hide" : "Show"}
              </button>
              <button onClick={() => deleteSkill(s.id)} className="px-3 py-1 text-red-600 border rounded">Delete</button>
            </div>
          </div>
        ))}
        {skills.length === 0 && <p className="text-sm text-gray-500">No skills found.</p>}
      </div>
    </div>
  );
}