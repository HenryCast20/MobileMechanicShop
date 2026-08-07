import React, { useState } from "react";
import "../app.css";

export default function CustomerInvoices({ user, setUser, setCurrentView }) {
  const [email, setEmail] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/customer-invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch invoices.");
      }

      const data = await response.json();
      // Handle whether backend returns an array directly or nested in an object
      setInvoices(Array.isArray(data) ? data : data.invoices || []);
      setSearched(true);
    } catch (err) {
      console.error(err);
      setError("Error fetching invoices");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
      <button 
        type="button"
        onClick={() => setCurrentView("dashboard")} 
        style={{ marginBottom: "20px", width: "auto", padding: "10px 20px" }}
        className="action-btn"
      >
        ← Back to Dashboard
      </button>

      <div className="invoice-container">
        <h2>Your Service Invoices</h2>
        <form onSubmit={handleLookup}>
          <input
            type="email"
            placeholder="Enter your email to check bills..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "View My Invoices"}
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        {searched && (
          <div className="invoice-results" style={{ marginTop: "20px" }}>
            {invoices.length === 0 ? (
              <p>No invoices found for this email address.</p>
            ) : (
              invoices.map((inv) => {
                const amountDue = inv.primaryPaymentRequest?.computedAmountMoney?.amount || 0;
                const isPaid = inv.status === "PAID";

                return (
                  <div key={inv.id || inv.invoiceNumber} className={`invoice-card ${isPaid ? "paid" : "unpaid"}`} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px", borderRadius: "6px" }}>
                    <p><strong>Invoice #:</strong> {inv.invoiceNumber || "Draft"}</p>
                    <p><strong>Status:</strong> {inv.status}</p>
                    <p><strong>Total:</strong> ${(amountDue / 100).toFixed(2)}</p>
                    
                    {!isPaid && inv.publicUrl && (
                      <a 
                        href={inv.publicUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="pay-btn"
                      >
                        Pay Online Now
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
