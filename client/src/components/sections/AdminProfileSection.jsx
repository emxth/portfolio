import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toAssetUrl } from "../../api/url";

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

export default function AdminProfileSection() {
  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchProfile();
  }, []);

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
    <div className="grid gap-6">
      <form onSubmit={saveProfile} className="grid gap-3 p-4 border rounded-xl">
        <h2 className="text-xl font-semibold">Profile Settings</h2>

        <input className="p-2 border rounded" name="name" placeholder="Name" value={profileForm.name} onChange={onProfileChange} />
        <input className="p-2 border rounded" name="role" placeholder="Role" value={profileForm.role} onChange={onProfileChange} />
        <input className="p-2 border rounded" name="intro" placeholder="Short intro" value={profileForm.intro} onChange={onProfileChange} />
        <textarea className="p-2 border rounded" name="about" placeholder="About me..." rows={5} value={profileForm.about} onChange={onProfileChange} />
        <input className="p-2 border rounded" name="linkedin" placeholder="LinkedIn URL" value={profileForm.linkedin} onChange={onProfileChange} />
        <input className="p-2 border rounded" name="github" placeholder="GitHub URL" value={profileForm.github} onChange={onProfileChange} />
        <input className="p-2 border rounded" name="contactNo" placeholder="Contact number" value={profileForm.contactNo} onChange={onProfileChange} />
        <input className="p-2 border rounded" name="email" placeholder="Email" value={profileForm.email} onChange={onProfileChange} />

        <div className="flex gap-2">
          <button className="px-4 py-2 text-white bg-black rounded" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>

      <form onSubmit={uploadCv} className="grid gap-3 p-4 border rounded-xl">
        <h3 className="text-lg font-semibold">Upload CV (PDF / DOC / DOCX)</h3>

        <input
          className="p-2 border rounded"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
        />

        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2 text-white bg-black rounded" disabled={loading}>
            {loading ? "Uploading..." : "Upload CV"}
          </button>

          {profileForm.cvUrl ? (
            <a href={toAssetUrl(profileForm.cvUrl)} target="_blank" rel="noreferrer" className="px-4 py-2 border rounded">
              View Current CV
            </a>
          ) : (
            <span className="text-sm text-gray-500">No CV uploaded yet.</span>
          )}
        </div>
      </form>
    </div>
  );
}