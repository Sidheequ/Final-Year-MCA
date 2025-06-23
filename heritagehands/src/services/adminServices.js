import axiosInstance from '../axios/axiosinstance';

// Test function to check vendors without auth
export const testGetVendors = async () => {
    try {
        const response = await axiosInstance.get('/admin/test-vendors');
        return response;
    } catch (error) {
        throw error;
    }
};

// Get Dashboard Statistics
export const getDashboardStats = async () => {
    try {
        const response = await axiosInstance.get('/admin/dashboard-stats');
        return response;
    } catch (error) {
        throw error;
    }
};

// Get All Products (Admin)
export const getAllProducts = async () => {
    try {
        const response = await axiosInstance.get('/admin/products');
        return response;
    } catch (error) {
        throw error;
    }
};

// Add New Product (Admin)
export const addProduct = async (productData) => {
    try {
        const response = await axiosInstance.post('/admin/products', productData);
        return response;
    } catch (error) {
        throw error;
    }
};

// Update Product (Admin)
export const updateProduct = async (productId, productData) => {
    try {
        const response = await axiosInstance.put(`/admin/products/${productId}`, productData);
        return response;
    } catch (error) {
        throw error;
    }
};

// Delete Product (Admin)
export const deleteProduct = async (productId) => {
    try {
        const response = await axiosInstance.delete(`/admin/products/${productId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Get All Customers (Admin)
export const getAllCustomers = async () => {
    try {
        const response = await axiosInstance.get('/admin/customers');
        return response;
    } catch (error) {
        throw error;
    }
};

// Get All Orders (Admin)
export const getAllOrders = async () => {
    try {
        const response = await axiosInstance.get('/admin/orders');
        return response;
    } catch (error) {
        throw error;
    }
};

// Get Sales Analytics (Admin)
export const getSalesAnalytics = async (period = 'month') => {
    try {
        const response = await axiosInstance.get(`/admin/analytics?period=${period}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Get All Vendors (Admin)
export const getAllVendors = async () => {
    try {
        const response = await axiosInstance.get('/admin/vendors');
        return response;
    } catch (error) {
        throw error;
    }
};

// Approve Vendor (Admin)
export const approveVendor = async (vendorId) => {
    try {
        const response = await axiosInstance.put(`/admin/vendors/${vendorId}/approve`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Reject Vendor (Admin)
export const rejectVendor = async (vendorId) => {
    try {
        const response = await axiosInstance.put(`/admin/vendors/${vendorId}/reject`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Delete Vendor (Admin)
export const deleteVendor = async (vendorId) => {
    try {
        const response = await axiosInstance.delete(`/admin/vendors/${vendorId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Get All Feedback (Admin)
export const getAllFeedback = async () => {
    try {
        const response = await axiosInstance.get('/admin/feedback');
        return response;
    } catch (error) {
        throw error;
    }
};

// Reply to Feedback (Admin)
export const replyToFeedback = async (feedbackId, replyData) => {
    try {
        const response = await axiosInstance.post(`/admin/feedback/${feedbackId}/reply`, replyData);
        return response;
    } catch (error) {
        throw error;
    }
};

// Delete Feedback (Admin)
export const deleteFeedback = async (feedbackId) => {
    try {
        const response = await axiosInstance.delete(`/admin/feedback/${feedbackId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Get Feedback Statistics (Admin)
export const getFeedbackStats = async () => {
    try {
        const response = await axiosInstance.get('/admin/feedback/stats');
        return response;
    } catch (error) {
        throw error;
    }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axiosInstance.put(`/admin/orders/${orderId}/status`, { status });
        return response;
    } catch (error) {
        throw error;
    }
};

// Get Customer Details (Admin)
export const getCustomerDetails = async (customerId) => {
    try {
        const response = await axiosInstance.get(`/admin/customers/${customerId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Get Vendor Details (Admin)
export const getVendorDetails = async (vendorId) => {
    try {
        const response = await axiosInstance.get(`/admin/vendors/${vendorId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Get Product Details (Admin)
export const getProductDetails = async (productId) => {
    try {
        const response = await axiosInstance.get(`/admin/products/${productId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Export Sales Report (Admin)
export const exportSalesReport = async (period = 'month', format = 'csv') => {
    try {
        const response = await axiosInstance.get(`/admin/reports/sales?period=${period}&format=${format}`, {
            responseType: 'blob'
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// Get System Statistics (Admin)
export const getSystemStats = async () => {
    try {
        const response = await axiosInstance.get('/admin/system-stats');
        return response;
    } catch (error) {
        throw error;
    }
};

// Get Products for a Vendor (Admin)
export const getVendorProductsForAdmin = async (vendorId) => {
    try {
        const response = await axiosInstance.get(`/admin/vendors/${vendorId}/products`);
        return response;
    } catch (error) {
        throw error;
    }
}; 