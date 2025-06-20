import React from 'react';
import './HeroSection.css';

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
                  <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-01.jpg" alt="" />
                </div>
                <div className="image-box">
                  <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-02.jpg" alt="" />
                </div>
              </div>
              <div className="image-column">
                <div className="image-box">
                  <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-03.jpg" alt="" />
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