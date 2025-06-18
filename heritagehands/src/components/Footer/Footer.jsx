import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h3 style={styles.heading}>Heritage Hands</h3>
          <p style={styles.text}>Preserving cultural heritage through craftsmanship</p>
        </div>
        <div style={styles.section}>
          <h3 style={styles.heading}>Quick Links</h3>
          <ul style={styles.list}>
            <li><Link to="/" style={styles.link}>Home</Link></li>
            <li><Link to="/about" style={styles.link}>About</Link></li>
            <li><Link to="/contact" style={styles.link}>Contact</Link></li>
          </ul>
        </div>
        <div style={styles.section}>
          <h3 style={styles.heading}>Contact Us</h3>
          <p style={styles.text}>Email: info@heritagehands.com</p>
          <p style={styles.text}>Phone: +1 234 567 890</p>
        </div>
      </div>
      <div style={styles.bottom}>
        <p style={styles.copyright}>© 2024 Heritage Hands. All rights reserved.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#1f2937',
    color: '#f9fafb',
    padding: '2rem 0',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '2rem',
  },
  section: {
    flex: '1',
    minWidth: '250px',
  },
  heading: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  text: {
    color: '#d1d5db',
    marginBottom: '0.5rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  link: {
    color: '#d1d5db',
    textDecoration: 'none',
    marginBottom: '0.5rem',
    display: 'block',
    '&:hover': {
      color: '#fff',
    },
  },
  bottom: {
    borderTop: '1px solid #374151',
    marginTop: '2rem',
    paddingTop: '1rem',
    textAlign: 'center',
  },
  copyright: {
    color: '#9ca3af',
    fontSize: '0.875rem',
  },
};

export default Footer; 