import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import DashboardLayout from "../components/DashboardLayout";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Loader2,
  Search,
  Filter
} from "lucide-react";

interface AppliedJob {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'shortlisted' | 'rejected' | 'hired';
  matchScore?: number;
  jobLink?: string;
}

const AppliedJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    loadAppliedJobs();
  }, []);

  const loadAppliedJobs = async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const res = await api.get("/jobs/applied/");
      // setJobs(res.data);
      
      // Mock data for now
      const mockJobs: AppliedJob[] = [
        {
          id: 1,
          jobTitle: "Data Scientist",
          company: "Google",
          location: "Hyderabad",
          appliedDate: "2024-12-15",
          status: "shortlisted",
          matchScore: 98,
          jobLink: "https://careers.google.com/jobs"
        },
        {
          id: 2,
          jobTitle: "React Developer",
          company: "Swiggy",
          location: "Bangalore",
          appliedDate: "2024-12-10",
          status: "pending",
          matchScore: 92,
          jobLink: "https://careers.swiggy.com"
        },
        {
          id: 3,
          jobTitle: "Full Stack Developer",
          company: "Microsoft",
          location: "Pune",
          appliedDate: "2024-12-05",
          status: "hired",
          matchScore: 95
        },
        {
          id: 4,
          jobTitle: "Machine Learning Engineer",
          company: "Amazon",
          location: "Bangalore",
          appliedDate: "2024-11-28",
          status: "rejected",
          matchScore: 88
        },
        {
          id: 5,
          jobTitle: "Software Engineer",
          company: "Flipkart",
          location: "Bangalore",
          appliedDate: "2024-11-20",
          status: "pending",
          matchScore: 90
        }
      ];
      
      setJobs(mockJobs);
    } catch (err) {
      console.error("Error loading applied jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hired':
        return { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981', icon: CheckCircle2 };
      case 'shortlisted':
        return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6', icon: CheckCircle2 };
      case 'rejected':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444', icon: XCircle };
      default:
        return { bg: 'rgba(251, 146, 60, 0.2)', text: '#fb923c', icon: Clock };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'hired': return 'Hired';
      case 'shortlisted': return 'Shortlisted';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    shortlisted: jobs.filter(j => j.status === 'shortlisted').length,
    hired: jobs.filter(j => j.status === 'hired').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Loader2 className="animate-spin" size={40} color="#14b8a6" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 900, 
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Applied Jobs
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
            Track all your job applications in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-row" style={{ marginBottom: '2rem' }}>
          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'rgba(20, 184, 166, 0.2)', color: '#14b8a6' }}>
              <Briefcase size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'white' }}>{stats.total}</h3>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Total Applications</span>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'rgba(251, 146, 60, 0.2)', color: '#fb923c' }}>
              <Clock size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'white' }}>{stats.pending}</h3>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Pending</span>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'white' }}>{stats.shortlisted}</h3>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Shortlisted</span>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'white' }}>{stats.hired}</h3>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Hired</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
              <input
                type="text"
                placeholder="Search by job title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 3rem',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '2px solid rgba(20, 184, 166, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Filter size={20} color="rgba(255,255,255,0.7)" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '2px solid rgba(20, 184, 166, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Briefcase size={64} color="rgba(255,255,255,0.3)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No jobs found</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t applied to any jobs yet'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredJobs.map((job) => {
              const statusStyle = getStatusColor(job.status);
              const StatusIcon = statusStyle.icon;

              return (
                <div
                  key={job.id}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(20, 184, 166, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <h3 style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: 800, 
                          margin: 0, 
                          color: 'white',
                          background: 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>
                          {job.jobTitle}
                        </h3>
                        {job.matchScore && (
                          <span style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: 700
                          }}>
                            {job.matchScore}% Match
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>
                          <Briefcase size={18} />
                          <span style={{ fontWeight: 600 }}>{job.company}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>
                          <MapPin size={18} />
                          <span>{job.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>
                          <Calendar size={18} />
                          <span>Applied {formatDate(job.appliedDate)}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <StatusIcon size={18} color={statusStyle.text} />
                        <span style={{
                          background: statusStyle.bg,
                          color: statusStyle.text,
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '0.875rem',
                          fontWeight: 700
                        }}>
                          {getStatusText(job.status)}
                        </span>
                      </div>
                    </div>

                    {job.jobLink && (
                      <a
                        href={job.jobLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '10px 20px',
                          background: 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)',
                          color: 'white',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          fontWeight: 700,
                          transition: 'all 0.3s ease',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(20, 184, 166, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        View Job
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AppliedJobsPage;

