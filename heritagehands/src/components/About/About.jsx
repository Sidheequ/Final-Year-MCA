import React from 'react';
import './About.css';
import logo from '../../assets/logo.png'

function About() {
    return (
        <section className="section-container">
            <div className="content-wrapper">
                <div className="profile-section">
                    <div className="info-container">
                        <div className="profile-info">
                            <div className="avatar">
                                <img
                                    src={logo}
                                    alt="logo"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "contain",
                                        borderRadius: "50%"
                                    }}
                                />
                            </div>
                            <div className="text-center">
                                <h2 className="name">Heritage Hands</h2>
                                <div className="divider"></div>
                                <p className="bio">
                                    The best place to find your next favorite handcrafted products.
                                </p>
                            </div>
                        </div>
                        <div className="content">
                            <p className="paragraph">
                                Welcome to Heritage Hands, We are dedicated to providing you with the best online shopping experience. Our mission is to offer a wide range of high-quality products at competitive prices, all while ensuring exceptional customer service.
                                Our team is passionate about curating the latest trends and timeless classics, so you can find everything you need in one place. Whether you're looking for fashion, home goods, decoration items, or more, we've got you covered.
                                We believe in transparency and integrity, which is why we strive to provide detailed product descriptions, customer reviews, and easy returns. Your satisfaction is our top priority, and we are here to assist you every step of the way.
                            </p>
                            <a href="/contact" className="learn-more">
                                Connect with us
                                <svg
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
