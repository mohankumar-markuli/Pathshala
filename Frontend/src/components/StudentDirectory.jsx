import React, { useState } from "react";
import { GraduationCap, Plus, UserCheck, Phone, Mail, HeartHandshake } from "lucide-react";

export default function StudentDirectory({ students, classes, role, onEnrollStudent, onUpdateStatus }) {
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [classId, setClassId] = useState(classes && classes.length > 0 ? classes[0]._id : "");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [relation, setRelation] = useState("father");

  const handleSubmit = (e) => {
    e.preventDefault();
    onEnrollStudent({
      firstName,
      lastName,
      admissionNo,
      classId,
      guardianName,
      guardianPhone,
      guardianEmail,
      relation
    });
    setShowModal(false);
    setFirstName("");
    setLastName("");
    setAdmissionNo("");
    setGuardianName("");
    setGuardianPhone("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "#fff" }}>Student & Guardian Directory</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Student lifecycle tracking, guardian contacts, and status transitions (Active/Alumni).
          </p>
        </div>

        {(role === "SUPERADMIN" || role === "SCHOOL_ADMIN") && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Enroll New Student
          </button>
        )}
      </div>

      <div className="glass-panel table-container">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Admission No</th>
              <th>Class & Section</th>
              <th>Guardian Contact</th>
              <th>Status</th>
              {(role === "SUPERADMIN" || role === "SCHOOL_ADMIN") && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {students && students.length > 0 ? (
              students.map(s => {
                const primaryGuardian = s.guardians && s.guardians.length > 0 ? s.guardians[0] : null;
                return (
                  <tr key={s._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "#fff" }}>{s.firstName} {s.lastName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Gender: {s.gender || "N/A"} | Blood: {s.bloodGroup || "O+"}</div>
                    </td>
                    <td><code style={{ background: "rgba(255,255,255,0.06)", padding: "4px 8px", borderRadius: 4 }}>{s.admissionNo}</code></td>
                    <td>{s.classId ? `${s.classId.name} (${s.classId.section})` : "Unassigned"}</td>
                    <td>
                      {primaryGuardian ? (
                        <div>
                          <div style={{ fontWeight: 500, color: "#cbd5e1" }}>{primaryGuardian.name} ({primaryGuardian.relation})</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                            <Phone size={12} /> {primaryGuardian.phone}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-dim)" }}>No guardian info</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${s.status}`}>
                        {s.status}
                      </span>
                    </td>
                    {(role === "SUPERADMIN" || role === "SCHOOL_ADMIN") && (
                      <td>
                        {s.status === "active" && (
                          <button
                            className="btn btn-secondary"
                            style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                            onClick={() => onUpdateStatus(s._id, "alumni")}
                          >
                            Mark Alumni
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                  No students enrolled yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: "600px" }}>
            <h3 style={{ color: "#fff", marginBottom: "16px" }}>Enroll New Student</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label>First Name</label>
                  <input className="form-control" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input className="form-control" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label>Admission Number (Manual ID)</label>
                  <input className="form-control" value={admissionNo} onChange={e => setAdmissionNo(e.target.value)} placeholder="ADM-2025-502" required />
                </div>
                <div className="form-group">
                  <label>Class & Section</label>
                  <select className="form-control" value={classId} onChange={e => setClassId(e.target.value)}>
                    {classes.map(c => <option key={c._id} value={c._id}>{c.name} - Section {c.section}</option>)}
                  </select>
                </div>
              </div>

              <hr style={{ borderColor: "var(--border-color)", margin: "16px 0" }} />
              <h4 style={{ fontSize: "0.9rem", color: "var(--primary)", marginBottom: "12px" }}>Guardian Details (Embedded)</h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label>Guardian Name</label>
                  <input className="form-control" value={guardianName} onChange={e => setGuardianName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Guardian Phone</label>
                  <input className="form-control" value={guardianPhone} onChange={e => setGuardianPhone(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label>Guardian Email</label>
                  <input className="form-control" type="email" value={guardianEmail} onChange={e => setGuardianEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Relation</label>
                  <select className="form-control" value={relation} onChange={e => setRelation(e.target.value)}>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Legal Guardian</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Complete Enrollment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
