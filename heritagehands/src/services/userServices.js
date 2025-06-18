import axiosInstance from '../axios/axiosinstance';

export const listProducts = () => {
    console.log('Making API call to:', '/v1/product/listproducts');
    return axiosInstance.get('/v1/product/listproducts');
}

// Test function to verify API connection
// export const testAPI = () => {
//     console.log('Testing API connection...');
//     return axiosInstance.get('/v1/product/listproducts')
//         .then(response => {
//             console.log('API test successful:', response.data);
//             return response;
//         })
//         .catch(error => {
//             console.error('API test failed:', error);
//             throw error;
//         });
// }

// Alternative test using fetch
// export const testWithFetch = () => {
//     console.log('Testing with fetch...');
//     return fetch('http://localhost:5000/api/v1/product/listproducts')
//         .then(response => {
//             console.log('Fetch response status:', response.status);
//             return response.json();
//         })
//         .then(data => {
//             console.log('Fetch data:', data);
//             return data;
//         })
//         .catch(error => {
//             console.error('Fetch error:', error);
//             throw error;
//         });
// }


export const userSignUp = (data) => {
    console.log("userSignUp called with data:", data);
    return axiosInstance.post('/user/register', data)
}