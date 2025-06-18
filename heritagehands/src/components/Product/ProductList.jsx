import React from 'react';
import './ProductList.css';
import Card from './Card';
// import axios from 'axios';
import { useEffect,useState } from 'react';
import { listProducts } from '../../services/userServieces'; // Adjust the import path as necessary


const ProductList = () => {
     const [products, setProducts] = useState([])
    useEffect(() => {
        listProducts().then((res) => {
            console.log(res)
            setProducts(res.data)
        }).catch((err) => console.log(err)
        )
    }, [])
  return (

<div className="product-list-wrapper grid grid-cols-1 md:grid-cols-3 gap-1">
      <div className="product-list-container1">
        <Card />
      </div>
      <div className="product-list-container2">
        <Card />
      </div>
      <div className="product-list-container3">
        <Card />
      </div>
    </div>
  );
};

export default ProductList;
