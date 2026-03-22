import Navbar from "./components/Navbar";
import { useState } from "react";
import axios from "axios";

function OfficerDashboard() {
  const [file, setFile] = useState(null);

  const uploadMission = async () => {
  if (!file) {
    alert("Select a file first");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Mission uploaded successfully 🚀");

  } catch (err) {
    alert("Upload failed");
    console.error(err);
  }
};

  return (
    <>
      <Navbar role="officer" />
      <div style={{ padding: "40px", color: "white" }}>
        <h1>Officer Dashboard</h1>
        <p>Upload and manage mission briefings</p>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br /><br />
        <button onClick={uploadMission}>
          Upload Mission
        </button>
      </div>
    </>
  );
}

export default OfficerDashboard;
