import React, { useState } from "react";
import { Building2, Plus, Check, X, Shield, MapPin } from "lucide-react";

export default function SchoolManager({ schools, role, onApproveSchool, onCreateSchool }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [board, setBoard] = useState("CBSE");
  const [city, setCity] = useState("Bengaluru");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateSchool({ name, code, board, city });
    setShowModal(false);
    setName("");
    setCode("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "#fff" }}>Institution & School Management</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            White-label multi-tenant institution onboarding and approval workflow.
          </p>
        </div>

        {(role === "SUPERADMIN" || role === "SCHOOL_OWNER") && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Register New School
          </button>
        )}
      </div>

      <div className="glass-panel table-container">
        <table>
          <thead>
            <tr>
              <th>School Name</th>
              <th>Tenant Code</th>
              <th>Education Board</th>
              <th>City</th>
              <th>Approval Status</th>
              {role === "SUPERADMIN" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {schools && schools.length > 0 ? (
              schools.map(s => (
                <tr key={s._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img src={s.logoUrl} alt="Logo" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
                      <span style={{ fontWeight: 600, color: "#fff" }}>{s.name}</span>
                    </div>
                  </td>
                  <td><code style={{ background: "rgba(255,255,255,0.06)", padding: "4px 8px", borderRadius: 4 }}>{s.code}</code></td>
                  <td>{s.board || "CBSE"}</td>
                  <td>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)" }}>
                      <MapPin size={14} /> {s.city || "Bengaluru"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${s.approvalStatus}`}>
                      {s.approvalStatus}
                    </span>
                  </td>
                  {role === "SUPERADMIN" && (
                    <td>
                      {s.approvalStatus === "pending" ? (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            className="btn btn-primary"
                            style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                            onClick={() => onApproveSchool(s._id, "approved")}
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: "4px 10px", fontSize: "0.78rem", color: "#f87171" }}
                            onClick={() => onApproveSchool(s._id, "rejected")}
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>Reviewed</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === "SUPERADMIN" ? 6 : 5} style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                  No schools registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h3 style={{ color: "#fff", marginBottom: "16px" }}>Register New School Instance</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Institution Name</label>
                <input className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Greenwood High" required />
              </div>
              <div className="form-group">
                <label>School Short Code (Tenant Identifier)</label>
                <input className="form-control" value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. PSH-BLR-03" required />
              </div>
              <div className="form-group">
                <label>Education Board</label>
                <select className="form-control" value={board} onChange={e => setBoard(e.target.value)}>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                  <option value="IB">IB</option>
                </select>
              </div>
              <div className="form-group">
                <label>City</label>
                <input className="form-control" value={city} onChange={e => setCity(e.target.value)} placeholder="Bengaluru" required />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
