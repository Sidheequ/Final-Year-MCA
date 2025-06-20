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