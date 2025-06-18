import React from 'react';
import './UserDashboard.css';

const orders = [
  { id: 1, item: 'Handmade Vase', status: 'Delivered', date: '2024-05-01' },
  { id: 2, item: 'Woven Basket', status: 'Pending', date: '2024-05-03' },
  { id: 3, item: 'Clay Pot', status: 'Delivered', date: '2024-05-05' },
];

const UserOrders = () => (
  <section className="user-orders-section">
    <h2>Recent Orders</h2>
    <ul className="user-orders-list">
      {orders.map(order => (
        <li key={order.id} className={`order-${order.status.toLowerCase()}`}>
          <span className="order-item">{order.item}</span>
          <span className="order-status">{order.status}</span>
          <span className="order-date">{order.date}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default UserOrders; 