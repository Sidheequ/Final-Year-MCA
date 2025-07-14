import React, { useState, useEffect } from 'react';
import { getVendorSalesReport, exportSalesReport } from '../../services/vendorServices';
import './VendorSalesReport.css';

const VendorSalesReport = () => {
    const [sales, setSales] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchSalesReport();
    }, [page, filters]);

    const fetchSalesReport = async () => {
        try {
            setLoading(true);
            const params = {
                page,
                limit: 20,
                ...filters
            };

            console.log('Current token:', localStorage.getItem('token'));
            const response = await getVendorSalesReport(params);
            setSales(response.sales);
            setSummary(response.summary);
            setTotalPages(response.totalPages);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch sales report');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const params = {
                startDate: filters.startDate,
                endDate: filters.endDate,
                format: 'csv'
            };
            const blob = await exportSalesReport(params);
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sales-report-${filters.startDate}-${filters.endDate}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error exporting sales report:', err);
            alert('Failed to export sales report');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatPercentage = (value) => {
        return `${value}%`;
    };

    if (loading && sales.length === 0) {
        return (
            <div className="vendor-sales-report">
                <div className="sales-header">
                    <h2>Sales Report</h2>
                    <div className="sales-filters">
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                            placeholder="Start Date"
                        />
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                            placeholder="End Date"
                        />
                        <button onClick={handleExport} className="export-btn">
                            Export CSV
                        </button>
                    </div>
                </div>
                <div className="loading-skeleton">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="sales-skeleton">
                            <div className="skeleton-product"></div>
                            <div className="skeleton-details">
                                <div className="skeleton-line"></div>
                                <div className="skeleton-line"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="vendor-sales-report">
            <div className="sales-header">
                <h2>Sales Report</h2>
                <div className="sales-filters">
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                        placeholder="Start Date"
                    />
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                        placeholder="End Date"
                    />
                    <button onClick={handleExport} className="export-btn">
                        Export CSV
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Sales Summary */}
            <div className="sales-summary">
                <div className="summary-card">
                    <h3>Total Sales</h3>
                    <p className="summary-value">{formatAmount(summary.totalSales || 0)}</p>
                </div>
                <div className="summary-card">
                    <h3>Total Earnings</h3>
                    <p className="summary-value earnings">{formatAmount(summary.totalEarnings || 0)}</p>
                </div>
                <div className="summary-card">
                    <h3>Total Orders</h3>
                    <p className="summary-value">{summary.totalOrders || 0}</p>
                </div>
                <div className="summary-card">
                    <h3>Commission Paid</h3>
                    <p className="summary-value commission">{formatAmount(summary.totalCommission || 0)}</p>
                </div>
            </div>

            {/* Sales Table */}
            <div className="sales-table-container">
                <table className="sales-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Order ID</th>
                            <th>Product</th>
                            <th>Customer</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total Amount</th>
                            <th>Available Stock</th>
                            <th>Sold Stock</th>
                            <th>Commission</th>
                            <th>Earnings</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale) => (
                            <tr key={sale._id}>
                                <td>{formatDate(sale.orderDate)}</td>
                                <td className="order-id">{sale.orderId._id}</td>
                                <td className="product-name">
                                    <div className="product-info">
                                        <span>{sale.productName}</span>
                                    </div>
                                </td>
                                <td>{sale.customerName}</td>
                                <td>{sale.quantity}</td>
                                <td>{formatAmount(sale.unitPrice)}</td>
                                <td className="total-amount">{formatAmount(sale.totalAmount)}</td>
                                <td>{sale.productId && typeof sale.productId.quantity === 'number' ? sale.productId.quantity : 'N/A'}</td>
                                <td>{sale.productId && typeof sale.productId.sold === 'number' ? sale.productId.sold : 'N/A'}</td>
                                <td className="commission">{formatPercentage(sale.commission)}</td>
                                <td className="earnings">{formatAmount(sale.vendorEarnings)}</td>
                                <td>
                                    <span className={`status ${sale.paymentStatus}`}>
                                        {sale.paymentStatus}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {sales.length === 0 && !loading && (
                <div className="no-sales">
                    <div className="no-sales-icon">📊</div>
                    <h3>No sales data</h3>
                    <p>No sales found for the selected date range.</p>
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

export default VendorSalesReport; 