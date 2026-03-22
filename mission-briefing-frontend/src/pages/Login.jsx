import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      // 🔴 THIS WAS MISSING OR NOT RUNNING
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      navigate(`/${res.data.role}`);
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <h1>Mission Briefing System</h1>
      <p>Secure Defence Access</p>

      <input
        type="text"
        placeholder="Username (admin/officer/analyst)"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
