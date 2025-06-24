import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../../services/userServices';
import './UserDashboard.css';
import { useNavigate } from 'react-router-dom';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getUserOrders();
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (orders.length === 0) {
        return <p>You have no orders yet.</p>;
    }

    return (
        <section className="user-orders-section mt-2">
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>
                                {order.products && order.products.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {order.products.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                                {item.productId?.image && (
                                                    <img src={item.productId.image} alt={item.productId.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginRight: '4px' }} />
                                                )}
                                                <span style={{ fontSize: '0.95rem' }}>{item.productId?.title || 'Product'}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>
                                <span className={`order-status-badge status-${order.orderStatus.toLowerCase()}`}>
                                    {order.orderStatus}
                                </span>
                            </td>
                            <td>₹{order.totalAmount.toFixed(2)}</td>
                            <td>
                                <button onClick={() => navigate(`/orders/${order._id}`)} className="view-order-details-btn btn btn-primary">View Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default UserOrders; 