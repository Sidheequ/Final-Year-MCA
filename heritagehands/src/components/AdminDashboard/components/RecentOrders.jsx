import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../../services/adminServices';
import { toast } from 'react-toastify';

const RecentOrders = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        setRecentOrders(response.data.recentOrders || []);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
        toast.error('Failed to load recent orders');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div className="recent-orders">
        <h3>Recent Orders</h3>
        <div className="loading-skeleton">
          {[1, 2, 3, 4, 5].map((id) => (
            <div key={id} className="order-skeleton">
              <div className="skeleton-order-id"></div>
              <div className="skeleton-customer"></div>
              <div className="skeleton-amount"></div>
              <div className="skeleton-status"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="recent-orders">
      <h3>Recent Orders</h3>
      {recentOrders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        <div className="orders-list">
          {recentOrders.map((order) => (
            <div key={order._id} className="order-item">
              <div className="order-header">
                <div className="order-id">
                  <strong>Order #{order._id.substring(0, 8)}...</strong>
                </div>
                <div className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="order-customer">
                <strong>Customer:</strong> {order.userId?.name || 'Unknown'} ({order.userId?.email || 'No email'})
              </div>
              
              <div className="order-products">
                <strong>Products:</strong>
                <div className="products-list">
                  {order.products.map((product, index) => (
                    <div key={index} className="product-item">
                      <img 
                        src={product.productId?.image || '/placeholder-image.jpg'} 
                        alt={product.productId?.title || 'Product'} 
                        className="product-image"
                      />
                      <span className="product-title">
                        {product.productId?.title || 'Unknown Product'}
                      </span>
                      <span className="product-quantity">x{product.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="order-footer">
                <div className="order-amount">
                  <strong>Total: ₹{order.totalAmount.toFixed(2)}</strong>
                </div>
                <div className={`order-status ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentOrders; 