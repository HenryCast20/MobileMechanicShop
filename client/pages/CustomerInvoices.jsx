import React, { useState } from "react";
import axios from "axios";
import "../app.css";

export default function CustomerInvoices({ setCurrentView }) {
  const [email, setEmail] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/customer-invoices", { email });
      setInvoices(response.data.invoices);
      setSearched(true);
    } catch (err) {
      console.error(err);
      alert("Error fetching invoices");
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

        {searched && (
          <div className="invoice-results">
            {invoices.length === 0 ? (
              <p>No invoices found for this email address.</p>
            ) : (
              invoices.map((inv) => {
                const amountDue = inv.primaryPaymentRequest?.computedAmountMoney?.amount || 0;
                const isPaid = inv.status === "PAID";

                return (
                  <div key={inv.id} className={`invoice-card ${isPaid ? "paid" : "unpaid"}`}>
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
