import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

const TABS = {
  PROJECTS: "projects",
  SKILLS: "skills",
  EXPERIENCE: "experience",
  PROFILE: "profile",
};

const initialProjectForm = {
  title: "",
  description: "",
  techStack: "",
  githubUrl: "",
  liveUrl: "",
  featured: false,
  visible: true,
};

const initialSkillForm = {
  name: "",
  level: "",
  category: "General",
  visible: true,
};

const initialExperienceForm = {
  role: "",
  company: "",
  duration: "",
  description: "",
  visible: true,
};

const initialProfileForm = {
  name: "",
  role: "",
  intro: "",
  about: "",
  linkedin: "",
  github: "",
  contactNo: "",
  email: "",
  cvUrl: "",
};

export default function AdminDashboard() {
  const { logout, user } = useAuth();

  const [activeTab, setActiveTab] = useState(TABS.PROJECTS);

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [profileForm, setProfileForm] = useState(initialProfileForm);

  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [skillForm, setSkillForm] = useState(initialSkillForm);
  const [experienceForm, setExperienceForm] = useState(initialExperienceForm);

  const [projectImageFile, setProjectImageFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editingExperienceId, setEditingExperienceId] = useState(null);

  const [loading, setLoading] = useState(false);

  const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:5000";

  const fetchProjects = async () => {
    const { data } = await api.get("/projects");
    setProjects(data);
  };

  const fetchSkills = async () => {
    const { data } = await api.get("/skills");
    setSkills(data);
  };

  const fetchExperience = async () => {
    const { data } = await api.get("/experience");
    setExperience(data);
  };

  const fetchProfile = async () => {
    const { data } = await api.get("/profile");
    setProfileForm({
      name: data?.name || "",
      role: data?.role || "",
      intro: data?.intro || "",
      about: data?.about || "",
      linkedin: data?.linkedin || "",
      github: data?.github || "",
      contactNo: data?.contactNo || "",
      email: data?.email || "",
      cvUrl: data?.cvUrl || "",
    });
  };

  const loadAll = async () => {
    await Promise.all([fetchProjects(), fetchSkills(), fetchExperience(), fetchProfile()]);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const resetProjectForm = () => {
    setProjectForm(initialProjectForm);
    setProjectImageFile(null);
    setEditingProjectId(null);
  };

  const resetSkillForm = () => {
    setSkillForm(initialSkillForm);
    setEditingSkillId(null);
  };

  const resetExperienceForm = () => {
    setExperienceForm(initialExperienceForm);
    setEditingExperienceId(null);
  };

  // -----------------------
  // PROJECTS CRUD
  // -----------------------
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
    setActiveTab(TABS.PROJECTS);
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

  // -----------------------
  // SKILLS CRUD
  // -----------------------
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
    setActiveTab(TABS.SKILLS);
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

  // -----------------------
  // EXPERIENCE CRUD
  // -----------------------
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
    setActiveTab(TABS.EXPERIENCE);
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

  // -----------------------
  // PROFILE (ABOUT + LINKS + CV)
  // -----------------------
  const onProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: profileForm.name,
        role: profileForm.role,
        intro: profileForm.intro,
        about: profileForm.about,
        linkedin: profileForm.linkedin,
        github: profileForm.github,
        contactNo: profileForm.contactNo,
        email: profileForm.email,
      };
      await api.put("/profile", payload);
      await fetchProfile();
      alert("Profile updated successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const uploadCv = async (e) => {
    e.preventDefault();
    if (!cvFile) return alert("Please choose a CV file first");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("cv", cvFile);
      await api.put("/profile/cv", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCvFile(null);
      await fetchProfile();
      alert("CV uploaded successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to upload CV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3 items-center">
          <span className="text-sm text-gray-600">Hi, {user?.username}</span>
          <button onClick={logout} className="px-4 py-2 border rounded">
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setActiveTab(TABS.PROJECTS)} className={`px-4 py-2 rounded border ${activeTab === TABS.PROJECTS ? "bg-black text-white" : ""}`}>Projects</button>
        <button onClick={() => setActiveTab(TABS.SKILLS)} className={`px-4 py-2 rounded border ${activeTab === TABS.SKILLS ? "bg-black text-white" : ""}`}>Skills</button>
        <button onClick={() => setActiveTab(TABS.EXPERIENCE)} className={`px-4 py-2 rounded border ${activeTab === TABS.EXPERIENCE ? "bg-black text-white" : ""}`}>Experience</button>
        <button onClick={() => setActiveTab(TABS.PROFILE)} className={`px-4 py-2 rounded border ${activeTab === TABS.PROFILE ? "bg-black text-white" : ""}`}>Profile & CV</button>
      </div>

      {/* PROFILE TAB */}
      {activeTab === TABS.PROFILE && (
        <div className="grid gap-6">
          <form onSubmit={saveProfile} className="grid gap-3 border rounded-xl p-4">
            <h2 className="text-xl font-semibold">Profile Settings</h2>

            <input className="border rounded p-2" name="name" placeholder="Name" value={profileForm.name} onChange={onProfileChange} />
            <input className="border rounded p-2" name="role" placeholder="Role" value={profileForm.role} onChange={onProfileChange} />
            <input className="border rounded p-2" name="intro" placeholder="Short intro" value={profileForm.intro} onChange={onProfileChange} />
            <textarea className="border rounded p-2" name="about" placeholder="About me..." rows={5} value={profileForm.about} onChange={onProfileChange} />
            <input className="border rounded p-2" name="linkedin" placeholder="LinkedIn URL" value={profileForm.linkedin} onChange={onProfileChange} />
            <input className="border rounded p-2" name="github" placeholder="GitHub URL" value={profileForm.github} onChange={onProfileChange} />
            <input className="border rounded p-2" name="contactNo" placeholder="Contact number" value={profileForm.contactNo} onChange={onProfileChange} />
            <input className="border rounded p-2" name="email" placeholder="Email" value={profileForm.email} onChange={onProfileChange} />

            <div className="flex gap-2">
              <button className="bg-black text-white px-4 py-2 rounded" disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>

          <form onSubmit={uploadCv} className="grid gap-3 border rounded-xl p-4">
            <h3 className="text-lg font-semibold">Upload CV (PDF / DOC / DOCX)</h3>

            <input
              className="border rounded p-2"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
            />

            <div className="flex flex-wrap items-center gap-3">
              <button className="bg-black text-white px-4 py-2 rounded" disabled={loading}>
                {loading ? "Uploading..." : "Upload CV"}
              </button>

              {profileForm.cvUrl ? (
                <a
                  href={`${API_ORIGIN}${profileForm.cvUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 border rounded"
                >
                  View Current CV
                </a>
              ) : (
                <span className="text-sm text-gray-500">No CV uploaded yet.</span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* PROJECTS TAB */}
      {activeTab === TABS.PROJECTS && (
        <div className="grid gap-6">
          <form onSubmit={submitProject} className="grid gap-3 border rounded-xl p-4">
            <h2 className="text-xl font-semibold">{editingProjectId ? "Edit Project" : "Add Project"}</h2>
            <input className="border rounded p-2" name="title" placeholder="Title" value={projectForm.title} onChange={onProjectChange} required />
            <textarea className="border rounded p-2" name="description" placeholder="Description" value={projectForm.description} onChange={onProjectChange} required />
            <input className="border rounded p-2" name="techStack" placeholder="React, Node, Express" value={projectForm.techStack} onChange={onProjectChange} />
            <input className="border rounded p-2" name="githubUrl" placeholder="GitHub URL" value={projectForm.githubUrl} onChange={onProjectChange} />
            <input className="border rounded p-2" name="liveUrl" placeholder="Live URL" value={projectForm.liveUrl} onChange={onProjectChange} />
            <input className="border rounded p-2" type="file" accept="image/*" onChange={(e) => setProjectImageFile(e.target.files?.[0] || null)} />

            <label className="flex items-center gap-2">
              <input type="checkbox" name="featured" checked={projectForm.featured} onChange={onProjectChange} />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="visible" checked={projectForm.visible} onChange={onProjectChange} />
              Visible
            </label>

            <div className="flex gap-2">
              <button className="bg-black text-white px-4 py-2 rounded" disabled={loading}>
                {loading ? "Saving..." : editingProjectId ? "Update Project" : "Create Project"}
              </button>
              {editingProjectId && (
                <button type="button" onClick={resetProjectForm} className="px-4 py-2 border rounded">Cancel</button>
              )}
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
                    <p className="text-sm">Featured: {p.featured ? "Yes" : "No"}</p>
                    <p className="text-sm">Visible: {p.visible ? "Yes" : "No"}</p>
                    {p.image && <img src={`http://localhost:5000${p.image}`} alt={p.title} className="mt-3 w-44 h-28 object-cover rounded border" />}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => editProject(p)} className="px-3 py-1 border rounded">Edit</button>
                    <button onClick={() => toggleProjectVisibility(p)} className="px-3 py-1 border rounded">{p.visible ? "Hide" : "Show"}</button>
                    <button onClick={() => deleteProject(p.id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-gray-500">No projects found.</p>}
          </div>
        </div>
      )}

      {/* SKILLS TAB */}
      {activeTab === TABS.SKILLS && (
        <div className="grid gap-6">
          <form onSubmit={submitSkill} className="grid gap-3 border rounded-xl p-4">
            <h2 className="text-xl font-semibold">{editingSkillId ? "Edit Skill" : "Add Skill"}</h2>
            <input className="border rounded p-2" name="name" placeholder="Skill name (React, Node.js...)" value={skillForm.name} onChange={onSkillChange} required />
            <input className="border rounded p-2" name="level" placeholder="Beginner / Intermediate / Advanced" value={skillForm.level} onChange={onSkillChange} />
            <input className="border rounded p-2" name="category" placeholder="Frontend / Backend / DevOps" value={skillForm.category} onChange={onSkillChange} />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="visible" checked={skillForm.visible} onChange={onSkillChange} />
              Visible
            </label>
            <div className="flex gap-2">
              <button className="bg-black text-white px-4 py-2 rounded" disabled={loading}>
                {loading ? "Saving..." : editingSkillId ? "Update Skill" : "Create Skill"}
              </button>
              {editingSkillId && <button type="button" onClick={resetSkillForm} className="px-4 py-2 border rounded">Cancel</button>}
            </div>
          </form>

          <div className="grid gap-3">
            {skills.map((s) => (
              <div key={s.id} className="border rounded-xl p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="text-sm text-gray-700">Level: {s.level || "-"}</p>
                  <p className="text-sm text-gray-700">Category: {s.category || "-"}</p>
                  <p className="text-sm text-gray-700">Visible: {s.visible ? "Yes" : "No"}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => editSkill(s)} className="px-3 py-1 border rounded">Edit</button>
                  <button onClick={() => toggleSkillVisibility(s)} className="px-3 py-1 border rounded">{s.visible ? "Hide" : "Show"}</button>
                  <button onClick={() => deleteSkill(s.id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
                </div>
              </div>
            ))}
            {skills.length === 0 && <p className="text-sm text-gray-500">No skills found.</p>}
          </div>
        </div>
      )}

      {/* EXPERIENCE TAB */}
      {activeTab === TABS.EXPERIENCE && (
        <div className="grid gap-6">
          <form onSubmit={submitExperience} className="grid gap-3 border rounded-xl p-4">
            <h2 className="text-xl font-semibold">{editingExperienceId ? "Edit Experience" : "Add Experience"}</h2>
            <input className="border rounded p-2" name="role" placeholder="Role" value={experienceForm.role} onChange={onExperienceChange} required />
            <input className="border rounded p-2" name="company" placeholder="Company" value={experienceForm.company} onChange={onExperienceChange} required />
            <input className="border rounded p-2" name="duration" placeholder="Jan 2025 - Jun 2025" value={experienceForm.duration} onChange={onExperienceChange} />
            <textarea className="border rounded p-2" name="description" placeholder="What you worked on..." value={experienceForm.description} onChange={onExperienceChange} />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="visible" checked={experienceForm.visible} onChange={onExperienceChange} />
              Visible
            </label>
            <div className="flex gap-2">
              <button className="bg-black text-white px-4 py-2 rounded" disabled={loading}>
                {loading ? "Saving..." : editingExperienceId ? "Update Experience" : "Create Experience"}
              </button>
              {editingExperienceId && <button type="button" onClick={resetExperienceForm} className="px-4 py-2 border rounded">Cancel</button>}
            </div>
          </form>

          <div className="grid gap-3">
            {experience.map((item) => (
              <div key={item.id} className="border rounded-xl p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{item.role} @ {item.company}</h3>
                  <p className="text-sm text-gray-700">Duration: {item.duration || "-"}</p>
                  <p className="text-sm text-gray-700 mt-1">{item.description || "-"}</p>
                  <p className="text-sm text-gray-700 mt-1">Visible: {item.visible ? "Yes" : "No"}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => editExperience(item)} className="px-3 py-1 border rounded">Edit</button>
                  <button onClick={() => toggleExperienceVisibility(item)} className="px-3 py-1 border rounded">{item.visible ? "Hide" : "Show"}</button>
                  <button onClick={() => deleteExperience(item.id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
                </div>
              </div>
            ))}
            {experience.length === 0 && <p className="text-sm text-gray-500">No experience records found.</p>}
          </div>
        </div>
      )}
    </div>
  );
}