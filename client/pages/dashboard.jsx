import React, { useState } from "react";
import "../app.css";

export default function Dashboard({ user, setUser ,setCurrentView}){
  const [showProfile, setShowProfile] = useState(false);


  const handleLogout = () => {
  localStorage.removeItem("token");
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

        <section className="dashboard-welcome">

          <h2>
            Welcome back, {user?.firstName || "Henry"}
          </h2>

          <p>
            Manage your vehicles, appointments, services, and invoices.
          </p>

        </section>

        <section className="dashboard-grid">

          <div className="dashboard-card">
            <h3>📅 Appointments</h3>
            <p>View upcoming visits and scheduled repairs.</p>
            <button>View Appointments</button>
          </div>

          <div className="dashboard-card">
            <h3>🔧 Services</h3>
            <p>Review completed repairs and service history.</p>
            <button>View Services</button>
          </div>

          <div className="dashboard-card">
            <h3>🚗 My Vehicles</h3>
            <p>Manage your vehicles and maintenance records.</p>
            <button onClick={() => setCurrentView("myVehicles")}>Manage Vehicles</button>
          </div>

          <div className="dashboard-card">
            <h3>🧾 Invoices</h3>
            <p>View invoices, payments, and receipts.</p>
            <button>View Invoices</button>
          </div>

        </section>

      </main>

    </div>
  );
}
