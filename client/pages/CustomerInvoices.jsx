import React, { useState, useEffect } from "react";
import { logoutUser } from "../services/authservice";
import "../app.css";

export default function CustomerInvoices({ user, setUser, setCurrentView }) {
  const [showProfile, setShowProfile] = useState(false);
  const [repairs, setRepairs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const response = await fetch("/api/repairs", { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch invoices.");
        setRepairs(await response.json());
        setError("");
      } catch (err) {
        setError(err.message || "Error loading invoices.");
      } finally {
        setLoading(false);
      }
    };
    fetchRepairs();
  }, []);

  const openInvoice = async (repairId) => {
    try {
      const response = await fetch(`/api/repairs/${repairId}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load invoice.");
      setSelected(await response.json());
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
  try {
    await logoutUser();
  } catch (err) {
    console.error(err);
  }
  setUser(null);
};

  const money = (v) => Number(v || 0).toFixed(2);

  const filtered = repairs.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      String(r.repair_id).includes(term) ||
      (r.category || "").toLowerCase().includes(term) ||
      `${r.make} ${r.model}`.toLowerCase().includes(term)
    );
  });

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <h1>Enrique Mobile Mechanic</h1>
          <p>Professional Repair &amp; Diagnostic Services</p>
        </div>

        <div className="dashboard-actions">
          <div className="profile-wrapper">
            <button className="profile-toggle" onClick={() => setShowProfile(!showProfile)}>
              Profile
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <h3>Customer Profile</h3>
                <p><strong>Name</strong><br />{user?.firstName} {user?.lastName}</p>
                <p><strong>Email</strong><br />{user?.email || "Not available"}</p>
                <p><strong>Phone</strong><br />{user?.phone || "Not added"}</p>
                <button className="edit-profile-btn">Edit profile</button>
              </div>
            )}
          </div>

          <button className="dashboard-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-container">
        <div className="vehicles-header-row" style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
          <button
            className="action-btn"
            style={{ width: "auto", padding: "8px 15px", background: "#6c757d" }}
            onClick={() => setCurrentView("dashboard")}
          >
            Back
          </button>
          <div>
            <h2>Service history</h2>
            <p>View your
