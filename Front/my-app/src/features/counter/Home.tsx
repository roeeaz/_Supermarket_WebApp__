import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css';
import { useDispatch } from 'react-redux';
import { addToCartAsync } from './cartSlice'; 
import { unwrapResult } from '@reduxjs/toolkit';
import { AppDispatch } from '../../app/store'; 
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ff1 from './images/ff1.png';
import fruitslogoo from './images/fruitslogoo.png';
import benefits1 from './images/benefits1.jpg';
import benefits2 from './images/benefits2.jpg';








interface Discount {
  id: number;
  product: number;
  discount_value: number;
  discount_type: string;
  quantity_threshold: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  discount: Discount | null;
}

function HomePage() {
  const dispatch: AppDispatch = useDispatch(); 
  const [products, setProducts] = useState<Product[]>([]);


  useEffect(() => {
    axios.get('https://roee-supermarket-04ji.onrender.com/discounted_products/')
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, []);

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
    <div className="home-page">
      <Carousel>
        <div>
    <img className="img6" src={benefits2} alt="Legend 2" />
    <img className="img7" src={benefits1} alt="Legend 2" />
</div>

        <div>
          <img className="img3" src={ff1} alt="Legend 3" />
          <img className="img4" src="https://i.pinimg.com/1200x/87/9c/0f/879c0f7aa78966083fbf7964e411d70a.jpg" alt="Legend 3" />
          <img className="img5" src={fruitslogoo} alt="Legend 3" />
          

          
        </div>
      </Carousel>
      <h1>מבצעים</h1>
      <div className="product-list">
        {products.map(product => {
          let finalPrice = parseFloat(product.price);
          if (product.discount && product.discount.discount_type === "FLAT_RATE") {
            finalPrice = finalPrice - product.discount.discount_value;
          }

          return (
            <div key={product.id} className="product-card">
              <img src={product.image_url} alt={product.name} />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p className="original-price">{product.price}₪</p>
              <p className="discounted-price">{finalPrice.toFixed(2)}₪</p>
              <button onClick={() => addToCart(product.id)}>הוסף לסל</button> {/* add the addToCart button */}
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default HomePage;
