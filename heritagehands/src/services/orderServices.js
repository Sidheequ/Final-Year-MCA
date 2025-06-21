import axiosInstance from '../axios/axiosinstance';

// Create a new order
export const createOrder = async (orderData) => {
    try {
        const response = await axiosInstance.post('/order/create', orderData);
        return response;
    } catch (error) {
        console.error('Create order error:', error);
        throw error;
    }
};

// Get order details
export const getOrderDetails = async (orderId) => {
    try {
        const response = await axiosInstance.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Cancel order
export const cancelOrder = async (orderId) => {
    try {
        const response = await axiosInstance.put(`/orders/${orderId}/cancel`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}; 