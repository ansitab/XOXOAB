import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function AdminDashboard() {
  const [missions, setMissions] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const missionRes = await axios.get(
          "http://localhost:5000/missions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMissions(missionRes.data);

        const logRes = await axios.get(
          "http://localhost:5000/logs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLogs(logRes.data);

      } catch (err) {
        console.error(err);
        alert("Error loading data");
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar role="admin" />

      <div className="dashboard">
        <h1>Admin Dashboard</h1>
        <p style={{ color: "#00ff88" }}>
  ●         SYSTEM ONLINE — IOT LINK ACTIVE
        </p>
<div className="radar"></div>

{/* 🗺️ INDIA MAP */}
<MapContainer
  center={[20.5937, 78.9629]}
  zoom={5}
  style={{ height: "300px", marginBottom: "30px" }}
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  <Marker position={[28.6139, 77.2090]}>
    <Popup>Delhi Mission Zone</Popup>
  </Marker>

  <Marker position={[20.2961, 85.8245]}>
    <Popup>Bhubaneswar HQ</Popup>
  </Marker>
</MapContainer>
        <h2>Uploaded Missions</h2>

        {missions.length === 0 ? (
          <p>No missions uploaded yet.</p>
        ) : (
          missions.map((m, index) => (
            <div key={index} className="card">
          📄 <b>{m.originalName}</b> <br />
👤 Uploaded by: {m.uploadedBy} <br />
🕒 {new Date(m.time).toLocaleString()} <br />

🛡 Classification: 
<span
  className={
    m.classification === "Top Secret"
      ? "top-secret"
      : ""
  }
  style={{
    color:
      m.classification === "Secret"
        ? "orange"
        : m.classification === "Confidential"
        ? "#00ff88"
        : undefined,
  }}
>
  {m.classification}
</span>
<br />

              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");

                  const response = await axios.get(
                    `http://localhost:5000/download/${m.filename}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                      responseType: "blob",
                    }
                  );

                  const url = window.URL.createObjectURL(
                    new Blob([response.data])
                  );

                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", m.originalName);
                  document.body.appendChild(link);
                  link.click();
                }}
                style={{
                  color: "#7CFC00",   // army green
                  fontWeight: "bold",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ⬇ Download file
              </button>
            </div>
          ))
        )}

        <hr style={{ margin: "40px 0" }} />

        <h2>Access Logs</h2>

        {logs.length === 0 ? (
          <p>No access activity yet.</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              📄 File: {log.file} <br />
              👤 Accessed by: {log.accessedBy} ({log.role}) <br />
              🕒 {new Date(log.time).toLocaleString()}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default AdminDashboard;