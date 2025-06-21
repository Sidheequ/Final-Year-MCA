import React, { useState, useEffect } from 'react';
import { getSalesAnalytics } from '../../../services/adminServices';
import { toast } from 'react-toastify';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getSalesAnalytics(period);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
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

  const formatDate = (year, month, day) => {
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="admin-card">
        <div className="card-header">
          <h2>Sales Analytics</h2>
          <select className="period-select" disabled>
            <option>Loading...</option>
          </select>
        </div>
        <div className="loading-skeleton">
          <div className="skeleton-chart"></div>
          <div className="skeleton-summary">
            <div className="skeleton-stat"></div>
            <div className="skeleton-stat"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="card-header">
        <h2>Sales Analytics</h2>
        <select 
          className="period-select" 
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="analytics-summary">
        <div className="summary-card">
          <h3>Total Sales</h3>
          <div className="summary-value">₹{calculateTotalSales().toFixed(2)}</div>
        </div>
        <div className="summary-card">
          <h3>Total Orders</h3>
          <div className="summary-value">{calculateTotalOrders()}</div>
        </div>
        <div className="summary-card">
          <h3>Average Order Value</h3>
          <div className="summary-value">
            ₹{calculateTotalOrders() > 0 ? (calculateTotalSales() / calculateTotalOrders()).toFixed(2) : '0.00'}
          </div>
        </div>
      </div>

      <div className="analytics-chart">
        <h3>Sales Trend</h3>
        {analyticsData.length === 0 ? (
          <p className="no-data">No sales data available for the selected period</p>
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

      <div className="analytics-table">
        <h3>Detailed Sales Data</h3>
        {analyticsData.length === 0 ? (
          <p className="no-data">No detailed data available</p>
        ) : (
          <table className="analytics-table-content">
            <thead>
              <tr>
                <th>Date</th>
                <th>Sales</th>
                <th>Orders</th>
                <th>Average Order</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((item, index) => (
                <tr key={index}>
                  <td>{formatDate(item._id.year, item._id.month, item._id.day)}</td>
                  <td>₹{item.totalSales.toFixed(2)}</td>
                  <td>{item.orderCount}</td>
                  <td>₹{item.orderCount > 0 ? (item.totalSales / item.orderCount).toFixed(2) : '0.00'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Analytics; 