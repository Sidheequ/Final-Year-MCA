import axiosInstance from '../axios/axiosinstance';

export const userSignUp = async (data) => {
    try {
        console.log("userSignUp called with data:", data);
        const response = await axiosInstance.post('/user/register', data);
        return response;
    } catch (error) {
        console.error('User signup error:', error);
        throw error;
    }
}

export const userLogin = async (data) => {
    try {
        console.log("userLogin called with data:", data);
        const response = await axiosInstance.post('/user/login', data);
        return response;
    } catch (error) {
        console.error('User login error:', error);
        throw error;
    }
}

export const userLogout = async () => {
    try {
        const response = await axiosInstance.post('/user/logout');
        return response;
    } catch (error) {
        console.error('User logout error:', error);
        throw error;
    }
}

export const adminLogin = async (data) => {
    try {
        console.log("adminLogin called with data:", data);
        const response = await axiosInstance.post('/admin/login', data);
        return response;
    } catch (error) {
        console.error('Admin login error:', error);
        throw error;
    }
}

export const adminLogout = async () => {
    try {
        const response = await axiosInstance.post('/admin/logout');
        return response;
    } catch (error) {
        console.error('Admin logout error:', error);
        throw error;
    }
}

// Add product to cart (backend integration)
export const addProductToCart = async (productId, quantity = 1) => {
    try {
        const response = await axiosInstance.post(`/cart/addtocart/${productId}`, { quantity });
        return response;
    } catch (error) {
        console.error('Add to cart error:', error);
        throw error;
    }
}

// Fetch current user's cart
export const fetchUserCart = async () => {
    try {
        const response = await axiosInstance.get('/cart/mycart');
        return response;
    } catch (error) {
        console.error('Fetch cart error:', error);
        throw error;
    }
}

// Update user password
export const updatePassword = async (passwordData) => {
    try {
        const response = await axiosInstance.patch('/user/update-password', passwordData);
        return response;
    } catch (error) {
        console.error('Update password error:', error);
        throw error;
    }
}

// Remove product from cart
export const removeFromCart = async (productId) => {
    try {
        const response = await axiosInstance.delete(`/cart/remove/${productId}`);
        return response;
    } catch (error) {
        console.error('Remove from cart error:', error);
        throw error;
    }
}

// Update product quantity in cart
export const updateCartItemQuantity = async (productId, quantity) => {
    try {
        const response = await axiosInstance.patch(`/cart/update/${productId}`, { quantity });
        return response;
    } catch (error) {
        console.error('Update cart quantity error:', error);
        throw error;
    }
}

// Get user profile data
export const getUserProfile = async () => {
    try {
        const response = await axiosInstance.get('/user/profile');
        return response;
    } catch (error) {
        console.error('Get user profile error:', error);
        throw error;
    }
};

// Get user order statistics
export const getOrderStats = async () => {
    try {
        const response = await axiosInstance.get('/order/stats');
        return response;
    } catch (error) {
        console.error('Get order stats error:', error);
        throw error;
    }
};

// Get all orders for a user
export const getUserOrders = async () => {
    try {
        const response = await axiosInstance.get('/order');
        return response;
    } catch (error) {
        console.error('Get user orders error:', error);
        throw error;
    }
};

// Update user's shipping address
export const updateUserAddress = async (addressData) => {
    try {
        const response = await axiosInstance.patch('/user/address', addressData);
        return response;
    } catch (error) {
        console.error('Update user address error:', error);
        throw error;
    }
};

// Utility function to clear user session
export const clearUserSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // You can also clear Redux state here if needed
    window.location.href = '/login';
};