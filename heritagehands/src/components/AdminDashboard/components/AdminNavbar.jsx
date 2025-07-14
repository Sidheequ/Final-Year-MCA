import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import { getAdminOrderNotifications } from '../../../services/adminServices';
import axiosInstance from '../../../axios/axiosinstance';

const AdminNavbar = ({ onToggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getAdminOrderNotifications({ limit: 10 });
      // Only show order-related notifications (type: 'admin_order_pending')
      setNotifications((res.notifications || []).filter(n => n.type === 'admin_order_pending'));
    } catch (err) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notif) => {
    // Fetch order details
    try {
      const orderId = notif.orderId?._id || notif.orderId;
      const res = await axiosInstance.get(`/admin/orders`); // Get all orders
      const order = (res.data || []).find(o => o._id === orderId);
      setSelectedOrder(order);
      setShowModal(true);
    } catch (err) {
      setSelectedOrder(null);
      setShowModal(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axiosInstance.patch(`/admin/orders/${orderId}/status`, { orderStatus: status });
      // Update the notification in the dropdown to show the new status
      setNotifications((prev) =>
        prev.map((notif) => {
          if ((notif.orderId?._id || notif.orderId) === orderId) {
            return {
              ...notif,
              message: notif.message.replace(/Status: .*/, `Status: ${status}`),
              status: status,
            };
          }
          return notif;
        })
      );
      setShowModal(false);
    } catch (err) {
      // Optionally show error
    }
  };

  return (
    <header className="admin-navbar">
      <div className="navbar-left">
        {/* <button className="navbar-toggle" >
          <FaBars />
        </button> */}
        <div className="navbar-welcome">
          <h2>Welcome, Admin!</h2>
          {/* <p>Manage your e-commerce platform and monitor business performance</p> */}
        </div>
      </div>
      <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div className="navbar-time">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        {/* Admin Order Notification Badge */}
        <div style={{ position: 'relative' }}>
          <button
            style={{ position: 'relative',  color: 'white', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}
            onClick={() => setShowDropdown((prev) => !prev)}
            title="Order Notifications"
          >
            🔔
             {notifications.length > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 2, background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>
                {notifications.length}
              </span>
            )} 
          </button>
          {showDropdown && (
            <div style={{ position: 'absolute', top: '110%', right: 0, background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', borderRadius: 8, minWidth: 320, zIndex: 100 }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>Order Notifications</div>
              {loading ? (
                <div style={{ padding: '1rem', color: '#6b7280', textAlign: 'center' }}>Loading...</div>
              ) : notifications.length === 0 ? (
                <div style={{ padding: '1rem', color: '#6b7280', textAlign: 'center' }}>No order notifications.</div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif._id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }} onClick={() => handleNotificationClick(notif)}>
                    <div style={{ fontWeight: 600 }}>{notif.title}</div>
                    <div style={{ fontSize: 14 }}>{notif.message}</div>
                    {notif.status && <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Status: {notif.status}</div>}
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{new Date(notif.createdAt).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 200 }} onClick={() => setShowModal(false)}>
            <div style={{ background: 'white', borderRadius: 12, maxWidth: 480, margin: '5vh auto', padding: 32, position: 'relative' }} onClick={e => e.stopPropagation()}>
              <h2>Order Details</h2>
              <div style={{ marginBottom: 16 }}>
                <div><strong>Order ID:</strong> {selectedOrder._id}</div>
                <div><strong>Status:</strong> {selectedOrder.orderStatus}</div>
                <div><strong>Customer:</strong> {selectedOrder.userId?.name || 'Unknown'}</div>
                <div><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}</div>
                <div><strong>Created:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                <div><strong>Products:</strong>
                  <ul>
                    {selectedOrder.products.map((p, idx) => (
                      <li key={idx}>{p.productId?.title || 'Product'} x {p.quantity}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                <button style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleStatusChange(selectedOrder._id, 'Shipped')}>Mark as Shipped</button>
                <button style={{ background: '#059669', color: 'white', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleStatusChange(selectedOrder._id, 'Delivered')}>Mark as Delivered</button>
                <button style={{ background: '#6b7280', color: 'white', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }} onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar; 