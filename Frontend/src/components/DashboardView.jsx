import React from "react";
import { Building2, Users, GraduationCap, Calendar, ShieldAlert, CheckCircle2, Award, Clock } from "lucide-react";

export default function DashboardView({ analytics, role, onNavigateTab }) {
  if (!analytics) {
    return <div className="glass-panel" style={{ padding: "24px" }}>Loading platform analytics...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div>
        <h1 style={{ fontSize: "1.8rem", color: "#fff", marginBottom: "6px" }}>
          Welcome back to Pathshala
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          White-label multi-tenant institution management overview for {role} persona.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {role === "SUPERADMIN" && (
          <>
            <div className="glass-panel stat-card">
              <div className="stat-icon"><Building2 size={24} /></div>
              <div>
                <div className="stat-value">{analytics.totalSchools || 0}</div>
                <div className="stat-label">Total Platform Schools</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
                <Clock size={24} />
              </div>
              <div>
                <div className="stat-value">{analytics.pendingSchools || 0}</div>
                <div className="stat-label">Pending Approval Requests</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div className="stat-value">{analytics.approvedSchools || 0}</div>
                <div className="stat-label">Active Approved Schools</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon"><Users size={24} /></div>
              <div>
                <div className="stat-value">{analytics.totalStudents || 0}</div>
                <div className="stat-label">Total Enrolled Students</div>
              </div>
            </div>
          </>
        )}

        {role === "SCHOOL_OWNER" && (
          <>
            <div className="glass-panel stat-card">
              <div className="stat-icon"><Building2 size={24} /></div>
              <div>
                <div className="stat-value">{analytics.ownedSchoolsCount || 0}</div>
                <div className="stat-label">My Owned Institutions</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon"><GraduationCap size={24} /></div>
              <div>
                <div className="stat-value">{analytics.totalStudents || 0}</div>
                <div className="stat-label">Total Active Students</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon"><Users size={24} /></div>
              <div>
                <div className="stat-value">{analytics.totalEmployees || 0}</div>
                <div className="stat-label">Staff & Teachers</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon"><Calendar size={24} /></div>
              <div>
                <div className="stat-value">{analytics.totalClasses || 0}</div>
                <div className="stat-label">Configured Classes</div>
              </div>
            </div>
          </>
        )}

        {(role === "SCHOOL_ADMIN" || role === "TEACHER") && (
          <>
            <div className="glass-panel stat-card">
              <div className="stat-icon"><GraduationCap size={24} /></div>
              <div>
                <div className="stat-value">{analytics.totalStudents || 0}</div>
                <div className="stat-label">Enrolled Students</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon"><Calendar size={24} /></div>
              <div>
                <div className="stat-value">{analytics.totalClasses || 0}</div>
                <div className="stat-label">Classes & Sections</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon"><Users size={24} /></div>
              <div>
                <div className="stat-value">{analytics.totalTeachers || 0}</div>
                <div className="stat-label">Faculty Teachers</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171" }}>
                <ShieldAlert size={24} />
              </div>
              <div>
                <div className="stat-value">{analytics.openGrievances || 0}</div>
                <div className="stat-label">Open Safety Tickets</div>
              </div>
            </div>
          </>
        )}

        {role === "GUARDIAN" && (
          <>
            <div className="glass-panel stat-card">
              <div className="stat-icon"><Users size={24} /></div>
              <div>
                <div className="stat-value">{analytics.childrenCount || 0}</div>
                <div className="stat-label">Linked Children</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
                <Award size={24} />
              </div>
              <div>
                <div className="stat-value">100%</div>
                <div className="stat-label">Attendance Record</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Overview Panels */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", color: "#fff" }}>
            Operational Highlights & Workflows
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Multi-Tenant Architecture</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Strict schoolId data isolation enforced on all collections</div>
              </div>
              <span className="badge badge-approved">Active</span>
            </div>
            <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Anonymous Grievance Safety Box</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Strictly user-decoupled anonymous reporting for student safety</div>
              </div>
              <span className="badge badge-approved">Enabled</span>
            </div>
            <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Cross-School Identity (personId)</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Preserves academic history across school transfers</div>
              </div>
              <span className="badge badge-approved">Configured</span>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", color: "#fff" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {role === "SUPERADMIN" && (
              <button className="btn btn-primary" onClick={() => onNavigateTab("schools")}>
                Review Pending School Approvals
              </button>
            )}
            {(role === "SCHOOL_ADMIN" || role === "TEACHER") && (
              <>
                <button className="btn btn-primary" onClick={() => onNavigateTab("timetable")}>
                  Manage Class Timetable
                </button>
                <button className="btn btn-secondary" onClick={() => onNavigateTab("students")}>
                  Enroll New Student
                </button>
              </>
            )}
            {role === "GUARDIAN" && (
              <button className="btn btn-primary" onClick={() => onNavigateTab("timetable")}>
                View Child Timetable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
