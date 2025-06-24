import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { submitFeedback } from '../../services/userServices';
import { toast } from 'react-toastify';
import './Contact.css';

function Contact() {
  const userData = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userData) {
      toast.error('Please login to submit feedback');
      navigate('/login');
      return;
    }

    if (!formData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback({
        customerName: formData.name,
        email: formData.email,
        message: formData.message
      });
      
      toast.success('Feedback submitted successfully!');
      setFormData(prev => ({ ...prev, message: '' }));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-container">
      <div className="content-wrapper">
        <div className="contact-section">
          <div className="map-container">
            <iframe
              width="100%"
              height="100%"
              className="map"
              frameBorder="0"
              title="map"
              marginHeight="0"
              marginWidth="0"
              scrolling="no"
              src="https://www.google.com/maps?q=10.0158685,76.3418586&z=14&t=k&output=embed"
            ></iframe>
            <div className="contact-info">
              <div className="address">
                <h2 className="title">ADDRESS</h2>
                <p>Heritage Hands, ShopEasy Complex Kakkanad,Kochi</p>
              </div>
              <div className="contact-details">
                <h2 className="title">EMAIL</h2>
                <a href="mailto:example@email.com" className="email">heritagehandspvt@gmail.com</a>
                <h2 className="title">PHONE</h2>
                <p className="phone">9987671000</p>
              </div>
            </div>
          </div>
          <div className="feedback-form">
            <h2 className="feedback-title">Feedback</h2>
            <p className="feedback-description">
              Feel free to reach out to us with any questions or feedback. We value your input and are here to assist you.
            </p>
            {!userData && (
              <div style={{ 
                background: '#fff3cd', 
                border: '1px solid #ffeaa7', 
                borderRadius: '4px', 
                padding: '10px', 
                marginBottom: '15px',
                color: '#856404'
              }}>
                Please <button 
                  onClick={() => navigate('/login')} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#007bff', 
                    textDecoration: 'underline', 
                    cursor: 'pointer' 
                  }}
                >
                  login
                </button> to submit feedback.
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="input-field" 
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!userData}
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="input-field" 
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!userData}
                />
              </div>
              <div className="input-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="textarea-field"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={!userData}
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="submit-button" 
                disabled={!userData || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
            <p className="footer-note">
              Heritage Hands artisian, All rights reserved. &copy; 2024
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
