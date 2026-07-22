import React, { useState } from "react";
import { ShieldAlert, Plus, CheckCircle, AlertTriangle, Lock } from "lucide-react";

export default function GrievanceBox({ grievances, role, onSubmitGrievance, onUpdateStatus }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("SAFETY");
  const [priority, setPriority] = useState("MEDIUM");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitGrievance({ title, description, category, priority });
    setShowModal(false);
    setTitle("");
    setDescription("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "#fff" }}>Anonymous Safety & Grievance Box</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Strictly anonymous issue reporting box. User ID is never tracked or stored for submitters.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Submit Anonymous Report
        </button>
      </div>

      <div className="glass-panel" style={{ padding: "16px", background: "rgba(139, 92, 246, 0.08)", border: "1px solid rgba(139, 92, 246, 0.3)", display: "flex", alignItems: "center", gap: "12px" }}>
        <Lock size={20} color="var(--accent)" />
        <div style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
          <strong>Privacy Guarantee:</strong> Submitted grievances intentional omit student/user references to ensure ragging, harassment, or facility reports remain 100% confidential.
        </div>
      </div>

      <div className="glass-panel table-container">
        <table>
          <thead>
            <tr>
              <th>Ticket Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date Submitted</th>
              {(role === "SUPERADMIN" || role === "SCHOOL_ADMIN") && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {grievances && grievances.length > 0 ? (
              grievances.map(g => (
                <tr key={g._id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "#fff" }}>{g.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>{g.description}</div>
                  </td>
                  <td><span className="badge" style={{ background: "rgba(255,255,255,0.06)", color: "#fff" }}>{g.category}</span></td>
                  <td>
                    <span className={`badge badge-${g.priority}`}>
                      {g.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${g.status}`}>
                      {g.status}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {new Date(g.createdAt).toLocaleDateString()}
                  </td>
                  {(role === "SUPERADMIN" || role === "SCHOOL_ADMIN") && (
                    <td>
                      {g.status === "OPEN" ? (
                        <button
                          className="btn btn-primary"
                          style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                          onClick={() => onUpdateStatus(g._id, "RESOLVED")}
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <span style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>Resolved</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                  No grievances reported.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h3 style={{ color: "#fff", marginBottom: "16px" }}>Submit Anonymous Report</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Incident / Concern Title</label>
                <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Water dispenser leaking on 2nd floor" required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="RAGGING">Ragging</option>
                    <option value="BULLYING">Bullying</option>
                    <option value="HARASSMENT">Harassment</option>
                    <option value="FACILITY_ISSUE">Facility Issue</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select className="form-control" value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Detailed Description</label>
                <textarea className="form-control" rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Provide location and details of the incident..." required />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Anonymously</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
