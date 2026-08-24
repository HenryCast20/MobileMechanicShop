import React, { useState, useEffect } from "react";
import { logoutUser } from "../services/authservice";
import "../app.css";

export default function MyVehicles({ user, setUser, setCurrentView }) {
  const [showProfile, setShowProfile] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [historyCar, setHistoryCar] = useState(null);
  const [history, setHistory] = useState([]);

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [odometer, setOdometer] = useState("");

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch vehicles.");
      setVehicles(await response.json());
      setError("");
    } catch (err) {
      setError(err.message || "Error loading vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const resetForm = () => {
    setMake(""); setModel(""); setYear("");
    setVin(""); setLicensePlate(""); setOdometer("");
  };

  const openEdit = (car) => {
    setError("");
    setMake(car.make || "");
    setModel(car.model || "");
    setYear(car.year_produced || "");
    setVin(car.vin || "");
    setLicensePlate(car.license_plate || "");
    setOdometer(car.odometer || "");
    setEditingCar(car);
  };

  const openHistory = async (car) => {
    setHistoryCar(car);
    setHistory([]);
    try {
      const response = await fetch(`/api/repairs/car/${car.car_id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load history.");
      setHistory(await response.json());
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          make, model, year, vin,
          license_plate: licensePlate,
          odometer: odometer ? Number(odometer) : null
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add vehicle.");
      resetForm();
      setShowAddModal(false);
      fetchVehicles();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/vehicles/${editingCar.car_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          make, model, year, vin,
          license_plate: licensePlate,
          odometer: odometer ? Number(odometer) : null
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update vehicle.");
      resetForm();
      setEditingCar(null);
      setError("");
      fetchVehicles();
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

  const filtered = vehicles.filter((car) => {
    const term = searchTerm.toLowerCase();
    return `${car.year_produced} ${car.make} ${car.model} ${car.license_plate || ""}`
      .toLowerCase().includes(term);
  });

  const vehicleFields = (
    <>
      <div className="input-group">
        <label>Make</label>
        <input required placeholder="DODGE" value={make}
          onChange={(e) => setMake(e.target.value.toUpperCase())} />
      </div>
      <div className="input-group">
        <label>Model</label>
        <input required placeholder="CHARGER" value={model}
          onChange={(e) => setModel(e.target.value.toUpperCase())} />
      </div>
      <div className="input-group">
        <label>Year</label>
        <input type="number" required placeholder="2020" value={year}
          onChange={(e) => setYear(e.target.value)} />
      </div>
      <div className="input-group">
        <label>License Plate</label>
        <input placeholder="ABC-1234" value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value.toUpperCase())} />
      </div>
      <div className="input-group">
        <label>Odometer (Miles)</label>
        <input type="number" placeholder="45000" value={odometer}
          onChange={(e) => setOdometer(e.target.value)} />
      </div>
      <div className="input-group">
        <label>VIN</label>
        <input placeholder="17 characters" maxLength={17} value={vin}
          onChange={(e) => setVin(e.target.value.toUpperCase())} />
      </div>
    </>
  );

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
              👤 Profile
            </button>
            {showProfile && (
              <div className="profile-dropdown">
                <h3>Customer Profile</h3>
                <p><strong>Name</strong><br />{user?.firstName} {user?.lastName}</p>
                <p><strong>Email</strong><br />{user?.email || "Not Available"}</p>
                <p><strong>Phone</strong><br />{user?.phone || "Not Added"}</p>
                <button className="edit-profile-btn">Edit Profile</button>
              </div>
            )}
          </div>
          <button className="dashboard-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-container">
        <div className="vehicles-header-row">
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button className="action-btn"
              style={{ width: "auto", padding: "8px 15px", background: "#6c757d" }}
              onClick={() => setCurrentView("dashboard")}>
              ← Back
            </button>
            <div>
              <h2>My Vehicles</h2>
              <p>Manage your registered vehicles and maintenance records.</p>
            </div>
          </div>
          <button className="action-btn" style={{ width: "auto", padding: "10px 20px" }}
            onClick={() => { resetForm(); setError(""); setShowAddModal(true); }}
            + Add Vehicle
          </button>
        </div>

        <div className="input-group" style={{ marginBottom: "20px" }}>
          <input type="text" placeholder="Search by year, make, model, or plate"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {error && (
          <p className="error-message" style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        {loading ? (
          <p style={{ textAlign: "center", padding: "40px" }}>Loading your vehicles...</p>
        ) : filtered.length === 0 ? (
          <div className="dashboard-card" style={{ textAlign: "center", padding: "40px" }}>
            <h3>No vehicles found</h3>
            <p>You haven't added any vehicles yet or your search didn't match.</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {filtered.map((car) => (
              <div className="dashboard-card vehicle-card" key={car.car_id}>
                <div>
                  <h3>🚗 {car.make} {car.model}</h3>
                  <p><strong>Year:</strong> {car.year_produced}</p>
                  <p><strong>License Plate:</strong> {car.license_plate || "Not Provided"}</p>
                  <p><strong>Odometer:</strong> {car.odometer ? `${car.odometer.toLocaleString()} mi` : "Not Provided"}</p>
                  <p><strong>VIN:</strong> {car.vin || "Not Provided"}</p>
                </div>
                <div className="card-btn-row">
                  <button className="btn-secondary" onClick={() => openEdit(car)}>Edit</button>
                  <button onClick={() => openHistory(car)}>History</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {(showAddModal || editingCar) && (
          <div className="modal-backdrop" onClick={() => { setShowAddModal(false); setEditingCar(null); }}>
            <div className="terminal-card" onClick={(e) => e.stopPropagation()}
              style={{ width: "400px", maxWidth: "90%", padding: "30px", maxHeight: "90vh", overflowY: "auto" }}>
              <h3>{editingCar ? "Edit Vehicle" : "Add New Vehicle"}</h3>
                {error && (
                  <p style={{ color: "#d90429", marginBottom: "15px", fontWeight: "bold", fontSize: "0.9rem" }}>
                    {error}
                  </p>
                )}
                <form onSubmit={editingCar ? handleUpdateVehicle : handleAddVehicle}>
                {vehicleFields}
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button type="submit" className="action-btn">
                    {editingCar ? "Save Changes" : "Save Vehicle"}
                  </button>
                  <button type="button" className="action-btn" style={{ background: "#6c757d" }}
                    onClick={() => { setShowAddModal(false); setEditingCar(null); resetForm(); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {historyCar && (
          <div className="modal-backdrop" onClick={() => setHistoryCar(null)}>
            <div className="terminal-card" onClick={(e) => e.stopPropagation()}
              style={{ width: "600px", maxWidth: "92%", padding: "30px", maxHeight: "85vh", overflowY: "auto" }}>
              <h3>{historyCar.year_produced} {historyCar.make} {historyCar.model}</h3>
              {history.length === 0 ? (
                <p style={{ padding: "20px 0" }}>No service history for this vehicle yet.</p>
              ) : (
                <div className="history-list">
                  {history.map((r) => (
                    <div className="history-row" key={r.repair_id}>
                      <div>
                        <strong>{r.category || "Service"}</strong>
                        <p>{r.service_date ? new Date(r.service_date).toLocaleDateString() : ""}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <strong>${money(r.total)}</strong>
                        <p>{r.payment_status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className="action-btn" style={{ marginTop: "20px" }}
                onClick={() => setHistoryCar(null)}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
