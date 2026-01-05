import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Users, MessageSquare, Send, PlusCircle, Briefcase, X, Loader2, Star, ThumbsUp } from "lucide-react";
import api from "../api";

// Dummy Data for UI Demo
const initialGroups = [
  { id: 1, name: "Batch 2025 Job Seekers", members: 12, desc: "Updates for freshers jobs" },
  { id: 2, name: "Python Developers", members: 8, desc: "Python & Django discussions" },
  { id: 3, name: "Study Circle", members: 5, desc: "Mock interviews & prep" },
];

const initialPosts = [
  { id: 1, user: "Ravi", time: "2 hrs ago", content: "Guys, TCS hiring start ayindi! Check this link...", tag: "Job Alert" },
  { id: 2, user: "Sibi", time: "5 hrs ago", content: "Can anyone suggest best Django tutorial?", tag: "Question" },
];

const GroupsPage: React.FC = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [activeGroup, setActiveGroup] = useState<any>(null); // Null means list view
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      user: "You",
      time: "Just now",
      content: newPost,
      tag: "Discussion"
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    setCreating(true);
    
    try {
      // TODO: Replace with actual API call when backend is ready
      // const res = await api.post("/groups/", {
      //   name: newGroupName,
      //   description: newGroupDesc
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newGroup = {
        id: Date.now(),
        name: newGroupName,
        members: 1,
        desc: newGroupDesc || "No description"
      };
      
      setGroups([newGroup, ...groups]);
      setActiveGroup(newGroup);
      setShowCreateModal(false);
      setNewGroupName("");
      setNewGroupDesc("");
    } catch (err) {
      console.error("Error creating group:", err);
      alert("Failed to create group. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (feedbackRating === 0) {
      alert("Please select a rating");
      return;
    }

    setSubmittingFeedback(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      // await api.post("/feedback/", {
      //   rating: feedbackRating,
      //   comment: feedbackComment,
      //   group_id: activeGroup?.id
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      alert("Thank you for your feedback!");
      setShowFeedback(false);
      setFeedbackRating(0);
      setFeedbackComment("");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', height: '85vh', display: 'flex', gap: '20px' }}>
        
        {/* LEFT: Groups List */}
        <div style={{ 
          width: '300px', 
          background: 'rgba(30, 41, 59, 0.8)', 
          backdropFilter: 'blur(20px)',
          padding: '20px', 
          borderRadius: '16px', 
          border: '1px solid rgba(20, 184, 166, 0.3)', 
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        }}>
          <h3 style={{ 
            margin: '0 0 20px 0', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            <Users size={24} /> My Groups
          </h3>
          
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px' }}>
            {groups.map(g => (
              <div 
                key={g.id}
                onClick={() => setActiveGroup(g)}
                style={{ 
                  padding: '14px', 
                  marginBottom: '12px', 
                  borderRadius: '12px', 
                  cursor: 'pointer',
                  background: activeGroup?.id === g.id 
                    ? 'rgba(20, 184, 166, 0.2)' 
                    : 'rgba(30, 41, 59, 0.6)',
                  border: activeGroup?.id === g.id 
                    ? '2px solid #14b8a6' 
                    : '1px solid rgba(20, 184, 166, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (activeGroup?.id !== g.id) {
                    e.currentTarget.style.background = 'rgba(20, 184, 166, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeGroup?.id !== g.id) {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.2)';
                  }
                }}
              >
                <h4 style={{ margin: 0, color: 'white', fontWeight: 700, fontSize: '1rem' }}>{g.name}</h4>
                <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                  {g.members} {g.members === 1 ? 'Member' : 'Members'}
                </p>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setShowCreateModal(true)}
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              cursor: 'pointer', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: '10px', 
              fontWeight: 700,
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(20, 184, 166, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.3)';
            }}
          >
            <PlusCircle size={20} /> Create New Group
          </button>
        </div>

        {/* RIGHT: Chat Area */}
        <div style={{ 
          flex: 1, 
          background: 'rgba(30, 41, 59, 0.8)', 
          backdropFilter: 'blur(20px)',
          borderRadius: '16px', 
          border: '1px solid rgba(20, 184, 166, 0.3)', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        }}>
          
          {activeGroup ? (
            <>
              {/* Header */}
              <div style={{ 
                padding: '20px', 
                borderBottom: '1px solid rgba(20, 184, 166, 0.2)', 
                background: 'rgba(20, 184, 166, 0.1)' 
              }}>
                <h3 style={{ 
                  margin: 0, 
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {activeGroup.name}
                </h3>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                  {activeGroup.desc}
                </p>
              </div>

              {/* Messages Feed */}
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: 'rgba(15, 23, 42, 0.3)' }}>
                {posts.map(post => (
                  <div key={post.id} style={{ 
                    background: 'rgba(30, 41, 59, 0.6)', 
                    padding: '16px', 
                    borderRadius: '12px', 
                    marginBottom: '15px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)', 
                    border: '1px solid rgba(20, 184, 166, 0.2)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 700, color: '#14b8a6', fontSize: '1rem' }}>{post.user}</span>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{post.time}</span>
                    </div>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>{post.content}</p>
                    <span style={{ 
                      display: 'inline-block', 
                      marginTop: '12px', 
                      fontSize: '0.75rem', 
                      background: 'rgba(16, 185, 129, 0.2)', 
                      color: '#10b981', 
                      padding: '4px 12px', 
                      borderRadius: '20px',
                      fontWeight: 700
                    }}>
                      {post.tag}
                    </span>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div style={{ 
                padding: '20px', 
                borderTop: '1px solid rgba(20, 184, 166, 0.2)', 
                background: 'rgba(30, 41, 59, 0.6)', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '12px' 
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Share job update or ask something..." 
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handlePost();
                      }
                    }}
                    style={{ 
                      flex: 1, 
                      padding: '12px 16px', 
                      borderRadius: '12px', 
                      border: '2px solid rgba(20, 184, 166, 0.3)', 
                      outline: 'none',
                      background: 'rgba(15, 23, 42, 0.6)',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                  <button 
                    onClick={handlePost}
                    disabled={!newPost.trim()}
                    style={{ 
                      background: 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)', 
                      color: 'white', 
                      border: 'none', 
                      padding: '12px 24px', 
                      borderRadius: '12px', 
                      cursor: newPost.trim() ? 'pointer' : 'not-allowed',
                      opacity: newPost.trim() ? 1 : 0.5,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Send size={20} />
                  </button>
                </div>
                <button
                  onClick={() => setShowFeedback(true)}
                  style={{
                    padding: '10px 16px',
                    background: 'rgba(251, 146, 60, 0.2)',
                    color: '#fb923c',
                    border: '2px solid rgba(251, 146, 60, 0.3)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(251, 146, 60, 0.3)';
                    e.currentTarget.style.borderColor = '#fb923c';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(251, 146, 60, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(251, 146, 60, 0.3)';
                  }}
                >
                  <Star size={18} /> Give Feedback
                </button>
              </div>
            </>
          ) : (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'rgba(255,255,255,0.6)'
            }}>
              <MessageSquare size={60} style={{ marginBottom: '20px', opacity: 0.5, color: '#14b8a6' }} />
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Select a group to start discussion</h3>
              <p>Join communities to accelerate your job search.</p>
            </div>
          )}

        </div>

        {/* Create Group Modal */}
        {showCreateModal && (
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
          }} onClick={() => !creating && setShowCreateModal(false)}>
            <div 
              style={{
                background: 'rgba(30, 41, 59, 0.95)',
                backdropFilter: 'blur(20px)',
                padding: '2.5rem',
                borderRadius: '20px',
                border: '2px solid rgba(20, 184, 166, 0.3)',
                width: '90%',
                maxWidth: '500px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Create New Group
                </h2>
                <button
                  onClick={() => !creating && setShowCreateModal(false)}
                  disabled={creating}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: creating ? 'not-allowed' : 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!creating) {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                      e.currentTarget.style.color = '#ef4444';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!creating) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                    }
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.95rem'
                }}>
                  Group Name *
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Python Developers"
                  disabled={creating}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '2px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#14b8a6';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(20, 184, 166, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.3)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.95rem'
                }}>
                  Description (Optional)
                </label>
                <textarea
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="What is this group about?"
                  disabled={creating}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '2px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#14b8a6';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(20, 184, 166, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.3)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'rgba(255,255,255,0.8)',
                    cursor: creating ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={creating || !newGroupName.trim()}
                  style={{
                    padding: '12px 32px',
                    background: creating || !newGroupName.trim()
                      ? 'rgba(100, 116, 139, 0.5)'
                      : 'linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: creating || !newGroupName.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: 800,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.3s ease',
                    boxShadow: creating || !newGroupName.trim() ? 'none' : '0 4px 12px rgba(20, 184, 166, 0.3)'
                  }}
                >
                  {creating ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={18} />
                      <span>Create Group</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Student Feedback Modal */}
        {showFeedback && (
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
          }} onClick={() => !submittingFeedback && setShowFeedback(false)}>
            <div 
              style={{
                background: 'rgba(30, 41, 59, 0.95)',
                backdropFilter: 'blur(20px)',
                padding: '2.5rem',
                borderRadius: '20px',
                border: '2px solid rgba(251, 146, 60, 0.3)',
                width: '90%',
                maxWidth: '500px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #fb923c 0%, #14b8a6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Student Feedback
                </h2>
                <button
                  onClick={() => !submittingFeedback && setShowFeedback(false)}
                  disabled={submittingFeedback}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: submittingFeedback ? 'not-allowed' : 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', color: 'white', fontWeight: 700 }}>
                  Rating *
                </label>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFeedbackRating(rating)}
                      disabled={submittingFeedback}
                      style={{
                        background: feedbackRating >= rating ? '#fb923c' : 'rgba(251, 146, 60, 0.2)',
                        border: `2px solid ${feedbackRating >= rating ? '#fb923c' : 'rgba(251, 146, 60, 0.3)'}`,
                        borderRadius: '8px',
                        padding: '12px',
                        cursor: submittingFeedback ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Star size={24} color={feedbackRating >= rating ? 'white' : '#fb923c'} fill={feedbackRating >= rating ? 'white' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', color: 'white', fontWeight: 700 }}>
                  Your Feedback (Optional)
                </label>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Tell us about your experience..."
                  disabled={submittingFeedback}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '2px solid rgba(251, 146, 60, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowFeedback(false)}
                  disabled={submittingFeedback}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'rgba(255,255,255,0.8)',
                    cursor: submittingFeedback ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={submittingFeedback || feedbackRating === 0}
                  style={{
                    padding: '12px 32px',
                    background: submittingFeedback || feedbackRating === 0
                      ? 'rgba(100, 116, 139, 0.5)'
                      : 'linear-gradient(135deg, #fb923c 0%, #14b8a6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: submittingFeedback || feedbackRating === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: 800,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  {submittingFeedback ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <ThumbsUp size={18} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GroupsPage;