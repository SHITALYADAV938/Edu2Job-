import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import api from "../api";
import { useAuth } from "../auth/useAuth";
import { GoogleLogin } from "@react-oauth/google";
import { Mail, Lock, User, ArrowRight, Loader2, GraduationCap, Shield } from "lucide-react";
import "../styles/Login.css";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"USER" | "ADMIN">("USER");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  // Check URL parameter for user type
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "admin" || type === "ADMIN") {
      setUserType("ADMIN");
    } else {
      setUserType("USER");
    }
  }, [searchParams]);

  // Helper: Handle Redirect based on Role
  const handleRedirect = (userData: any) => {
    const role = userData.role || 'USER'; 
    const isAdmin = role === 'ADMIN' || userData.is_staff;
    
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/register/", {
        email,
        username,
        password,
        role: userType,
      });

      console.log("Registration Success:", response.data);
      setError(null);
      
      // Auto-login after registration
      try {
        // Login with the credentials
        const loginRes = await api.post("/auth/login/", { email, password });
        
        // Save tokens
        localStorage.setItem("access", loginRes.data.access);
        localStorage.setItem("refresh", loginRes.data.refresh);
        
        // Fetch user details
        let user = loginRes.data.user;
        if (!user) {
          const meRes = await api.get("/auth/me/");
          user = meRes.data;
        }
        
        // Set user in context and redirect
        setUser(user);
        handleRedirect(user);
      } catch (loginErr) {
        console.error("Auto-login error:", loginErr);
        // If auto-login fails, redirect to login page
        navigate("/login");
      }
    } catch (err: any) {
      console.error("Register error:", err);

      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data;
        setError(
          typeof data === "string" ? data : JSON.stringify(data, null, 2)
        );
      } else {
        setError("Unable to register. Server error.");
      }
    }

    setLoading(false);
  };

  // Google Signup/Login Logic
  const handleGoogleSuccess = async (response: any) => {
    try {
      // Store token and show role selection modal
      setGoogleToken(response.credential);
      setShowRoleModal(true);
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError("Google authentication failed. Please try again.");
    }
  };

  // Complete Google authentication with selected role
  const completeGoogleAuth = async () => {
    if (!googleToken) return;

    try {
      setError(null);
      setLoading(true);
      
      const res = await api.post("/auth/google/", {
        token: googleToken,
        role: userType, // Use the selected userType from the form
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
      
      {/* LEFT SIDE: Branding (Same as Login) */}
      <div className="login-left">
        <div className="circle-blur-1"></div>
        <div className="circle-blur-2"></div>
        
          <div className="brand-content">
            <h1 className="brand-title">Join <span>Edu2Jobs</span></h1>
            <p className="brand-text">
              Start your journey today. Create an account to explore thousands of job opportunities and learning paths.
            </p>
          </div>
      </div>

      {/* RIGHT SIDE: Register Form */}
      <div className="login-right">
        <div className="form-wrapper">
          <div className="form-header">
            <h2 className="form-title">Create Account</h2>
            <p className="form-subtitle">
              {userType === "ADMIN" 
                ? "Register as an Administrator" 
                : "Register as a Student"}
            </p>
          </div>

          {/* User Type Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="label" style={{ marginBottom: '0.75rem', display: 'block' }}>
              I am a:
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setUserType("USER")}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: userType === "USER" 
                    ? 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)' 
                    : 'rgba(30, 41, 59, 0.6)',
                  border: `2px solid ${userType === "USER" ? '#14b8a6' : 'rgba(20, 184, 166, 0.3)'}`,
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  boxShadow: userType === "USER" ? '0 4px 12px rgba(20, 184, 166, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (userType !== "USER") {
                    e.currentTarget.style.background = 'rgba(20, 184, 166, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (userType !== "USER") {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.3)';
                  }
                }}
              >
                <GraduationCap size={20} />
                Student
              </button>
              <button
                type="button"
                onClick={() => setUserType("ADMIN")}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: userType === "ADMIN" 
                    ? 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)' 
                    : 'rgba(30, 41, 59, 0.6)',
                  border: `2px solid ${userType === "ADMIN" ? '#14b8a6' : 'rgba(20, 184, 166, 0.3)'}`,
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  boxShadow: userType === "ADMIN" ? '0 4px 12px rgba(20, 184, 166, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (userType !== "ADMIN") {
                    e.currentTarget.style.background = 'rgba(20, 184, 166, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (userType !== "ADMIN") {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.3)';
                  }
                }}
              >
                <Shield size={20} />
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Email Input */}
            <div className="input-group">
              <label className="label">Email Address</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Mail size={20} />
                </div>
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

            {/* Username Input (New Field) */}
            <div className="input-group">
              <label className="label">Username</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  className="styled-input"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="input-group">
              <label className="label">Password</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  className="styled-input"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="error-msg" style={{ whiteSpace: "pre-wrap" }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="divider" style={{marginTop: '2rem'}}><span className="divider-text">Or continue with</span></div>
          
          <div className="google-btn-container" style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
            <GoogleLogin 
              onSuccess={handleGoogleSuccess} 
              onError={() => setError("Google authentication failed. Please try again.")} 
              width="350"
              text="signup_with"
            />
          </div>

          <div className="divider" style={{marginTop: '1.5rem'}}><span className="divider-text">Already Registered?</span></div>

          <Link to="/login" className="register-btn-link">
            <button type="button" className="register-btn">
              <span>Sign In to Existing Account</span>
              <ArrowRight size={18} />
            </button>
          </Link>

          <p className="footer-text" style={{marginTop: '1.5rem', textAlign: 'center'}}>
            {userType === "ADMIN" ? (
              <span style={{color: 'rgba(251, 146, 60, 0.8)'}}>
                ⚠️ Admin accounts have full system access
              </span>
            ) : (
              <span style={{color: 'rgba(255, 255, 255, 0.6)'}}>
                Need help? Contact support
              </span>
            )}
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
              Choose whether you're signing up as a Student or Admin
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button
                type="button"
                onClick={() => setUserType("USER")}
                style={{
                  flex: 1,
                  padding: '18px',
                  background: userType === "USER" 
                    ? 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)' 
                    : 'rgba(30, 41, 59, 0.6)',
                  border: `2px solid ${userType === "USER" ? '#14b8a6' : 'rgba(20, 184, 166, 0.3)'}`,
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
                  boxShadow: userType === "USER" ? '0 4px 12px rgba(20, 184, 166, 0.3)' : 'none',
                  opacity: loading ? 0.6 : 1
                }}
                disabled={loading}
              >
                <GraduationCap size={32} />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType("ADMIN")}
                style={{
                  flex: 1,
                  padding: '18px',
                  background: userType === "ADMIN" 
                    ? 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)' 
                    : 'rgba(30, 41, 59, 0.6)',
                  border: `2px solid ${userType === "ADMIN" ? '#14b8a6' : 'rgba(20, 184, 166, 0.3)'}`,
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
                  boxShadow: userType === "ADMIN" ? '0 4px 12px rgba(20, 184, 166, 0.3)' : 'none',
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

export default RegisterPage;