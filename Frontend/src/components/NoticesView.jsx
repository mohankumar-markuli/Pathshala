import React, { useState } from "react";
import { Megaphone, Plus, Calendar, User } from "lucide-react";

export default function NoticesView({ notices, role, onCreateNotice }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetAudience, setTargetAudience] = useState("ALL");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateNotice({ title, body, targetAudience });
    setShowModal(false);
    setTitle("");
    setBody("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "#fff" }}>School Notices & Announcements</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Broadcast platform and institution-wide communications to parents, teachers, and students.
          </p>
        </div>

        {(role === "SUPERADMIN" || role === "SCHOOL_ADMIN" || role === "TEACHER") && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Publish Notice
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {notices && notices.length > 0 ? (
          notices.map(n => (
            <div key={n._id} className="glass-panel" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Megaphone size={20} color="var(--primary)" />
                  <h3 style={{ fontSize: "1.1rem", color: "#fff" }}>{n.title}</h3>
                </div>
                <span className="badge badge-approved">{n.targetAudience}</span>
              </div>
              <p style={{ color: "#cbd5e1", fontSize: "0.92rem", lineHeight: "1.6", margin: "12px 0" }}>
                {n.body}
              </p>
              <div style={{ display: "flex", gap: "16px", fontSize: "0.78rem", color: "var(--text-muted)", borderTop: "1px solid var(--border-color)", paddingTop: "10px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <User size={12} /> {n.authorId ? `${n.authorId.firstName} ${n.authorId.lastName || ""}` : "School Admin"}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={12} /> {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
            No notices published yet.
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h3 style={{ color: "#fff", marginBottom: "16px" }}>Publish Announcement Notice</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Notice Title</label>
                <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Science Fair Registration" required />
              </div>
              <div className="form-group">
                <label>Target Audience</label>
                <select className="form-control" value={targetAudience} onChange={e => setTargetAudience(e.target.value)}>
                  <option value="ALL">All (Parents, Teachers & Students)</option>
                  <option value="PARENTS">Parents / Guardians</option>
                  <option value="TEACHERS">Faculty Teachers</option>
                  <option value="STUDENTS">Students</option>
                </select>
              </div>
              <div className="form-group">
                <label>Announcement Body</label>
                <textarea className="form-control" rows={4} value={body} onChange={e => setBody(e.target.value)} required />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
