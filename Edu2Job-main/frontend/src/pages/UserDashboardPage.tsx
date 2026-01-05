import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, TrendingUp, BrainCircuit, Loader2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api";

const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ jobsApplied: 0, predictionsRun: 0, loading: true });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch job applications count
        const jobsRes = await api.get("/profile/jobs/applied/");
        const jobsCount = jobsRes.data?.length || 0;
        
        // Fetch predictions count
        const predictionsRes = await api.get("/my-predictions/");
        const predictionsCount = predictionsRes.data?.length || 0;
        
        setStats({ jobsApplied: jobsCount, predictionsRun: predictionsCount, loading: false });
      } catch (err) {
        console.error("Error fetching stats:", err);
        setStats({ jobsApplied: 0, predictionsRun: 0, loading: false });
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      {/* Stats Row */}
      <div className="stats-row">
        <div 
          className="stat-box" 
          onClick={() => navigate('/applied-jobs')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-icon" style={{background: 'rgba(20, 184, 166, 0.2)', color: '#14b8a6'}}>
            <Briefcase size={24} />
          </div>
          <div>
            <h3 style={{margin:0, fontSize:'1.5rem', color: 'white'}}>
              {stats.loading ? <Loader2 className="animate-spin" size={20} /> : stats.jobsApplied}
            </h3>
            <span style={{color:'rgba(255,255,255,0.7)', fontSize:'0.9rem'}}>Jobs Applied</span>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon" style={{background: 'rgba(16, 185, 129, 0.2)', color: '#10b981'}}>
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 style={{margin:0, fontSize:'1.5rem', color: 'white'}}>85%</h3>
            <span style={{color:'rgba(255,255,255,0.7)', fontSize:'0.9rem'}}>Profile Score</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{background: 'rgba(251, 146, 60, 0.2)', color: '#fb923c'}}>
            <BrainCircuit size={24} />
          </div>
          <div>
            <h3 style={{margin:0, fontSize:'1.5rem', color: 'white'}}>
              {stats.loading ? <Loader2 className="animate-spin" size={20} /> : stats.predictionsRun}
            </h3>
            <span style={{color:'rgba(255,255,255,0.7)', fontSize:'0.9rem'}}>Predictions Run</span>
          </div>
        </div>
      </div>

      {/* Split Content */}
      <div className="content-split">
        {/* Recommended Jobs */}
        <div className="card">
          <h3>Recommended Jobs</h3>
          <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
             {/* Job 1 */}
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:'1rem', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                <div>
                  <div style={{fontWeight:700, color: 'white'}}>Data Scientist</div>
                  <div style={{fontSize:'0.85rem', color:'rgba(255,255,255,0.7)'}}>Google • Hyderabad</div>
                </div>
                <span style={{background:'rgba(16, 185, 129, 0.2)', color:'#10b981', fontSize:'0.8rem', padding:'4px 8px', borderRadius:'4px', fontWeight:700}}>98% Match</span>
             </div>
             {/* Job 2 */}
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:700, color: 'white'}}>React Developer</div>
                  <div style={{fontSize:'0.85rem', color:'rgba(255,255,255,0.7)'}}>Swiggy • Bangalore</div>
                </div>
                <span style={{background:'rgba(16, 185, 129, 0.2)', color:'#10b981', fontSize:'0.8rem', padding:'4px 8px', borderRadius:'4px', fontWeight:700}}>92% Match</span>
             </div>
          </div>
          <div style={{marginTop:'1.5rem'}}>
            <Link to="/predict" style={{color:'#14b8a6', fontWeight:700, textDecoration:'none', fontSize:'0.9rem'}}>
              Run new prediction →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3>Quick Actions</h3>
          <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            <Link to="/profile" style={{textDecoration:'none'}}>
              <button style={{
                width:'100%', 
                padding:'12px', 
                background:'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)', 
                color:'white', 
                border:'none', 
                borderRadius:'10px', 
                cursor:'pointer', 
                fontWeight:700,
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}>
                Update Profile
              </button>
            </Link>
            <Link to="/predict" style={{textDecoration:'none'}}>
              <button style={{
                width:'100%', 
                padding:'12px', 
                background:'transparent', 
                color:'#14b8a6', 
                border:'2px solid #14b8a6', 
                borderRadius:'10px', 
                cursor:'pointer', 
                fontWeight:700,
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}>
                Predict Role
              </button>
            </Link>
            <Link to="/applied-jobs" style={{textDecoration:'none'}}>
              <button style={{
                width:'100%', 
                padding:'12px', 
                background:'rgba(20, 184, 166, 0.1)', 
                color:'#14b8a6', 
                border:'2px solid rgba(20, 184, 166, 0.3)', 
                borderRadius:'10px', 
                cursor:'pointer', 
                fontWeight:700,
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}>
                View Applied Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboardPage;