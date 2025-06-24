import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Order.css';

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Support both response.data.order and response.data
  const order = location.state?.order?.order || location.state?.order;

  if (!order) {
    return (
      <div className="order-summary-container">
        <h2>No order data found.</h2>
        <button onClick={() => navigate('/userdashboard')}>Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="order-summary-container">
      <h1>Order Confirmation</h1>
      <h2>Thank you for your purchase!</h2>
      <div className="order-summary-details">
        <p><strong>Order ID:</strong> #{order._id?.substring(0, 8)}...</p>
        <p><strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</p>
        <p><strong>Total Paid:</strong> ₹{order.totalAmount?.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> Card (**** **** **** {order.paymentDetails?.cardNumber || 'XXXX'})</p>
        <h3>Shipping Details</h3>
        <p>{order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
        <h3>Ordered Items</h3>
        <ul className="order-summary-items-list">
          {order.products?.map((item, idx) => {
            // Support both populated and non-populated productId
            const product = item.productId || {};
            const image = product.image || item.image;
            const name = product.title || item.name || item.productId || 'Product';
            return (
              <li key={idx} className="order-summary-item">
                {image && <img src={image} alt={name} className="order-summary-item-image" />}
                <div className="order-summary-item-details">
                  <span className="order-summary-item-name">{name}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>Price: ₹{item.price}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <button onClick={() => navigate('/orders')}>Go to My Orders</button>
    </div>
  );
};

export default OrderSummary; 