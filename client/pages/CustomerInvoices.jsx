import React, { useState, useEffect } from "react";
import "../app.css";

export default function CustomerInvoices({ user, setUser, setCurrentView }) {
  const [showProfile, setShowProfile] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInvoices = async (query = "") => {
    try {
      setLoading(true);
      const url = query ? `/api/invoices?search=${encodeURIComponent(query)}` : "/api/invoices";
      
      const response = await fetch(url, {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Failed to fetch invoices.");
      }

      const data = await response.json();
      setInvoices(data);
      setError("");
    } catch (err) {
      setError(err.message || "Error loading invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    fetchInvoices(val);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <h1>Enrique Mobile Mechanic</h1>
          <p>Professional Repair & Diagnostic Services</p>
        </div>

        <div className="dashboard-actions">
          <div className="profile-wrapper">
            <button
              className="profile-toggle"
              onClick={() => setShowProfile(!showProfile)}
            >
              👤 Profile
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <h3>Customer Profile</h3>
                <p>
                  <strong>Name</strong><br />
                  {user?.firstName || "Henry"} {user?.lastName || ""}
                </p>
                <p>
                  <strong>Email</strong><br />
                  {user?.email || "Not Available"}
                </p>
                <p>
                  <strong>Phone</strong><br />
                  {user?.phone || "Not Added"}
                </p>
                <button className="edit-profile-btn">
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          <button
            className="dashboard-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-container">
        <div className="vehicles-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button 
              className="action-btn" 
              style={{ width: "auto", padding: "8px 15px", background: "#6c757d" }} 
              onClick={() => setCurrentView("dashboard")}
            >
              ← Back
            </button>
            <div>
              <h2>Customer Invoices</h2>
              <p>View and settle your service invoices synced from Square.</p>
            </div>
          </div>
        </div>

        <div className="input-group" style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by invoice number or description..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {error && (
          <p className="error-message" style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        {loading ? (
          <p style={{ textAlign: "center", padding: "40px" }}>Loading your invoices...</p>
        ) : invoices.length === 0 ? (
          <div className="dashboard-card" style={{ textAlign: "center", padding: "40px" }}>
            <h3>No invoices found</h3>
            <p>You don't have any active invoices matching your search.</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {invoices.map((inv) => (
              <div className="dashboard-card" key={inv.id || inv.invoice_id}>
                <h3>📄 Invoice #{inv.invoice_number || inv.id}</h3>
                <p><strong>Amount:</strong> ${inv.amount ? inv.amount.toFixed(2) : "0.00"}</p>
                <p><strong>Status:</strong> {inv.status || "Pending"}</p>
                <p><strong>Description:</strong> {inv.description || "General Service"}</p>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button className="action-btn" style={{ flex: 1, padding: "8px", fontSize: "0.85rem" }}>
                    View Details
                  </button>
                  <button className="action-btn" style={{ flex: 1, padding: "8px", fontSize: "0.85rem", background: "var(--primary-blue)" }}>
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
