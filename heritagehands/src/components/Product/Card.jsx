import React from 'react';
import './card.css';

const Card = ({products}) => {
  return (
    <div className="card" style={{width: '18rem'}}>
      <img src={products.image} className="card-img-top" alt={products.title} />
      <div className="card-body">
        <h5 className="card-title">{products.title}</h5>
        <p className="card-text">{products.description}</p>
        <p className="card-category">{products.category}</p>
        <p className="card-price">₹{products.price}</p>
        <button className="btn btn-primary">Add to Cart</button>
      </div>
    </div>
  );
};

export default Card;
