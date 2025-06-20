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