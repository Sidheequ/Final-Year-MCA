import React from 'react';
import './Contact.css';

function Contact() {
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
            <form>
              <div className="input-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" className="input-field" />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" className="input-field" />
              </div>
              <div className="input-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="textarea-field"
                ></textarea>
              </div>
              <button className="submit-button">Submit</button>
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
