import React from "react";
import "../app.css";

export default function Dashboard({ user }) {

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };


  return (
    <>

      <header className="brand-header">
        <div className="brand-text">
          <h1>
            Enrique Mobile Mechanic
          </h1>

          <p>
            Customer Dashboard
          </p>
        </div>
      </header>


      <main>

        <div className="terminal-card dashboard-card">

          <h2>
            Welcome, {user.firstName}!
          </h2>


          <p>
            Your account is connected successfully.
          </p>


          <div className="dashboard-grid">


            <div className="dashboard-box">

              <h3>
                🔧 Service Requests
              </h3>

              <p>
                No active repairs yet.
              </p>

            </div>



            <div className="dashboard-box">

              <h3>
                📅 Appointments
              </h3>

              <p>
                No appointments scheduled.
              </p>

            </div>



            <div className="dashboard-box">

              <h3>
                👤 Profile
              </h3>

              <p>
                {user.email}
              </p>

              <p>
                {user.phone || "Phone not added"}
              </p>

            </div>


          </div>



          <button
            className="action-btn"
            onClick={logout}
          >
            Logout
          </button>


        </div>

      </main>


      <footer>
        &copy; 2026 Enrique Mobile Mechanic. All rights reserved.
      </footer>

    </>
  );
}
