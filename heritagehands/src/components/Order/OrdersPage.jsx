import React from 'react';
import UserOrders from '../Dashboard/UserOrders';
import './OrdersPage.css';

const OrdersPage = () => {
    return (
        <div className="orders-page-container">
            <h1 className="orders-page-title">My Orders</h1>
            <div className="orders-page-content">
                <UserOrders />
            </div>
        </div>
    );
};

export default OrdersPage; 