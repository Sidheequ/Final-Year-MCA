import React from 'react';

const RecentOrders = () => {
  // This will be replaced with actual data from the database
  const orders = [
    {
      id: 1,
      customer: 'John Doe',
      product: 'Handmade Pottery',
      amount: '$120',
      status: 'Delivered',
      date: '2024-03-15',
    },
    {
      id: 2,
      customer: 'Jane Smith',
      product: 'Traditional Painting',
      amount: '$85',
      status: 'Processing',
      date: '2024-03-14',
    },
    {
      id: 3,
      customer: 'Mike Johnson',
      product: 'Wooden Sculpture',
      amount: '$200',
      status: 'Shipped',
      date: '2024-03-13',
    },
    {
      id: 4,
      customer: 'Sarah Wilson',
      product: 'Handwoven Textile',
      amount: '$150',
      status: 'Delivered',
      date: '2024-03-12',
    },
  ];

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      default:
        return '';
    }
  };

  return (
    <div className="admin-card">
      <h2>Recent Orders</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.product}</td>
              <td>{order.amount}</td>
              <td>
                <span className={`status ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td>{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders; 