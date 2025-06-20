import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './card.css';

const Card = ({ products }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation(); // Stop event from bubbling up to the Link
    addToCart(products);
  };

  return (
    <Link to={`/product/${products._id}`} className="card-link">
      <div className="card">
        <div className="card-image-container">
          <img src={products.image} className="card-img-top" alt={products.title} />
        </div>
        <div className="card-body">
          <h5 className="card-title">{products.title}</h5>
          <p className="card-text">{products.description}</p>
          <p className="card-category">{products.category}</p>
          <div className="card-footer">
            <p className="card-price">₹{products.price}</p>
            <button className="btn btn-primary" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
