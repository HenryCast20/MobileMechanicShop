import React from "react";
import "../app.css";

export default function Dashboard({ user }) {
  return (
    <div className="dashboard-page">

      <header className="dashboard-header">
        <div>
          <h1>Enrique Mobile Mechanic</h1>
          <p>Professional Repair & Diagnostic Services</p>
        </div>

        <button
          className="dashboard-logout"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </header>


      <main className="dashboard-container">

        <section className="welcome-card">
          <h2>
            Welcome back, {user?.firstName || "Customer"}
          </h2>

          <p>
            Manage your vehicle services, appointments, and account details
            from your customer dashboard.
          </p>
        </section>


        <section className="dashboard-grid">

          <div className="dashboard-card">
            <h3>🚗 My Vehicles</h3>
            <p>
              Add and manage your vehicles for faster service scheduling.
            </p>
            <button>
              View Vehicles
            </button>
          </div>


          <div className="dashboard-card">
            <h3>🔧 Service Requests</h3>
            <p>
              Request repairs, diagnostics, and mobile mechanic visits.
            </p>
            <button>
              Request Service
            </button>
          </div>


          <div className="dashboard-card">
            <h3>📅 Appointments</h3>
            <p>
              View upcoming appointments and service history.
            </p>
            <button>
              View Schedule
            </button>
          </div>


        </section>


        <section className="profile-card">

          <h2>Customer Profile</h2>

          <div className="profile-grid">

            <p>
              <strong>Name:</strong>{" "}
              {user?.firstName} {user?.lastName}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {user?.email}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {user?.phone || "Not added"}
            </p>

            <p>
              <strong>Username:</strong>{" "}
              {user?.username}
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}
