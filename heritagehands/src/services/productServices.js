import axiosInstance from '../axios/axiosinstance';

// Get all products
export const listProducts = () => {
    return axiosInstance.get('/product/listproducts');
}

// Get a single product by its ID
export const getProductById = (productId) => {
    return axiosInstance.get(`/product/productdetails/${productId}`);
} 