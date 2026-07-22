import React from "react";
import { School, LogOut, Bell, ShieldCheck } from "lucide-react";

export default function Navbar({ currentUser, activeSchool }) {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, padding: "14px 28px", borderTop: "none", borderLeft: "none", borderRight: "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(99,102,241,0.4)" }}>
          <School size={22} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: "1.25rem", color: "#fff" }}>
            {activeSchool ? activeSchool.name : "Pathshala White-Label Platform"}
          </h2>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            {activeSchool ? `Tenant Code: ${activeSchool.code} | ${activeSchool.board}` : "Multi-Tenant School Management Platform"}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ position: "relative", cursor: "pointer" }}>
          <Bell size={20} color="var(--text-muted)" />
          <span style={{ position: "absolute", top: -4, right: -4, width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }}></span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", borderLeft: "1px solid var(--border-color)", paddingLeft: "16px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName || ""}` : "Guest User"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--accent)" }}>
              {currentUser ? currentUser.role : "SUPERADMIN"}
            </div>
          </div>

          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--primary-light)", border: "1px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--primary)" }}>
            {currentUser ? currentUser.firstName[0] : "P"}
          </div>
        </div>
      </div>
    </header>
  );
}
