import React, { useState } from "react";
import "../app.css";

export default function Dashboard({ user }) {

  const [showProfile, setShowProfile] = useState(false);


  return (

    <div className="dashboard-page">


      <header className="dashboard-header">

        <div>
          <h1>Enrique Mobile Mechanic</h1>
          <p>Professional Repair & Diagnostic Services</p>
        </div>


        <div className="dashboard-actions">

          <button
            className="profile-toggle"
            onClick={() => setShowProfile(!showProfile)}
          >
            👤 Profile
          </button>


          <button
            className="dashboard-logout"
            onClick={()=>{
              localStorage.clear();
              window.location.reload();
            }}
          >
            Logout
          </button>

        </div>

      </header>



      <main className="dashboard-container">


        <section className="dashboard-top">


          <div className="welcome-card">

            <h2>
              Welcome back, {user?.firstName || "Henry"}
            </h2>

            <p>
              Manage your vehicle repairs, appointments,
              service history, and invoices from your dashboard.
            </p>

          </div>



          {showProfile && (

            <div className="profile-card">

              <h2>Customer Information</h2>


              <p>
                <b>Name:</b>{" "}
                {user?.firstName} {user?.lastName}
              </p>


              <p>
                <b>Email:</b>{" "}
                {user?.email}
              </p>


              <p>
                <b>Phone:</b>{" "}
                {user?.phone || "Not Added"}
              </p>


              <button>
                Edit Profile
              </button>


            </div>

          )}


        </section>



        <section className="dashboard-grid">


          <div className="dashboard-card">
            <h3>📅 Appointments</h3>
            <p>
              View upcoming mechanic visits and scheduled repairs.
            </p>
            <button>
              View Appointments
            </button>
          </div>



          <div className="dashboard-card">
            <h3>🔧 Services</h3>
            <p>
              Review completed repairs and service history.
            </p>
            <button>
              View Services
            </button>
          </div>



          <div className="dashboard-card">
            <h3>🚗 My Vehicles</h3>
            <p>
              Manage your vehicles and diagnostic information.
            </p>
            <button>
              Manage Vehicles
            </button>
          </div>



          <div className="dashboard-card">
            <h3>🧾 Invoices</h3>
            <p>
              Access invoices, payments, and receipts.
            </p>
            <button>
              View Invoices
            </button>
          </div>


        </section>


      </main>


    </div>

  );
}
