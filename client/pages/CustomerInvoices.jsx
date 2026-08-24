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
          <p>Professional Repair and Diagnostic Services</p>
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
            <p>View your past repairs and invoices.</p>
          </div>
        </div>

        <div className="input-group" style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by invoice number, service, or vehicle"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <p className="error-message" style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        {loading ? (
          <p style={{ textAlign: "center", padding: "40px" }}>Loading your invoices...</p>
        ) : filtered.length === 0 ? (
          <div className="dashboard-card" style={{ textAlign: "center", padding: "40px" }}>
            <h3>No invoices found</h3>
            <p>Nothing here yet.</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {filtered.map((r) => (
              <div className="dashboard-card invoice-list-card" key={r.repair_id}>
                <h3>Invoice #{r.repair_id}</h3>
                <p><strong>Vehicle:</strong> {r.year_produced} {r.make} {r.model}</p>
                <p><strong>Date:</strong> {r.service_date ? new Date(r.service_date).toLocaleDateString() : "-"}</p>
                <p><strong>Service:</strong> {r.category || "General service"}</p>
                <p><strong>Total:</strong> ${money(r.total)}</p>
                <p><strong>Status:</strong> {r.payment_status}</p>
                <button
                  className="action-btn"
                  style={{ width: "100%", padding: "8px", fontSize: "0.85rem", marginTop: "15px" }}
                  onClick={() => openInvoice(r.repair_id)}
                >
                  View invoice
                </button>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="invoice-overlay" onClick={() => setSelected(null)}>
            <div className="invoice-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="invoice-head">
                <div>
                  <h2>Enrique Mobile Mechanic</h2>
                  <p>Orlando, FL</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <h3>Invoice #{selected.repair_id}</h3>
                  <p>{selected.service_date ? new Date(selected.service_date).toLocaleDateString() : ""}</p>
                </div>
              </div>

              <div className="invoice-meta">
                <p><strong>Customer:</strong> {user?.firstName} {user?.lastName}</p>
                <p><strong>Vehicle:</strong> {selected.year_produced} {selected.make} {selected.model}</p>
                <p><strong>Plate:</strong> {selected.license_plate || "-"}</p>
                <p><strong>Odometer:</strong> {selected.odometer_cur ?? "-"}</p>
              </div>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.items && selected.items.length > 0 ? (
                    selected.items.map((it) => (
                      <tr key={it.item_id}>
                        <td>{it.description}</td>
                        <td>{it.item_type}</td>
                        <td>{Number(it.quantity)}</td>
                        <td>${money(it.unit_price)}</td>
                        <td>${money(it.quantity * it.unit_price)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">{selected.category || "Service"}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="invoice-total">
                <strong>Total: ${money(selected.total)}</strong>
                <p>Status: {selected.payment_status}</p>
              </div>

              {selected.mechanic_comments && (
                <div className="invoice-notes">
                  <strong>Technician notes</strong>
                  <p>{selected.mechanic_comments}</p>
                </div>
              )}

              <div className="invoice-actions">
                <button className="action-btn" onClick={() => window.print()}>Print</button>
                <button className="action-btn" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
