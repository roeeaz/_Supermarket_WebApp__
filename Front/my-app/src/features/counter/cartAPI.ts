import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addToCart = async (productId: number, userToken: string) => {
    const response = await axios.post(
        'https://roee-supermarket-rol8.onrender.com/cart/',
        { product_id: productId }, 
        { headers: { 'Authorization': `Bearer ${userToken}` } }
    );
    return response.data;
}

export const fetchUserCart = async (userToken: string) => {
    const response = await axios.get(
        'https://roee-supermarket-rol8.onrender.com/cart/',
        { headers: { 'Authorization': `Bearer ${userToken}` } }
    );
    return response.data;
}


export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantity',
  async ({ cartItemId, newQuantity, userToken }: { cartItemId: number, newQuantity: number, userToken: string }) => {
    ;
    try {
      const response = await axios.patch(
        `https://roee-supermarket-rol8.onrender.com/cartitem/${cartItemId}/`,
        { quantity: newQuantity },
        { headers: { 'Authorization': `Bearer ${userToken}` } }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);


export const removeItemFromCart = async ({cartItemId, userToken}: {cartItemId: number, userToken: string}) => {
  const response = await axios.delete(`https://roee-supermarket-rol8.onrender.com/cartitem/${cartItemId}/`, {
      headers: {
          Authorization: `Bearer ${userToken}`
      },
  });
  return response.data;
}



export const clearCart = async (userToken: string) => {
  const response = await axios.delete('https://roee-supermarket-rol8.onrender.com/cart/clear/', {
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  });
  return response.data;
}



