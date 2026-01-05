import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { BrainCircuit, Database } from "lucide-react";

const AdminModelPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "2rem", fontSize: "2rem", fontWeight: 800 }}>
          Model Management
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div 
            className="card" 
            style={{ cursor: "pointer", transition: "all 0.3s ease" }}
            onClick={() => navigate("/admin/training-data")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(20, 184, 166, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Database size={48} color="#14b8a6" style={{ marginBottom: "1rem" }} />
            <h3 style={{ marginBottom: "0.5rem" }}>Retrain Model</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
              Upload training data and retrain the ML model to improve predictions.
            </p>
          </div>

          <div className="card">
            <BrainCircuit size={48} color="#fb923c" style={{ marginBottom: "1rem" }} />
            <h3 style={{ marginBottom: "0.5rem" }}>Model Info</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
              Current model is active and running. Use the retrain option to update with new data.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminModelPage;
