import React from "react";
import { LayoutDashboard, Building2, Calendar, GraduationCap, Megaphone, ShieldAlert, Users } from "lucide-react";

export default function Sidebar({ activeTab, onSelectTab, role }) {
  const getNavItems = () => {
    switch (role) {
      case "SUPERADMIN":
        return [
          { id: "overview", label: "System Analytics", icon: LayoutDashboard },
          { id: "schools", label: "School Approvals", icon: Building2 },
          { id: "notices", label: "Platform Notices", icon: Megaphone }
        ];
      case "SCHOOL_OWNER":
        return [
          { id: "overview", label: "Multi-School Overview", icon: LayoutDashboard },
          { id: "schools", label: "My Schools Directory", icon: Building2 },
          { id: "students", label: "Students Directory", icon: GraduationCap },
          { id: "notices", label: "Announcements", icon: Megaphone }
        ];
      case "TEACHER":
        return [
          { id: "overview", label: "Teacher Dashboard", icon: LayoutDashboard },
          { id: "timetable", label: "My Weekly Schedule", icon: Calendar },
          { id: "students", label: "Class Roster", icon: GraduationCap },
          { id: "notices", label: "School Notices", icon: Megaphone }
        ];
      case "GUARDIAN":
        return [
          { id: "overview", label: "Parent Dashboard", icon: LayoutDashboard },
          { id: "timetable", label: "Child Timetable", icon: Calendar },
          { id: "notices", label: "School Notices", icon: Megaphone }
        ];
      case "SCHOOL_ADMIN":
      default:
        return [
          { id: "overview", label: "Overview", icon: LayoutDashboard },
          { id: "schools", label: "School Profile", icon: Building2 },
          { id: "timetable", label: "Class & Timetables", icon: Calendar },
          { id: "students", label: "Student & Guardian", icon: GraduationCap },
          { id: "notices", label: "Announcements", icon: Megaphone },
          { id: "grievances", label: "Safety & Grievance Box", icon: ShieldAlert }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="sidebar">
      <div>
        <div className="nav-section-title">Navigation</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => onSelectTab(item.id)}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
