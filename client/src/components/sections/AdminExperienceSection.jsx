import { useEffect, useState } from "react";
import api from "../../api/axios";

const initialExperienceForm = {
  role: "",
  company: "",
  duration: "",
  description: "",
  visible: true,
};

export default function AdminExperienceSection() {
  const [experience, setExperience] = useState([]);
  const [experienceForm, setExperienceForm] = useState(initialExperienceForm);
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchExperience = async () => {
    const { data } = await api.get("/experience");
    setExperience(data || []);
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const resetExperienceForm = () => {
    setExperienceForm(initialExperienceForm);
    setEditingExperienceId(null);
  };

  const onExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExperienceForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitExperience = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingExperienceId) {
        await api.put(`/experience/${editingExperienceId}`, experienceForm);
      } else {
        await api.post("/experience", experienceForm);
      }
      await fetchExperience();
      resetExperienceForm();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save experience");
    } finally {
      setLoading(false);
    }
  };

  const editExperience = (item) => {
    setEditingExperienceId(item.id);
    setExperienceForm({
      role: item.role || "",
      company: item.company || "",
      duration: item.duration || "",
      description: item.description || "",
      visible: item.visible !== false,
    });
  };

  const deleteExperience = async (id) => {
    if (!window.confirm("Delete this experience?")) return;
    await api.delete(`/experience/${id}`);
    await fetchExperience();
  };

  const toggleExperienceVisibility = async (item) => {
    await api.put(`/experience/${item.id}`, { visible: !item.visible });
    await fetchExperience();
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={submitExperience} className="grid gap-3 p-4 border rounded-xl">
        <h2 className="text-xl font-semibold">
          {editingExperienceId ? "Edit Experience" : "Add Experience"}
        </h2>

        <input className="p-2 border rounded" name="role" placeholder="Role" value={experienceForm.role} onChange={onExperienceChange} required />
        <input className="p-2 border rounded" name="company" placeholder="Company" value={experienceForm.company} onChange={onExperienceChange} required />
        <input className="p-2 border rounded" name="duration" placeholder="Jan 2025 - Jun 2025" value={experienceForm.duration} onChange={onExperienceChange} />
        <textarea className="p-2 border rounded" name="description" placeholder="What you worked on..." value={experienceForm.description} onChange={onExperienceChange} />

        <label className="flex items-center gap-2">
          <input type="checkbox" name="visible" checked={experienceForm.visible} onChange={onExperienceChange} />
          Visible
        </label>

        <div className="flex gap-2">
          <button className="px-4 py-2 text-white bg-black rounded" disabled={loading}>
            {loading ? "Saving..." : editingExperienceId ? "Update Experience" : "Create Experience"}
          </button>
          {editingExperienceId && (
            <button type="button" onClick={resetExperienceForm} className="px-4 py-2 border rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-3">
        {experience.map((item) => (
          <div key={item.id} className="flex items-start justify-between p-4 border rounded-xl">
            <div>
              <h3 className="font-semibold">{item.role} @ {item.company}</h3>
              <p className="text-sm text-gray-700">Duration: {item.duration || "-"}</p>
              <p className="mt-1 text-sm text-gray-700">{item.description || "-"}</p>
              <p className="mt-1 text-sm text-gray-700">Visible: {item.visible ? "Yes" : "No"}</p>
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={() => editExperience(item)} className="px-3 py-1 border rounded">Edit</button>
              <button onClick={() => toggleExperienceVisibility(item)} className="px-3 py-1 border rounded">
                {item.visible ? "Hide" : "Show"}
              </button>
              <button onClick={() => deleteExperience(item.id)} className="px-3 py-1 text-red-600 border rounded">Delete</button>
            </div>
          </div>
        ))}
        {experience.length === 0 && <p className="text-sm text-gray-500">No experience records found.</p>}
      </div>
    </div>
  );
}