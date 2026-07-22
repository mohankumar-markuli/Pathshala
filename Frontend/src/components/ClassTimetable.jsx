import React, { useState } from "react";
import { Calendar, User, BookOpen, Clock, Plus } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIODS = [1, 2, 3, 4, 5, 6];

export default function ClassTimetable({ classes, role, onAssignSubject, onUpdateTimetable }) {
  const [selectedClassId, setSelectedClassId] = useState(classes && classes.length > 0 ? classes[0]._id : "");
  const activeClass = classes ? classes.find(c => c._id === selectedClassId) || classes[0] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "#fff" }}>Class & Timetable Planner</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Manage homeroom teachers, subject allocations, and weekly period timetables.
          </p>
        </div>

        {classes && classes.length > 0 && (
          <select
            className="form-control"
            style={{ width: "220px" }}
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
          >
            {classes.map(c => (
              <option key={c._id} value={c._id}>{c.name} - Section {c.section}</option>
            ))}
          </select>
        )}
      </div>

      {activeClass ? (
        <>
          {/* Class Summary Banner */}
          <div className="glass-panel" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "1.3rem", color: "#fff" }}>{activeClass.name} (Section {activeClass.section})</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Academic Year: {activeClass.academicYear} | Capacity: {activeClass.capacity} Students
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ padding: "8px 16px", background: "var(--primary-light)", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block" }}>Homeroom Teacher</span>
                <span style={{ fontWeight: 600, color: "var(--primary)" }}>
                  {activeClass.homeroomTeacherId ? `${activeClass.homeroomTeacherId.firstName} ${activeClass.homeroomTeacherId.lastName || ""}` : "Unassigned"}
                </span>
              </div>
            </div>
          </div>

          {/* Subject Assignments */}
          <div className="glass-panel" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: "1.05rem", color: "#fff", marginBottom: "16px" }}>Assigned Faculty Subjects</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
              {activeClass.subjects && activeClass.subjects.length > 0 ? (
                activeClass.subjects.map((sub, i) => (
                  <div key={i} style={{ padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <div style={{ fontWeight: 600, color: "#fff", fontSize: "0.9rem" }}>{sub.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <User size={14} /> {sub.teacherId ? `${sub.teacherId.firstName} ${sub.teacherId.lastName || ""}` : "No teacher assigned"}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: "var(--text-muted)" }}>No subjects configured yet.</div>
              )}
            </div>
          </div>

          {/* Timetable Weekly Grid */}
          <div className="glass-panel" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: "1.05rem", color: "#fff", marginBottom: "16px" }}>Weekly Class Timetable Schedule</h3>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Day</th>
                    {PERIODS.map(p => <th key={p} style={{ textAlign: "center" }}>Period {p}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map(day => (
                    <tr key={day}>
                      <td style={{ fontWeight: 600, color: "var(--primary)" }}>{day}</td>
                      {PERIODS.map(period => {
                        const slot = activeClass.timetable ? activeClass.timetable.find(t => t.day === day && t.period === period) : null;
                        return (
                          <td key={period} style={{ textAlign: "center", background: slot ? "rgba(99,102,241,0.08)" : "transparent" }}>
                            {slot ? (
                              <div>
                                <div style={{ fontWeight: 600, color: "#fff", fontSize: "0.85rem" }}>{slot.subject}</div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{slot.startTime} - {slot.endTime}</div>
                              </div>
                            ) : (
                              <span style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>- Free -</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-panel" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
          No classes registered for this institution yet.
        </div>
      )}
    </div>
  );
}
