import React from 'react';
import './card.css';

const Card = ({products}) => {
  return (
    <div className="product-card">
      <div className="card">
        <img src={products.image} className="card-img-top" alt={products.title} />
        <div className="card-body">
          <h5 className="card-title">{products.title}</h5>
          <p className="card-text">
            {products.description}
          </p>
          <p className="card-text">
            {products.category}
          </p>
          <p className="card-text">
            ${products.price}
          </p>
          <button className="btn btn-primary">Go to cart</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
