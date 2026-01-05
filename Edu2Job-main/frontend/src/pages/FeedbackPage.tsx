import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Star, ThumbsUp, MessageSquare, Loader2, Send, X } from "lucide-react";
import api from "../api";

const FeedbackPage: React.FC = () => {
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [msg, setMsg] = useState<{ type: string; text: string } | null>(null);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (feedbackRating === 0) {
      setMsg({ type: "error", text: "Please select a rating" });
      return;
    }

    if (!feedbackSubject.trim()) {
      setMsg({ type: "error", text: "Please enter a subject" });
      return;
    }

    setSubmittingFeedback(true);
    setMsg(null);
    
    try {
      // TODO: Replace with actual API call when backend is ready
      // await api.post("/feedback/", {
      //   rating: feedbackRating,
      //   subject: feedbackSubject,
      //   comment: feedbackComment
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMsg({ type: "success", text: "Thank you for your feedback! We appreciate your input." });
      setFeedbackRating(0);
      setFeedbackSubject("");
      setFeedbackComment("");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setMsg({ type: "error", text: "Failed to submit feedback. Please try again." });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: 900, 
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Send Feedback
          </h1>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1.1rem" }}>
            Help us improve by sharing your thoughts and suggestions
          </p>
        </div>

        {/* Status Message */}
        {msg && (
          <div style={{
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "24px",
            background: msg.type === "success" 
              ? "rgba(16, 185, 129, 0.2)" 
              : "rgba(239, 68, 68, 0.2)",
            color: msg.type === "success" ? "#10b981" : "#ef4444",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            border: `2px solid ${msg.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
            fontWeight: 600
          }}>
            {msg.type === "success" ? (
              <ThumbsUp size={20} />
            ) : (
              <X size={20} />
            )}
            {msg.text}
          </div>
        )}

        <div className="card" style={{ padding: "2.5rem" }}>
          <form onSubmit={handleSubmitFeedback}>
            {/* Rating Section */}
            <div style={{ marginBottom: "2rem" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "1rem", 
                color: "white", 
                fontWeight: 700,
                fontSize: "1.1rem"
              }}>
                Overall Rating *
              </label>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFeedbackRating(rating)}
                    disabled={submittingFeedback}
                    style={{
                      background: feedbackRating >= rating 
                        ? "linear-gradient(135deg, #fb923c 0%, #14b8a6 100%)"
                        : "rgba(251, 146, 60, 0.2)",
                      border: `2px solid ${feedbackRating >= rating ? "#fb923c" : "rgba(251, 146, 60, 0.3)"}`,
                      borderRadius: "12px",
                      padding: "16px",
                      cursor: submittingFeedback ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "60px",
                      height: "60px"
                    }}
                    onMouseEnter={(e) => {
                      if (!submittingFeedback && feedbackRating < rating) {
                        e.currentTarget.style.background = "rgba(251, 146, 60, 0.3)";
                        e.currentTarget.style.borderColor = "#fb923c";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!submittingFeedback && feedbackRating < rating) {
                        e.currentTarget.style.background = "rgba(251, 146, 60, 0.2)";
                        e.currentTarget.style.borderColor = "rgba(251, 146, 60, 0.3)";
                      }
                    }}
                  >
                    <Star 
                      size={28} 
                      color={feedbackRating >= rating ? "white" : "#fb923c"} 
                      fill={feedbackRating >= rating ? "white" : "none"} 
                    />
                  </button>
                ))}
              </div>
              <p style={{ 
                textAlign: "center", 
                marginTop: "12px", 
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.9rem"
              }}>
                {feedbackRating === 0 && "Click a star to rate"}
                {feedbackRating === 1 && "Poor"}
                {feedbackRating === 2 && "Fair"}
                {feedbackRating === 3 && "Good"}
                {feedbackRating === 4 && "Very Good"}
                {feedbackRating === 5 && "Excellent"}
              </p>
            </div>

            {/* Subject Section */}
            <div style={{ marginBottom: "2rem" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "0.75rem", 
                color: "white", 
                fontWeight: 700,
                fontSize: "1rem"
              }}>
                Subject *
              </label>
              <input
                type="text"
                value={feedbackSubject}
                onChange={(e) => setFeedbackSubject(e.target.value)}
                placeholder="What is your feedback about?"
                disabled={submittingFeedback}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "2px solid rgba(20, 184, 166, 0.3)",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#14b8a6";
                  e.currentTarget.style.boxShadow = "0 0 0 4px rgba(20, 184, 166, 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(20, 184, 166, 0.3)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Comment Section */}
            <div style={{ marginBottom: "2rem" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "0.75rem", 
                color: "white", 
                fontWeight: 700,
                fontSize: "1rem"
              }}>
                Your Feedback
              </label>
              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Tell us more about your experience, suggestions, or any issues you encountered..."
                disabled={submittingFeedback}
                rows={6}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "2px solid rgba(20, 184, 166, 0.3)",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#14b8a6";
                  e.currentTarget.style.boxShadow = "0 0 0 4px rgba(20, 184, 166, 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(20, 184, 166, 0.3)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Submit Button */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => {
                  setFeedbackRating(0);
                  setFeedbackSubject("");
                  setFeedbackComment("");
                  setMsg(null);
                }}
                disabled={submittingFeedback}
                style={{
                  padding: "14px 28px",
                  background: "transparent",
                  border: "2px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  color: "rgba(255,255,255,0.8)",
                  cursor: submittingFeedback ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  fontSize: "1rem",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  if (!submittingFeedback) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submittingFeedback) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  }
                }}
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={submittingFeedback || feedbackRating === 0 || !feedbackSubject.trim()}
                style={{
                  padding: "14px 36px",
                  background: submittingFeedback || feedbackRating === 0 || !feedbackSubject.trim()
                    ? "rgba(100, 116, 139, 0.5)"
                    : "linear-gradient(135deg, #14b8a6 0%, #fb923c 100%)",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                  cursor: submittingFeedback || feedbackRating === 0 || !feedbackSubject.trim() 
                    ? "not-allowed" 
                    : "pointer",
                  fontWeight: 800,
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.3s ease",
                  boxShadow: submittingFeedback || feedbackRating === 0 || !feedbackSubject.trim() 
                    ? "none" 
                    : "0 4px 12px rgba(20, 184, 166, 0.3)"
                }}
                onMouseEnter={(e) => {
                  if (!submittingFeedback && feedbackRating > 0 && feedbackSubject.trim()) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(20, 184, 166, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submittingFeedback && feedbackRating > 0 && feedbackSubject.trim()) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(20, 184, 166, 0.3)";
                  }
                }}
              >
                {submittingFeedback ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="card" style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(20, 184, 166, 0.1)" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <MessageSquare size={24} color="#14b8a6" style={{ marginTop: "4px" }} />
            <div>
              <h4 style={{ margin: "0 0 8px 0", color: "white", fontWeight: 700 }}>
                We Value Your Feedback
              </h4>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Your feedback helps us improve the platform and provide a better experience for all students. 
                Whether you have suggestions, found a bug, or want to share your experience, we'd love to hear from you!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackPage;


