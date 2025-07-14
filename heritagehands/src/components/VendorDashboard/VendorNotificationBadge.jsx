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
        <button onClick={() => handleStatusUpdate('Shipped')} style={{ marginRight: 8, backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>Mark as Shipped</button>
        <button onClick={() => handleStatusUpdate('Delivered')} style={{ marginRight: 8, backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>Mark as Delivered</button>
        <button onClick={onClose} style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>Close</button>
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

  // Filter for admin-related notifications
  const adminNotificationTypes = ['admin_product_status', 'product_approved', 'product_rejected'];
  const adminNotifications = notifications.filter(n => adminNotificationTypes.includes(n.type));

  return (
    <div className="vendor-notification-badge">
      <button
        style={{ position: 'relative', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}
        onClick={() => setShowDropdown((prev) => !prev)}
        title="Admin Notifications"
      >
        Admin Notifications
        {adminNotifications.length > 0 && (
          <span style={{ position: 'absolute', top: 2, right: 2, background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>
            {adminNotifications.length}
          </span>
        )}
      </button>
      {showDropdown && (
        <div className="notification-dropdown" style={{ position: 'absolute', top: '110%', right: 0, background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', borderRadius: 8, minWidth: 280, zIndex: 100 }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>Admin Product Notifications</div>
          {adminNotifications.length === 0 ? (
            <div style={{ padding: '1rem', color: '#6b7280', textAlign: 'center' }}>No admin notifications.</div>
          ) : (
            adminNotifications.map((notif) => (
              <div key={notif._id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ fontWeight: 600 }}>{notif.title}</div>
                <div style={{ fontSize: 14 }}>{notif.message}</div>
                {notif.status && <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Status: {notif.status}</div>}
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{new Date(notif.createdAt).toLocaleString()}</div>
              </div>
            ))
          )}
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