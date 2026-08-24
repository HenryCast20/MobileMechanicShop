import React, { useState } from "react";
import Header from "../components/Header";
import "../app.css";

export default function Dashboard({ user, setUser, setCurrentView }) {
  const [showProfile, setShowProfile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains("dark-mode"));

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    }
    setUser(null);
  };

  const toggleTheme = () => {
    const isDark = document.body.classList.toggle("dark-mode");
    setIsDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <div className="dashboard-page">
      <button id="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      <header className="dashboard-header">
        <div className="dashboard-brand">
          <h1>Enrique Mobile Mechanic</h1>
          <p>Professional Repair &amp; Diagnostic Services</p>
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
                <button className="edit-profile-btn">Edit Profile</button>
              </div>
            )}
          </div>
          <button className="dashboard-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-container">
        <section className="dashboard-welcome">
          <h2>Welcome back, {user?.firstName || "Henry"}</h2>
          <p>Manage your vehicles, appointments, and invoices.</p>
        </section>

        <section className="hud-stack">
          <div className="hud-bar">
            <div className="hud-icon">📅</div>
            <div className="hud-text">
              <h3>Appointments</h3>
              <p>Book a visit or view your scheduled repairs.</p>
            </div>
            <button
              onClick={() =>
                window.open(
                  "https://book.squareup.com/appointments/ardukiyf97mvn1/location/LV5F6TF5NE8TP",
                  "_blank"
                )
              }
            >
              Book
            </button>
          </div>

          <div className="hud-bar">
            <div className="hud-icon">🚗</div>
            <div className="hud-text">
              <h3>My Vehicles</h3>
              <p>Manage your vehicles and maintenance records.</p>
            </div>
            <button onClick={() => setCurrentView("myVehicles")}>Manage</button>
          </div>

          <div className="hud-bar">
            <div className="hud-icon">🧾</div>
            <div className="hud-text">
              <h3>Invoices</h3>
              <p>View your service history, invoices, and receipts.</p>
            </div>
            <button onClick={() => setCurrentView("CustomerInvoices")}>View</button>
          </div>
        </section>
      </main>
    </div>
  );
}
