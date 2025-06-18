import React, { useState } from 'react';

const ProductManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });

  // This will be replaced with actual data from the database
  const products = [
    {
      id: 1,
      name: 'Handmade Pottery',
      category: 'Pottery',
      price: '$120',
      stock: 15,
      status: 'In Stock',
    },
    {
      id: 2,
      name: 'Traditional Painting',
      category: 'Art',
      price: '$85',
      stock: 8,
      status: 'Low Stock',
    },
    {
      id: 3,
      name: 'Wooden Sculpture',
      category: 'Sculpture',
      price: '$200',
      stock: 5,
      status: 'Low Stock',
    },
    {
      id: 4,
      name: 'Handwoven Textile',
      category: 'Textile',
      price: '$150',
      stock: 20,
      status: 'In Stock',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement product addition logic
    console.log('New product:', newProduct);
    setShowAddForm(false);
    setNewProduct({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
    });
  };

  return (
    <div className="admin-card">
      <div className="card-header">
        <h2>Product Management</h2>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showAddForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Price</label>
            <input
              type="text"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={newProduct.stock}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary">
            Add Product
          </button>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>#{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>
                <span
                  className={`status ${
                    product.status === 'In Stock'
                      ? 'status-success'
                      : 'status-warning'
                  }`}
                >
                  {product.status}
                </span>
              </td>
              <td>
                <button className="admin-btn">Edit</button>
                <button className="admin-btn admin-btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement; 