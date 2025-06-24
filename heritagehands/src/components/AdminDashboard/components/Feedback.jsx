import React, { useState, useEffect } from 'react';
import { getAllFeedback, replyToFeedback, deleteFeedback, getFeedbackStats } from '../../../services/adminServices';
import { toast } from 'react-toastify';
import { FaStar, FaUser, FaCalendarAlt, FaThumbsUp, FaThumbsDown, FaReply, FaTrash } from 'react-icons/fa';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [feedbackStats, setFeedbackStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    pending: 0,
    averageRating: 0
  });

  useEffect(() => {
    fetchFeedback();
    fetchFeedbackStats();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await getAllFeedback();
      setFeedback(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbackStats = async () => {
    try {
      const response = await getFeedbackStats();
      setFeedbackStats(response.data);
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
    }
  };

  const handleReply = async (feedbackId) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      await replyToFeedback(feedbackId, { reply: replyText });
      setFeedback(prev => prev.map(f => 
        f._id === feedbackId 
          ? { ...f, adminReply: replyText, isReplied: true, status: 'replied' }
          : f
      ));
      setReplyText('');
      setSelectedFeedback(null);
      toast.success('Reply sent successfully');
      fetchFeedbackStats(); // Refresh stats
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const handleDelete = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await deleteFeedback(feedbackId);
        setFeedback(prev => prev.filter(f => f._id !== feedbackId));
        toast.success('Feedback deleted successfully');
        fetchFeedbackStats(); // Refresh stats
      } catch (error) {
        console.error('Error deleting feedback:', error);
        toast.error('Failed to delete feedback');
      }
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index} 
        className={index < rating ? 'star filled' : 'star'} 
      />
    ));
  };

  const getRatingLabel = (rating) => {
    switch (rating) {
      case 5: return 'Excellent';
      case 4: return 'Very Good';
      case 3: return 'Good';
      case 2: return 'Fair';
      case 1: return 'Poor';
      default: return 'No Rating';
    }
  };

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterRating === 'all' || 
                         (filterRating === 'positive' && item.status === 'replied') ||
                         (filterRating === 'negative' && item.status === 'pending') ||
                         (filterRating === 'neutral' && item.status === 'resolved');
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-content-section">
        <div className="section-header">
          <h2>Customer Feedback</h2>
        </div>
        <div className="loading-skeleton">
          {[1, 2, 3].map((id) => (
            <div key={id} className="feedback-skeleton">
              <div className="skeleton-header">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-info">
                  <div className="skeleton-name"></div>
                  <div className="skeleton-rating"></div>
                </div>
              </div>
              <div className="skeleton-comment"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content-section">
      <div className="section-header">
        <h2>Customer Feedback</h2>
      </div>

      <div className="feedback-stats">
        <div className="stat-item">
          <span className="stat-label">Total Reviews:</span>
          <span className="stat-value">{feedbackStats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Replied:</span>
          <span className="stat-value">{feedbackStats.replied}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending Replies:</span>
          <span className="stat-value">{feedbackStats.pending}</span>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <select 
          value={filterRating} 
          onChange={(e) => setFilterRating(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Messages</option>
          <option value="positive">Replied</option>
          <option value="negative">Pending</option>
          <option value="neutral">Resolved</option>
        </select>
      </div>

      <div className="feedback-list">
        {filteredFeedback.length === 0 ? (
          <div className="no-data">
            <p>No feedback found matching your criteria.</p>
          </div>
        ) : (
          filteredFeedback.map((item) => (
            <div key={item._id} className="feedback-card">
              <div className="feedback-header">
                <div className="customer-info">
                  <div className="customer-avatar">
                    <FaUser />
                  </div>
                  <div className="customer-details">
                    <h4>{item.customerName}</h4>
                    <p className="customer-email">{item.email}</p>
                    <p className="feedback-date">
                      <FaCalendarAlt /> {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="status-section">
                  <span className={`status-badge status-${item.status}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="feedback-content">
                <div className="message-info">
                  <strong>Subject:</strong> {item.subject || 'Contact Form Message'}
                </div>
                <div className="comment">
                  <p>{item.message}</p>
                </div>
              </div>

              {item.isReplied && (
                <div className="admin-reply">
                  <div className="reply-header">
                    <strong>Admin Reply:</strong>
                  </div>
                  <p>{item.adminReply}</p>
                </div>
              )}

              <div className="feedback-actions">
                {!item.isReplied ? (
                  <button 
                    className="admin-btn admin-btn-primary"
                    onClick={() => setSelectedFeedback(item._id)}
                  >
                    <FaReply /> Reply
                  </button>
                ) : (
                  <span className="replied-badge">
                    <FaThumbsUp /> Replied
                  </span>
                )}
                <button 
                  className="admin-btn admin-btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>

              {selectedFeedback === item._id && (
                <div className="reply-form">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Enter your reply..."
                    className="reply-textarea"
                  />
                  <div className="reply-actions">
                    <button 
                      className="admin-btn admin-btn-primary"
                      onClick={() => handleReply(item._id)}
                    >
                      Send Reply
                    </button>
                    <button 
                      className="admin-btn admin-btn-secondary"
                      onClick={() => {
                        setSelectedFeedback(null);
                        setReplyText('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feedback; 