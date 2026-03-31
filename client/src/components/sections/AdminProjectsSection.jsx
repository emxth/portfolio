import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toAssetUrl } from "../../api/url";

const initialProjectForm = {
  title: "",
  description: "",
  techStack: "",
  githubUrl: "",
  liveUrl: "",
  featured: false,
  visible: true,
};

export default function AdminProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    const { data } = await api.get("/projects");
    setProjects(data || []);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetProjectForm = () => {
    setProjectForm(initialProjectForm);
    setProjectImageFile(null);
    setEditingProjectId(null);
  };

  const onProjectChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", projectForm.title);
      formData.append("description", projectForm.description);
      formData.append("techStack", projectForm.techStack);
      formData.append("githubUrl", projectForm.githubUrl);
      formData.append("liveUrl", projectForm.liveUrl);
      formData.append("featured", String(projectForm.featured));
      formData.append("visible", String(projectForm.visible));
      if (projectImageFile) formData.append("image", projectImageFile);

      if (editingProjectId) {
        await api.put(`/projects/${editingProjectId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/projects", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchProjects();
      resetProjectForm();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  const editProject = (p) => {
    setEditingProjectId(p.id);
    setProjectForm({
      title: p.title || "",
      description: p.description || "",
      techStack: Array.isArray(p.techStack) ? p.techStack.join(", ") : "",
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || "",
      featured: !!p.featured,
      visible: p.visible !== false,
    });
    setProjectImageFile(null);
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await api.delete(`/projects/${id}`);
    await fetchProjects();
  };

  const toggleProjectVisibility = async (p) => {
    await api.put(`/projects/${p.id}`, { visible: !p.visible });
    await fetchProjects();
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={submitProject} className="grid gap-3 p-4 border rounded-xl">
        <h2 className="text-xl font-semibold">
          {editingProjectId ? "Edit Project" : "Add Project"}
        </h2>

        <input className="p-2 border rounded" name="title" placeholder="Title" value={projectForm.title} onChange={onProjectChange} required />
        <textarea className="p-2 border rounded" name="description" placeholder="Description" value={projectForm.description} onChange={onProjectChange} required />
        <input className="p-2 border rounded" name="techStack" placeholder="React, Node, Express" value={projectForm.techStack} onChange={onProjectChange} />
        <input className="p-2 border rounded" name="githubUrl" placeholder="GitHub URL" value={projectForm.githubUrl} onChange={onProjectChange} />
        <input className="p-2 border rounded" name="liveUrl" placeholder="Live URL" value={projectForm.liveUrl} onChange={onProjectChange} />

        <input className="p-2 border rounded" type="file" accept="image/*" onChange={(e) => setProjectImageFile(e.target.files?.[0] || null)} />

        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" checked={projectForm.featured} onChange={onProjectChange} />
          Featured
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="visible" checked={projectForm.visible} onChange={onProjectChange} />
          Visible
        </label>

        <div className="flex gap-2">
          <button className="px-4 py-2 text-white bg-black rounded" disabled={loading}>
            {loading ? "Saving..." : editingProjectId ? "Update Project" : "Create Project"}
          </button>
          {editingProjectId && (
            <button type="button" onClick={resetProjectForm} className="px-4 py-2 border rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-4">
        {projects.map((p) => (
          <div key={p.id} className="p-4 border rounded-xl">
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-gray-700">{p.description}</p>
                <p className="mt-1 text-sm">
                  Tech: {Array.isArray(p.techStack) ? p.techStack.join(", ") : ""}
                </p>
                <p className="text-sm">Featured: {p.featured ? "Yes" : "No"}</p>
                <p className="text-sm">Visible: {p.visible ? "Yes" : "No"}</p>

                {p.image && (
                  <img
                    src={toAssetUrl(p.image)}
                    alt={p.title}
                    className="object-cover mt-3 border rounded w-44 h-28"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => editProject(p)} className="px-3 py-1 border rounded">Edit</button>
                <button onClick={() => toggleProjectVisibility(p)} className="px-3 py-1 border rounded">
                  {p.visible ? "Hide" : "Show"}
                </button>
                <button onClick={() => deleteProject(p.id)} className="px-3 py-1 text-red-600 border rounded">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-sm text-gray-500">No projects found.</p>}
      </div>
    </div>
  );
}