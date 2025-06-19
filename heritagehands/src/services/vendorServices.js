import axios from '../axios/axiosinstance';

// Vendor Registration
export const vendorRegister = async (vendorData) => {
    try {
        const response = await axios.post('/vendor/register', vendorData);
        return response;
    } catch (error) {
        throw error;
    }
};

// Vendor Login
export const vendorLogin = async (loginData) => {
    try {
        const response = await axios.post('/vendor/login', loginData);
        return response;
    } catch (error) {
        throw error;
    }
};

// Vendor Logout
export const vendorLogout = async () => {
    try {
        const response = await axios.post('/vendor/logout');
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
        formData.append('image', productData.image);

        const response = await axios.post('/vendor/products', formData, {
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
        const response = await axios.get('/vendor/products');
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
        if (productData.image) {
            formData.append('image', productData.image);
        }

        const response = await axios.put(`/vendor/products/${productId}`, formData, {
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
        const response = await axios.delete(`/vendor/products/${productId}`);
        return response;
    } catch (error) {
        throw error;
    }
}; 