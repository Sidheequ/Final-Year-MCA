import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = {
  // Products
  getProducts: () => axios.get(`${API_URL}/products`),
  addProduct: (product) => axios.post(`${API_URL}/products`, product),
  updateProduct: (id, product) => axios.patch(`${API_URL}/products/${id}`, product),
  deleteProduct: (id) => axios.delete(`${API_URL}/products/${id}`),

  // Orders
  getOrders: () => axios.get(`${API_URL}/orders`),
  getOrder: (id) => axios.get(`${API_URL}/orders/${id}`),
  updateOrderStatus: (id, status) => axios.patch(`${API_URL}/orders/${id}/status`, { status }),
  getOrderStats: () => axios.get(`${API_URL}/orders/stats/summary`),

  // Dashboard Stats
  getDashboardStats: () => axios.get(`${API_URL}/stats/dashboard`),
};

export default api; 