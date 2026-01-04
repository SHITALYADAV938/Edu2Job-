import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth/useAuth";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { Mail, Lock, ArrowRight, Loader2, GraduationCap, Shield } from "lucide-react"; 
import "../styles/Login.css"; 

const LoginPage: React.FC = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"USER" | "ADMIN">("USER");

  // Helper: Handle Redirect based on Role
  const handleRedirect = (userData: any) => {
    // Check role safely
    const role = userData.role || 'USER'; 
    const isAdmin = role === 'ADMIN' || userData.is_staff;
    
    console.log("Redirecting User:", userData.email, "Role:", role); // Debug Log

    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  // 🟢 FIXED LOGIN LOGIC
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Get Tokens
      const res = await api.post("/auth/login/", { email, password });
      
      // 2. Save Tokens FIRST
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // 3. 🔥 FETCH USER DETAILS MANUALLY (The Fix)
      // Login response lo user lekapothe, /auth/me nundi techukovali
      let user = res.data.user;
      
      if (!user) {
         console.log("User object missing in login response, fetching /auth/me/...");
         const meRes = await api.get("/auth/me/");
         user = meRes.data;
      }

      // 4. Save to Context & Redirect
      setUser(user);
      handleRedirect(user);

    } catch (err: any) {
      console.error("Login Error Details:", err);
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error') || !err.response) {
        setError("Cannot connect to server. Please make sure the backend server is running on http://localhost:8000");
      } else if (err.response?.data?.detail)
        setError(err.response.data.detail);
      else if (err.response?.status === 401)
        setError("Invalid email or password.");
      else if (err.response?.status === 500)
        setError("Server error. Please check if the database is configured correctly.");
      else 
        setError(`Login failed: ${err.message || "Please check your connection."}`);
    } finally {
      setLoading(false);
    }
  };

  // Google Login Logic
  const handleGoogleSuccess = async (response: any) => {
    try {
      // Store token and show role selection modal for new users
      setGoogleToken(response.credential);
      setShowRoleModal(true);
    } catch (err) {
      console.error("Google Login Error:", err);
      setError("Google authentication failed. Please try again.");
    }
  };

  // Complete Google authentication with selected role
  const completeGoogleAuth = async () => {
    if (!googleToken) return;

    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/auth/google/", {
        token: googleToken,
        role: selectedRole,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // Fetch User Details
      const me = await api.get("/auth/me/");
      setUser(me.data);
      setShowRoleModal(false);
      setGoogleToken(null);
      handleRedirect(me.data);

    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError(err.response?.data?.detail || "Google authentication failed. Please try again.");
      setShowRoleModal(false);
      setGoogleToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="circle-blur-1"></div>
        <div className="circle-blur-2"></div>
          <div className="brand-content">
            <h1 className="brand-title">Welcome to <span>Edu2Jobs</span></h1>
            <p className="brand-text">Your gateway to endless career opportunities.</p>
          </div>
      </div>

      <div className="login-right">
        <div className="form-wrapper">
          <div className="form-header">
            <h2 className="form-title">Sign In</h2>
            <p className="form-subtitle">Login as Student or Admin - We'll redirect you automatically</p>
          </div>

          {/* Quick Access Buttons */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
            <Link 
              to="/register?type=student" 
              style={{ 
                flex: 1, 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(20, 184, 166, 0.15)',
                  border: '2px solid rgba(20, 184, 166, 0.4)',
                  borderRadius: '12px',
                  color: '#14b8a6',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(20, 184, 166, 0.25)';
                  e.currentTarget.style.borderColor = '#14b8a6';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(20, 184, 166, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <GraduationCap size={18} />
                Student Signup
              </button>
            </Link>
            <Link 
              to="/register?type=admin" 
              style={{ 
                flex: 1, 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(251, 146, 60, 0.15)',
                  border: '2px solid rgba(251, 146, 60, 0.4)',
                  borderRadius: '12px',
                  color: '#fb923c',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(251, 146, 60, 0.25)';
                  e.currentTarget.style.borderColor = '#fb923c';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(251, 146, 60, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(251, 146, 60, 0.4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Shield size={18} />
                Admin Signup
              </button>
            </Link>
          </div>

          <div className="divider" style={{marginBottom: '1.5rem'}}>
            <span className="divider-text">Or Sign In</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="label">Email Address</label>
              <div className="input-wrapper">
                <div className="input-icon"><Mail size={20} /></div>
                <input
                  type="email"
                  className="styled-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <label className="label" style={{marginBottom: 0}}>Password</label>
              </div>
              <div className="input-wrapper">
                <div className="input-icon"><Lock size={20} /></div>
                <input
                  type="password"
                  className="styled-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> 
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="divider"><span className="divider-text">Or continue with</span></div>
          
          <div className="google-btn-container" style={{display: 'flex', justifyContent: 'center'}}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google Auth Failed")} width="350" />
          </div>

          <div className="divider" style={{marginTop: '2rem'}}><span className="divider-text">New User?</span></div>

          <Link to="/register" className="register-btn-link">
            <button type="button" className="register-btn">
              <span>Create New Account</span>
              <ArrowRight size={18} />
            </button>
          </Link>

          <p className="footer-text" style={{marginTop: '1.5rem'}}>
            Already have an account? <Link to="/login" className="register-link">Sign In</Link>
          </p>
        </div>
      </div>

      {/* Role Selection Modal for Google Auth */}
      {showRoleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => !loading && (setShowRoleModal(false), setGoogleToken(null))}>
          <div 
            style={{
              background: 'rgba(30, 41, 59, 0.95)',
              backdropFilter: 'blur(20px)',
              padding: '2.5rem',
              borderRadius: '20px',
              border: '2px solid rgba(20, 184, 166, 0.3)',
              width: '90%',
              maxWidth: '450px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              margin: '0 0 1.5rem 0',
              fontSize: '1.75rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center'
            }}>
              Select Your Role
            </h2>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              textAlign: 'center', 
              marginBottom: '2rem',
              fontSize: '0.95rem'
            }}>
              Choose whether you're signing in as a Student or Admin
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button
                type="button"
                onClick={() => setSelectedRole("USER")}
                style={{
                  flex: 1,
                  padding: '18px',
                  background: selectedRole === "USER" 
                    ? 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)' 
                    : 'rgba(30, 41, 59, 0.6)',
                  border: `2px solid ${selectedRole === "USER" ? '#14b8a6' : 'rgba(20, 184, 166, 0.3)'}`,
                  borderRadius: '12px',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedRole === "USER" ? '0 4px 12px rgba(20, 184, 166, 0.3)' : 'none',
                  opacity: loading ? 0.6 : 1
                }}
                disabled={loading}
              >
                <GraduationCap size={32} />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("ADMIN")}
                style={{
                  flex: 1,
                  padding: '18px',
                  background: selectedRole === "ADMIN" 
                    ? 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)' 
                    : 'rgba(30, 41, 59, 0.6)',
                  border: `2px solid ${selectedRole === "ADMIN" ? '#14b8a6' : 'rgba(20, 184, 166, 0.3)'}`,
                  borderRadius: '12px',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedRole === "ADMIN" ? '0 4px 12px rgba(20, 184, 166, 0.3)' : 'none',
                  opacity: loading ? 0.6 : 1
                }}
                disabled={loading}
              >
                <Shield size={32} />
                <span>Admin</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setGoogleToken(null);
                }}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'rgba(255,255,255,0.8)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                Cancel
              </button>
              <button
                onClick={completeGoogleAuth}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px 32px',
                  background: loading
                    ? 'rgba(100, 116, 139, 0.5)'
                    : 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 800,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(20, 184, 166, 0.3)'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;