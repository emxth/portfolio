import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

const initialForm = {
  title: "",
  description: "",
  techStack: "",
  githubUrl: "",
  liveUrl: "",
  featured: false,
  visible: true,
};

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    const { data } = await api.get("/projects");
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    setEditingId(null);
  };

  const createOrUpdateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("techStack", form.techStack);
      payload.append("githubUrl", form.githubUrl);
      payload.append("liveUrl", form.liveUrl);
      payload.append("featured", String(form.featured));
      payload.append("visible", String(form.visible));
      if (imageFile) payload.append("image", imageFile);

      if (editingId) {
        await api.put(`/projects/${editingId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/projects", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchProjects();
      resetForm();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title || "",
      description: p.description || "",
      techStack: Array.isArray(p.techStack) ? p.techStack.join(", ") : "",
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || "",
      featured: !!p.featured,
      visible: p.visible !== false,
    });
    setImageFile(null);
  };

  const removeProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    await api.delete(`/projects/${id}`);
    await fetchProjects();
  };

  const toggleVisibility = async (project) => {
    await api.put(`/projects/${project.id}`, { visible: !project.visible });
    await fetchProjects();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3 items-center">
          <span className="text-sm text-gray-600">Hi, {user?.username}</span>
          <button onClick={logout} className="px-4 py-2 border rounded">Logout</button>
        </div>
      </div>

      <form onSubmit={createOrUpdateProject} className="grid gap-3 border rounded-xl p-4 mb-8">
        <h2 className="text-xl font-semibold">{editingId ? "Edit Project" : "Add Project"}</h2>
        <input className="border rounded p-2" name="title" placeholder="Title" value={form.title} onChange={onChange} required />
        <textarea className="border rounded p-2" name="description" placeholder="Description" value={form.description} onChange={onChange} required />
        <input className="border rounded p-2" name="techStack" placeholder="React, Node, Express" value={form.techStack} onChange={onChange} />
        <input className="border rounded p-2" name="githubUrl" placeholder="GitHub URL" value={form.githubUrl} onChange={onChange} />
        <input className="border rounded p-2" name="liveUrl" placeholder="Live URL" value={form.liveUrl} onChange={onChange} />
        <input className="border rounded p-2" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" checked={form.featured} onChange={onChange} />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="visible" checked={form.visible} onChange={onChange} />
          Visible
        </label>

        <div className="flex gap-2">
          <button className="bg-black text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? "Saving..." : editingId ? "Update Project" : "Create Project"}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-4">
        {projects.map((p) => (
          <div key={p.id} className="border rounded-xl p-4">
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-gray-700">{p.description}</p>
                <p className="text-sm mt-1">Tech: {Array.isArray(p.techStack) ? p.techStack.join(", ") : ""}</p>
                <p className="text-sm">Visible: {p.visible ? "Yes" : "No"}</p>
                {p.image ? (
                  <img
                    src={`http://localhost:5000${p.image}`}
                    alt={p.title}
                    className="mt-3 w-40 h-24 object-cover rounded border"
                  />
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => startEdit(p)} className="px-3 py-1 border rounded">Edit</button>
                <button onClick={() => toggleVisibility(p)} className="px-3 py-1 border rounded">
                  {p.visible ? "Hide" : "Show"}
                </button>
                <button onClick={() => removeProject(p.id)} className="px-3 py-1 border rounded text-red-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}