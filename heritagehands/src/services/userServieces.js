
import axiosInstance from '../axios/axiosinstance';


export const listProducts =()=>{
    return axiosInstance.get('http://localhost:5000/api/products')
}


