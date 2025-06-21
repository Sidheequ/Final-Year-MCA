import React, { useState, useEffect } from 'react';
import { getSalesAnalytics, getAllOrders } from '../../../services/adminServices';
import { toast } from 'react-toastify';
import { FaChartLine, FaCalendarAlt, FaDollarSign, FaShoppingCart, FaDownload } from 'react-icons/fa';

const SalesReport = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, ordersRes] = await Promise.all([
        getSalesAnalytics(period),
        getAllOrders()
      ]);
      setAnalyticsData(analyticsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast.error('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalSales = () => {
    return analyticsData.reduce((total, item) => total + item.totalSales, 0);
  };

  const calculateTotalOrders = () => {
    return analyticsData.reduce((total, item) => total + item.orderCount, 0);
  };

  const calculateAverageOrderValue = () => {
    const totalSales = calculateTotalSales();
    const totalOrders = calculateTotalOrders();
    return totalOrders > 0 ? totalSales / totalOrders : 0;
  };

  const formatDate = (year, month, day) => {
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString();
  };

  const getTopProducts = () => {
    const productSales = {};
    orders.forEach(order => {
      order.products.forEach(product => {
        const productId = product.productId?._id || 'unknown';
        const productName = product.productId?.title || 'Unknown Product';
        if (!productSales[productId]) {
          productSales[productId] = {
            name: productName,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[productId].quantity += product.quantity;
        productSales[productId].revenue += product.price * product.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const exportReport = () => {
    // TODO: Implement CSV/PDF export functionality
    toast.info('Export functionality will be implemented');
  };

  if (loading) {
    return (
      <div className="admin-content-section">
        <div className="section-header">
          <h2>Sales Report</h2>
        </div>
        <div className="loading-skeleton">
          <div className="skeleton-chart"></div>
          <div className="skeleton-summary">
            <div className="skeleton-stat"></div>
            <div className="skeleton-stat"></div>
            <div className="skeleton-stat"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content-section">
      <div className="section-header">
        <h2>Sales Report</h2>
        <button className="admin-btn admin-btn-primary" onClick={exportReport}>
          <FaDownload /> Export Report
        </button>
      </div>

      <div className="filters-section">
        <select 
          className="filter-select" 
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-input"
        />
      </div>

      <div className="sales-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <FaDollarSign />
          </div>
          <div className="summary-content">
            <h3>Total Sales</h3>
            <div className="summary-value">₹{calculateTotalSales().toFixed(2)}</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FaShoppingCart />
          </div>
          <div className="summary-content">
            <h3>Total Orders</h3>
            <div className="summary-value">{calculateTotalOrders()}</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <FaChartLine />
          </div>
          <div className="summary-content">
            <h3>Average Order Value</h3>
            <div className="summary-value">₹{calculateAverageOrderValue().toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="sales-chart-section">
        <h3>Sales Trend</h3>
        {analyticsData.length === 0 ? (
          <div className="no-data">
            <p>No sales data available for the selected period</p>
          </div>
        ) : (
          <div className="chart-container">
            <div className="chart-bars">
              {analyticsData.map((item, index) => (
                <div key={index} className="chart-bar">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      height: `${(item.totalSales / Math.max(...analyticsData.map(d => d.totalSales))) * 100}%` 
                    }}
                  ></div>
                  <div className="bar-label">
                    {formatDate(item._id.year, item._id.month, item._id.day)}
                  </div>
                  <div className="bar-value">₹{item.totalSales.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="top-products-section">
        <h3>Top Selling Products</h3>
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {getTopProducts().map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>₹{product.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="recent-orders-section">
        <h3>Recent Orders</h3>
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.substring(0, 8)}</td>
                  <td>{order.userId?.name || 'Unknown'}</td>
                  <td>₹{order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReport; 