import Navbar from "./components/Navbar";

function AnalystDashboard() {
  return (
    <>
      <Navbar role="analyst" />

      <div style={{ padding: "40px", color: "white" }}>
        <h1>Analyst Dashboard</h1>
        <p>View intelligence reports and mission data.</p>
      </div>
    </>
  );
}

export default AnalystDashboard;
