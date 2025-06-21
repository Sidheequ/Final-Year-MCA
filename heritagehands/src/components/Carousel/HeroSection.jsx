import React from 'react';
import './HeroSection.css';
import i1  from '../../assets/1.jpg'
import i2 from '../../assets/2.jpg'
import i3 from '../../assets/11.jpg'

function HeroSection() {
  return (
    <div className="hero-container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Summer styles are finally here</h1>
            <p>This year, our new summer collection will shelter you from the harsh elements of a world that doesn't care if you live or die.</p>
            <a href="#" className="shop-button">Shop Collection</a>
          </div>
          <div className="hero-images">
            <div className="image-grid">
              <div className="image-column">
                <div className="image-box hide-on-small">
                  <img src={i1} alt="" />
                </div>
                <div className="image-box">
                  <img src={i2} alt="" />
                </div>
              </div>
              <div className="image-column">
                <div className="image-box">
                  <img src={i3} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection; 