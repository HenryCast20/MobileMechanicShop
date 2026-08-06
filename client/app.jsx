import React, { useState } from "react";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import MyVehicles from "./pages/mycars";

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [currentView, setCurrentView] = useState("dashboard"); // tracks active page

  if (!user) {
    return <Login setUser={setUser} />;
  }

  // Switch between views based on state
  if (currentView === "myVehicles") {
    return <MyVehicles user={user} setUser={setUser} setCurrentView={setCurrentView} />;
  }

  return <Dashboard user={user} setUser={setUser} setCurrentView={setCurrentView} />;
}
