import React, { useState, useEffect } from 'react';
import { getVendorNotifications, markNotificationAsRead } from '../../services/vendorServices';
import './VendorNotifications.css';

const VendorNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, [page, showUnreadOnly]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await getVendorNotifications({
                page,
                limit: 10,
                unreadOnly: showUnreadOnly
            });
            setNotifications(response.notifications);
            setTotalPages(response.totalPages);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            // Update local state
            setNotifications(prev => 
                prev.map(notif => 
                    notif._id === notificationId 
                        ? { ...notif, isRead: true }
                        : notif
                )
            );
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'payment_received':
                return '💰';
            case 'order_placed':
                return '📦';
            case 'stock_low':
                return '⚠️';
            case 'order_cancelled':
                return '❌';
            default:
                return '📢';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading && notifications.length === 0) {
        return (
            <div className="vendor-notifications">
                <div className="notifications-header">
                    <h2>Notifications</h2>
                    <div className="notifications-filters">
                        <label>
                            <input
                                type="checkbox"
                                checked={showUnreadOnly}
                                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                            />
                            Show unread only
                        </label>
                    </div>
                </div>
                <div className="loading-skeleton">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="notification-skeleton">
                            <div className="skeleton-icon"></div>
                            <div className="skeleton-content">
                                <div className="skeleton-title"></div>
                                <div className="skeleton-message"></div>
                                <div className="skeleton-date"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="vendor-notifications">
            <div className="notifications-header">
                <h2>Notifications</h2>
                <div className="notifications-filters">
                    <label>
                        <input
                            type="checkbox"
                            checked={showUnreadOnly}
                            onChange={(e) => setShowUnreadOnly(e.target.checked)}
                        />
                        Show unread only
                    </label>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {notifications.length === 0 ? (
                <div className="no-notifications">
                    <div className="no-notifications-icon">📭</div>
                    <h3>No notifications</h3>
                    <p>You're all caught up! Check back later for new updates.</p>
                </div>
            ) : (
                <div className="notifications-list">
                    {notifications.map((notification) => (
                        <div 
                            key={notification._id} 
                            className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                            onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                        >
                            <div className="notification-icon">
                                {getNotificationIcon(notification.type)}
                            </div>
                            <div className="notification-content">
                                <div className="notification-header">
                                    <h4 className="notification-title">{notification.title}</h4>
                                    {!notification.isRead && (
                                        <span className="unread-indicator">•</span>
                                    )}
                                </div>
                                <p className="notification-message">{notification.message}</p>
                                <div className="notification-details">
                                    <span className="notification-date">
                                        {formatDate(notification.createdAt)}
                                    </span>
                                    {notification.amount && (
                                        <span className="notification-amount">
                                            {formatAmount(notification.amount)}
                                        </span>
                                    )}
                                    {notification.quantity && (
                                        <span className="notification-quantity">
                                            Qty: {notification.quantity}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        disabled={page === 1}
                        className="pagination-btn"
                    >
                        Previous
                    </button>
                    <span className="page-info">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={page === totalPages}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default VendorNotifications; 