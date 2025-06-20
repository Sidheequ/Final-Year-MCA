import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../../services/userServices';
import './UserDashboard.css';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>#{order._id.substring(0, 8)}...</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>
                                <span className={`order-status-badge status-${order.orderStatus.toLowerCase()}`}>
                                    {order.orderStatus}
                                </span>
                            </td>
                            <td>₹{order.totalAmount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default UserOrders; 