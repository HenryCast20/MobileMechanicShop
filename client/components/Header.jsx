import React, { useState } from "react";
import { logoutUser } from "../services/authservice";

export default function Header({ user, setUser }) {
  const [showProfile, setShowProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [pFirst, setPFirst] = useState("");
  const [pLast, setPLast] = useState("");
  const [pPhone, setPPhone] = useState("");
  const [pEmail, setPEmail] = useState("");
  const [profileError, setProfileError] = useState("");

 const handleLogout = async () => {
  try {
    await logoutUser();
  } catch (err) {
    console.error(err);
  }
  if (window.google?.accounts?.id) {
    window.google.accounts.id.disableAutoSelect();
  }
  setUser(null);
};

  const openProfileEdit = () => {
    setPFirst(user?.firstName || "");
    setPLast(user?.lastName || "");
    setPPhone(user?.phone || "");
    setPEmail(user?.email || "");
    setProfileError("");
    setShowProfile(false);
    setEditingProfile(true);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName: pFirst,
          lastName: pLast,
          phoneNumber: pPhone,
          email: pEmail
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update profile.");

      const updated = { ...user, ...data.user };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setEditingProfile(false);
    } catch (err) {
      setProfileError(err.message);
    }
  };

  return (
    <>
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <h1>Enrique Mobile Mechanic</h1>
          <p>Professional Repair &amp; Diagnostic Services</p>
        </div>

        <div className="dashboard-actions">
          <div className="profile-wrapper">
            <button className="profile-toggle" onClick={() => setShowProfile(!showProfile)}>
              👤 Profile
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <h3>Customer Profile</h3>
                <p><strong>Name</strong><br />{user?.firstName} {user?.lastName}</p>
                <p><strong>Email</strong><br />{user?.email || "Not Available"}</p>
                <p><strong>Phone</strong><br />{user?.phone || "Not Added"}</p>
                <button className="edit-profile-btn" onClick={openProfileEdit}>
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          <button className="dashboard-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {editingProfile && (
        <div className="modal-backdrop" onClick={() => setEditingProfile(false)}>
          <div className="terminal-card" onClick={(e) => e.stopPropagation()}
            style={{ width: "400px", maxWidth: "90%", padding: "30px" }}>
            <h3>Edit Profile</h3>
            {profileError && (
              <p style={{ color: "#d90429", marginBottom: "15px", fontWeight: "bold", fontSize: "0.9rem" }}>
                {profileError}
              </p>
            )}
            <form onSubmit={handleProfileSave}>
              <div className="input-group">
                <label>First Name</label>
                <input required value={pFirst} onChange={(e) => setPFirst(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input required value={pLast} onChange={(e) => setPLast(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Phone</label>
                <input value={pPhone} onChange={(e) => setPPhone(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={pEmail} onChange={(e) => setPEmail(e.target.value)} />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button type="submit" className="action-btn">Save</button>
                <button type="button" className="action-btn" style={{ background: "#6c757d" }}
                  onClick={() => setEditingProfile(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
