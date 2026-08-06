import React, { useState, useEffect } from "react";
import "../app.css";

export default function MyVehicles({ user, setUser, setCurrentView }) {
  const [showProfile, setShowProfile] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [odometer, setOdometer] = useState("");

  const fetchVehicles = async (query = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = query ? `/api/vehicles?search=${encodeURIComponent(query)}` : "/api/vehicles";
      
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles.");
      }

      const data = await response.json();
      setVehicles(data);
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

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    fetchVehicles(val);
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          make, 
          model, 
          year, 
          vin, 
          license_plate: licensePlate, 
          odometer: odometer ? Number(odometer) : null 
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add vehicle.");
      }

      setMake("");
      setModel("");
      setYear("");
      setVin("");
      setLicensePlate("");
      setOdometer("");
      setShowAddModal(false);
      fetchVehicles(searchTerm);
    } catch (err) {
      setError(err.message || "Error adding vehicle.");
    }
  };

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
              <h2>My Vehicles</h2>
              <p>Manage your registered vehicles and maintenance records.</p>
            </div>
          </div>
          <button
            className="action-btn"
            style={{ width: "auto", padding: "10px 20px" }}
            onClick={() => setShowAddModal(true)}
          >
            + Add Vehicle
          </button>
        </div>

        <div className="input-group" style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by make or model (e.g., Dodge)..."
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
          <p style={{ textAlign: "center", padding: "40px" }}>Loading your vehicles...</p>
        ) : vehicles.length === 0 ? (
          <div className="dashboard-card" style={{ textAlign: "center", padding: "40px" }}>
            <h3>No vehicles found</h3>
            <p>You haven't added any vehicles yet or your search didn't match.</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {vehicles.map((car) => (
              <div className="dashboard-card" key={car.id || car.vehicle_id}>
                <h3>🚗 {car.make} {car.model}</h3>
                <p><strong>Year:</strong> {car.year}</p>
                <p><strong>License Plate:</strong> {car.license_plate || car.licensePlate || "Not Provided"}</p>
                <p><strong>Odometer:</strong> {car.odometer ? `${car.odometer.toLocaleString()} mi` : "Not Provided"}</p>
                <p><strong>VIN:</strong> {car.vin || "Not Provided"}</p>
                <button style={{ marginTop: "10px" }}>View History</button>
              </div>
            ))}
          </div>
        )}

        {showAddModal && (
          <div className="modal-backdrop" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
            <div className="terminal-card" style={{ width: "400px", maxWidth: "90%", background: "var(--card-bg, #fff)", padding: "20px", borderRadius: "8px" }}>
              <h3>Add New Vehicle</h3>
              <form onSubmit={handleAddVehicle}>
                <div className="input-group">
                  <label>Make</label>
                  <input required placeholder="e.g., Dodge" value={make} onChange={(e) => setMake(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Model</label>
                  <input required placeholder="e.g., Charger" value={model} onChange={(e) => setModel(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Year</label>
                  <input type="number" required placeholder="e.g., 2020" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>License Plate</label>
                  <input placeholder="e.g., ABC-1234" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Odometer (Miles)</label>
                  <input type="number" placeholder="e.g., 45000" value={odometer} onChange={(e) => setOdometer(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>VIN</label>
                  <input placeholder="17-digit VIN" value={vin} onChange={(e) => setVin(e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button type="submit" className="action-btn">Save Vehicle</button>
                  <button type="button" className="action-btn" style={{ background: "#6c757d" }} onClick={() => setShowAddModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
