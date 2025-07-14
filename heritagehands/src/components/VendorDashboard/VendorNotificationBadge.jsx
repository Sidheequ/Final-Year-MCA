import React, { useState, useEffect } from 'react';
import { getVendorNotifications, markNotificationAsRead } from '../../services/vendorServices';
import io from 'socket.io-client';
import axiosInstance from '../../axios/axiosinstance';
import './VendorNotifications.css';

const SOCKET_URL = 'http://localhost:5000'; // Change if needed

const OrderDetailsModal = ({ orderId, onClose, onStatusChange }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      axiosInstance.get(`/vendor/orders/${orderId}`)
        .then(res => { setOrder(res.data); setError(null); })
        .catch(() => { setOrder(null); setError('Failed to load order'); })
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  const handleStatusUpdate = async (status) => {
    try {
      await axiosInstance.patch(`/vendor/orders/${orderId}/status`, { orderStatus: status });
      if (onStatusChange) onStatusChange(); // Ensure dashboard refresh
      onClose();
    } catch {
      alert('Failed to update order status');
    }
  };

  if (!orderId) return null;
  if (loading) return <div className="modal">Loading...</div>;
  if (error) return <div className="modal">{error}</div>;

  // Get vendorId from localStorage (or your auth context)
  const vendorId = JSON.parse(localStorage.getItem('vendor'))?._id;

  return (
    <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, maxWidth: 400 }}>
        <h3>Order Details</h3>
        <p><strong>Status:</strong> {order.orderStatus}</p>
        <ul>
          {order.products
            .filter(item => {
              // item.productId.vendorId can be an object or string
              const prodVendorId = typeof item.productId.vendorId === 'object'
                ? item.productId.vendorId._id
                : item.productId.vendorId;
              return prodVendorId === vendorId;
            })
            .map((item, idx) => (
              <li key={idx}>
                {item.productId.title || item.productId._id} - Qty: {item.quantity} - Price: ₹{item.price}
              </li>
            ))}
        </ul>
        <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
        {order.shippingAddress && (
          <p><strong>Shipping Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.postalCode}</p>
        )}
        <button onClick={() => handleStatusUpdate('Shipped')} style={{ marginRight: 8 }}>Mark as Shipped</button>
        <button onClick={() => handleStatusUpdate('Delivered')} style={{ marginRight: 8 }}>Mark as Delivered</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const VendorNotificationBadge = ({ onSalesRefresh }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Get vendorId from localStorage (or your auth context)
  const vendorId = JSON.parse(localStorage.getItem('vendor'))?._id;

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getVendorNotifications({ limit: 20 });
      setNotifications(response.notifications || []);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  // Dummy function for sales refresh (replace with your actual sales refresh logic if needed)
  const refreshSales = () => {
    // e.g., call fetchDashboardStats() or similar
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Real-time updates with Socket.io
  useEffect(() => {
    if (!vendorId) return;
    const sock = io(SOCKET_URL, { withCredentials: true });
    sock.emit('join', { room: `vendor_${vendorId}` });
    sock.on('vendor_notification', (data) => {
      setNotifications(prev => [data.notification, ...prev]);
    });
    return () => sock.disconnect();
  }, [vendorId]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Mark all as read
  const markAllAsRead = async () => {
    await Promise.all(
      notifications.filter(n => !n.isRead).map(n =>
        markNotificationAsRead(n._id)
      )
    );
    fetchNotifications();
  };

  // Handle notification click
  const handleNotificationClick = (notif) => {
    // Only open modal if orderId exists
    const orderId = notif.orderId?._id || notif.orderId;
    if (orderId) setSelectedOrderId(orderId);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
    <button
      onClick={() => setShowDropdown(s => !s)}
      style={{ fontSize: '1.5em', position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}
      aria-label="Notifications"
    >
      🔔
      {unreadCount > 0 && (
        <span style={{
          background: 'red',
          color: 'white',
          borderRadius: '50%',
          padding: '2px 7px',
          fontSize: '0.8em',
          position: 'absolute',
          top: '-8px',
          right: '-8px'
        }}>
          {unreadCount}
        </span>
      )}
    </button>
      {showDropdown && (
        <div style={{
          position: 'absolute',
          right: 0,
          background: '#fff',
          border: '1px solid #ccc',
          width: '350px',
          zIndex: 1000,
          maxHeight: '350px',
          overflowY: 'auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <button onClick={markAllAsRead} style={{ width: '100%', padding: '8px', background: '#f5f5f5', border: 'none' }}>
            Mark all as read
          </button>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {loading && <li style={{ padding: '10px' }}>Loading...</li>}
            {!loading && notifications.length === 0 && <li style={{ padding: '10px' }}>No notifications yet.</li>}
            {notifications.map((notif, idx) => (
              <li key={notif._id || idx} style={{
                padding: '10px',
                background: notif.isRead ? '#f9f9f9' : '#e6f7ff',
                borderBottom: '1px solid #eee',
                cursor: notif.orderId ? 'pointer' : 'default'
              }}
                onClick={() => handleNotificationClick(notif)}
              >
                <strong>{notif.title}</strong><br />
                {notif.message}<br />
                {notif.productId && (
                  <span>
                    Product: {typeof notif.productId === 'object'
                      ? notif.productId.title || notif.productId._id
                      : notif.productId}
                  </span>
                )}<br />
                {notif.amount && <span>Amount: ₹{notif.amount}</span>}<br />
                {notif.quantity && <span>Quantity: {notif.quantity}</span>}<br />
                {notif.orderId && (
                  <span>
                    Order ID: {typeof notif.orderId === 'object'
                      ? notif.orderId._id
                      : notif.orderId}
                  </span>
                )}<br />
                <span style={{ fontSize: '0.8em', color: '#888' }}>{new Date(notif.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onStatusChange={() => {
            fetchNotifications();
            if (onSalesRefresh) onSalesRefresh();
          }}
        />
      )}
    </div>
  );
};

export default VendorNotificationBadge; 