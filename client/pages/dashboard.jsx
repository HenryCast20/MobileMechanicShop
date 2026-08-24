import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import "../app.css";

export default function Dashboard({ user, setUser, setCurrentView }) {
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains("dark-mode"));
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/weather", { credentials: "include" });
        if (res.ok) setForecast(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const toggleTheme = () => {
    const isDark = document.body.classList.toggle("dark-mode");
    setIsDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const weatherIcon = (code) => {
    if (code === 0) return "☀️";
    if (code <= 2) return "🌤️";
    if (code === 3) return "☁️";
    if (code <= 48) return "🌫️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "🌨️";
    if (code <= 82) return "🌧️";
    if (code >= 95) return "⛈️";
    return "🌤️";
  };

  const dayName = (dateStr, i) => {
    if (i === 0) return "Today";
    return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
  };

  const rainToday = forecast[0]?.rain >= 70;

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

        {forecast.length > 0 && (
          <section className="weather-panel">
            <div className="weather-head">
              <h3>Orlando forecast</h3>
              {rainToday && (
              <span className="weather-alert">
                ⚠️ Rain expected — service may be unavailable, call first
              </span>
            )}
            </div>
            <div className="weather-strip">
              {forecast.map((d, i) => (
               <div className={`weather-day${i === 0 ? " today" : ""}`} key={d.date}>
                <span className="weather-name">{dayName(d.date, i)}</span>
                <span className="weather-icon">{weatherIcon(d.code)}</span>
                <span className="weather-temp">{d.high}° / {d.low}°</span>
                <span className="weather-rain">{d.rain}% rain</span>
                {d.rain >= 70 && <span className="weather-flag">Rain likely</span>}
              </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
