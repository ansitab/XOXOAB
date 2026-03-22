import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const role = localStorage.getItem("role");

      const res = await axios.get(
        "http://localhost:5000/logs",
        {
          headers: {
            Authorization: `Bearer ${role}`,
          },
        }
      );

      setLogs(res.data);
    };

    fetchLogs();
  }, []);

  return (
    <>
      <Navbar role="admin" />
      <div style={{ padding: "40px", color: "white" }}>
        <h1>Access Logs</h1>

        {logs.map((l, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            📄 {l.file} <br />
            👤 {l.accessedBy} ({l.role}) <br />
            🕒 {new Date(l.time).toLocaleString()}
          </div>
        ))}
      </div>
    </>
  );
}

export default Logs;
