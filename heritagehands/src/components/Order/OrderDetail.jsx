import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetails } from '../../services/orderServices';
import './Order.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderDetails(orderId);
        setOrder(data);
      } catch (err) {
        setError('Order not found or you do not have access.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="order-summary-container"><p>Loading order details...</p></div>;
  if (error) return <div className="order-summary-container"><p>{error}</p></div>;
  if (!order) return null;

  return (
    <div className="order-summary-container">
      <h1>Order Details</h1>
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
            const product = item.productId || {};
            const image = product.image || item.image;
            const name = product.title || item.name || item.productId || 'Product';
            const description = product.description || item.description || '';
            return (
              <li key={idx} className="order-summary-item">
                {image && <img src={image} alt={name} className="order-summary-item-image" />}
                <div className="order-summary-item-details">
                  <span className="order-summary-item-name">{name}</span>
                  {description && <span className="order-summary-item-desc">{description}</span>}
                  <span>Qty: {item.quantity}</span>
                  <span>Price: ₹{item.price}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <button onClick={() => navigate('/orders')}>Back to My Orders</button>
    </div>
  );
};

export default OrderDetail; 