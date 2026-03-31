import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import AdminProjectsSection from "../components/sections/AdminProjectsSection";
import AdminSkillsSection from "../components/sections/AdminSkillsSection";
import AdminExperienceSection from "../components/sections/AdminExperienceSection";
import AdminProfileSection from "../components/sections/AdminProfileSection";

const TABS = {
  PROJECTS: "projects",
  SKILLS: "skills",
  EXPERIENCE: "experience",
  PROFILE: "profile",
};

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState(TABS.PROJECTS);

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Hi, {user?.username}</span>
          <button onClick={logout} className="px-4 py-2 border rounded">Logout</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setActiveTab(TABS.PROJECTS)} className={`px-4 py-2 rounded border ${activeTab === TABS.PROJECTS ? "bg-black text-white" : ""}`}>Projects</button>
        <button onClick={() => setActiveTab(TABS.SKILLS)} className={`px-4 py-2 rounded border ${activeTab === TABS.SKILLS ? "bg-black text-white" : ""}`}>Skills</button>
        <button onClick={() => setActiveTab(TABS.EXPERIENCE)} className={`px-4 py-2 rounded border ${activeTab === TABS.EXPERIENCE ? "bg-black text-white" : ""}`}>Experience</button>
        <button onClick={() => setActiveTab(TABS.PROFILE)} className={`px-4 py-2 rounded border ${activeTab === TABS.PROFILE ? "bg-black text-white" : ""}`}>Profile & CV</button>
      </div>

      {activeTab === TABS.PROJECTS && <AdminProjectsSection />}
      {activeTab === TABS.SKILLS && <AdminSkillsSection />}
      {activeTab === TABS.EXPERIENCE && <AdminExperienceSection />}
      {activeTab === TABS.PROFILE && <AdminProfileSection />}
    </div>
  );
}