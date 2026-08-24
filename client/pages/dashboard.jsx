import React, { useState } from "react";
import Header from "../components/Header";
import "../app.css";

export default function Dashboard({ user, setUser, setCurrentView }) {
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains("dark-mode"));

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

      <Header user={user} setUser={setUser} />

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
