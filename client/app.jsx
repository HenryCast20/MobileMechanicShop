import { useState } from "react";
import Login from "./pages/login.jsx";
import Dashboard from "./pages/dashboard.jsx";

export default function App() {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );


  if (!user) {
    return <Login setUser={setUser} />;
  }


  return <Dashboard user={user} />;

}
