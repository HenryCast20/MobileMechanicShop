import React, { useState , useEffect} from "react";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import MyVehicles from "./pages/mycars";
import CustomerInvoices from "./pages/CustomerInvoices";


export default function App() {
  useEffect(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
  }, []);
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [currentView, setCurrentView] = useState("dashboard"); // tracks active page

  if (!user) {
    return <Login setUser={setUser} />;
  }

  // Switch between views based on state
  if (currentView === "myVehicles") {
    return <MyVehicles user={user} setUser={setUser} setCurrentView={setCurrentView} />;
  }
  if (currentView === "CustomerInvoices") {
    return <CustomerInvoices user={user} setUser={setUser} setCurrentView={setCurrentView} />;
  }

  return <Dashboard user={user} setUser={setUser} setCurrentView={setCurrentView} />;
}
