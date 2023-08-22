import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addToCartAsync } from './cartSlice';
import './ProductList.css';
import { unwrapResult } from '@reduxjs/toolkit';
import { AppDispatch } from '../../app/store';



export type Discount = {
    discount_type: string;
    discount_value: number;
    quantity_threshold: number;
};


export type Product = {
    discount: Discount | null;
    id: number;
    name: string;
    description: string;
    price: number;
    category: number;
    image_url: string;
};

const ProductList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch()
    const [products, setProducts] = useState<Product[]>([]);
    const { id } = useParams<{ id: string }>();


    useEffect(() => {
        axios.get(`https://roee-supermarket-rol8.onrender.com/category/${id}/products/`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => console.error(`Error: ${error}`));
    }, [id]);


    const addToCart = async (productId: number) => {
        const token = sessionStorage.getItem('token') || '';
        try {
            const addToCartResultAction = await dispatch(addToCartAsync({ productId, userToken: token }));
            unwrapResult(addToCartResultAction);
        } catch (err) {
            console.error(err);
        }
    };




    return (
        <div className="container">
            {products.map(product => (
  <div className="product-card" key={product.id}>
    <h2>{product.name}</h2>
    <p>{product.description}</p>
    
    {product.discount ? (
  <>
    <h2 className="original-price"> ₪ {product.price}</h2>
    <h2 className="discounted-price">₪ {(product.price - product.discount.discount_value).toFixed(2)}</h2>
  </>
) : (
  <h2>₪ {product.price}</h2>
)}

    
    <img src={product.image_url || ''} alt={product.name || ''} style={{ width: '100%' }} />
    <button onClick={async () => await addToCart(product.id)}>הוסף לסל</button>
  </div>
))}

        </div>
    );
};

export default ProductList;
