import axiosInstance from '../axios/axiosinstance';

// Get all products
export const listProducts = () => {
    return axiosInstance.get('/v1/product/listproducts');
}

// Get a single product by its ID
export const getProductById = (productId) => {
    return axiosInstance.get(`/v1/product/productdetails/${productId}`);
} 