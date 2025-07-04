import axiosInstance from '../axios/axiosinstance';

// Vendor Registration
export const vendorRegister = async (vendorData) => {
    try {
        const response = await axiosInstance.post('/vendor/register', vendorData);
        return response;
    } catch (error) {
        throw error;
    }
};

// Vendor Login
export const vendorLogin = async (loginData) => {
    try {
        const response = await axiosInstance.post('/vendor/login', loginData);
        return response;
    } catch (error) {
        throw error;
    }
};

// Vendor Logout
export const vendorLogout = async () => {
    try {
        const response = await axiosInstance.post('/vendor/logout');
        return response;
    } catch (error) {
        throw error;
    }
};

// Create Product (Vendor)
export const createVendorProduct = async (productData) => {
    try {
        const formData = new FormData();
        formData.append('title', productData.title);
        formData.append('description', productData.description);
        formData.append('category', productData.category);
        formData.append('price', productData.price);
        formData.append('quantity', productData.quantity);
        formData.append('image', productData.image);

        const response = await axiosInstance.post('/vendor/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// Get Vendor's Products
export const getVendorProducts = async () => {
    try {
        const response = await axiosInstance.get('/vendor/products');
        return response;
    } catch (error) {
        throw error;
    }
};

// Update Product (Vendor)
export const updateVendorProduct = async (productId, productData) => {
    try {
        const formData = new FormData();
        formData.append('title', productData.title);
        formData.append('description', productData.description);
        formData.append('category', productData.category);
        formData.append('price', productData.price);
        formData.append('quantity', productData.quantity);
        if (productData.image) {
            formData.append('image', productData.image);
        }

        const response = await axiosInstance.put(`/vendor/products/${productId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// Delete Product (Vendor)
export const deleteVendorProduct = async (productId) => {
    try {
        const response = await axiosInstance.delete(`/vendor/products/${productId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Vendor Notification Services
export const getVendorNotifications = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/vendor/notifications', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await axiosInstance.put(`/vendor/notifications/${notificationId}/read`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Vendor Sales Report Services
export const getVendorSalesReport = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/vendor/sales-report', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const exportSalesReport = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/vendor/sales-report/export', { 
            params,
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Vendor Dashboard Services
export const getVendorDashboardStats = async () => {
    try {
        const response = await axiosInstance.get('/vendor/dashboard-stats');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateNotificationPreferences = async (preferences) => {
    try {
        const response = await axiosInstance.put('/vendor/notification-preferences', preferences);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}; 