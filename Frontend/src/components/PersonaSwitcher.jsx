import React from "react";
import { Shield, Building, UserCheck, GraduationCap, Users, User, RefreshCw } from "lucide-react";

export const DEMO_PERSONAS = [
  {
    role: "SUPERADMIN",
    label: "Platform Admin",
    email: "superadmin@pathshala.io",
    icon: Shield,
    desc: "Approve schools, platform metrics"
  },
  {
    role: "SCHOOL_OWNER",
    label: "School Owner",
    email: "owner@greenwood.edu",
    icon: Building,
    desc: "Multi-school dashboard"
  },
  {
    role: "SCHOOL_ADMIN",
    label: "Principal / Admin",
    email: "principal@greenwood.edu",
    icon: UserCheck,
    desc: "Staff, classes & timetables"
  },
  {
    role: "TEACHER",
    label: "Teacher",
    email: "ravi.maths@greenwood.edu",
    icon: GraduationCap,
    desc: "My subjects & schedule"
  },
  {
    role: "GUARDIAN",
    label: "Guardian (Parent)",
    email: "parent.arjun@gmail.com",
    icon: Users,
    desc: "Child profile & notices"
  }
];

export default function PersonaSwitcher({ activeRole, onSwitchPersona, onResetSeed }) {
  return (
    <div className="persona-bar">
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Shield size={16} color="#8b5cf6" />
        <span style={{ fontWeight: 600, color: "#cbd5e1" }}>Interactive Demo Persona Switcher:</span>
      </div>

      <div className="persona-selector">
        {DEMO_PERSONAS.map(p => {
          const Icon = p.icon;
          const isActive = activeRole === p.role;
          return (
            <button
              key={p.role}
              className={`persona-btn ${isActive ? "active" : ""}`}
              onClick={() => onSwitchPersona(p)}
              title={p.desc}
            >
              <Icon size={14} />
              {p.label}
            </button>
          );
        })}
      </div>

      <button
        className="persona-btn"
        style={{ borderColor: "rgba(239, 68, 68, 0.4)", color: "#f87171" }}
        onClick={onResetSeed}
        title="Reset & seed demo database records"
      >
        <RefreshCw size={12} />
        Reset Demo DB
      </button>
    </div>
  );
}
