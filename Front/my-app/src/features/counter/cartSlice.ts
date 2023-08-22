import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addToCart, fetchUserCart, updateQuantityAsync,removeItemFromCart,clearCart } from './cartAPI';
import { Product } from '../counter/ProductList';

type CartItem = {
  price: number;
  id: number;
  product: Product;
  quantity: number;
  final_price: number; 
};

type CartState = CartItem[];

const initialState: CartState = [];

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, userToken }: { productId: number, userToken: string }) => {
    const response = await addToCart(productId, userToken);
    return response;
  }
);

export const fetchUserCartAsync = createAsyncThunk(
  'cart/fetchUserCart',
  async (userToken: string) => {
    const response = await fetchUserCart(userToken);
    return response;
  }
);

export const removeItemFromCartAsync = createAsyncThunk(
  'cart/removeItemFromCart',
  async ({ cartItemId, userToken }: { cartItemId: number, userToken: string }, thunkAPI) => {
    const response = await removeItemFromCart({ cartItemId, userToken });
    return response;
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (userToken: string, thunkAPI) => {
    const response = await clearCart(userToken);
    return response;
  }
);



const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    logout: () => initialState,  
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        return action.payload.cartitems;
      })
      .addCase(fetchUserCartAsync.fulfilled, (state, action) => {
        return action.payload.cartitems;
      })
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        const index = state.findIndex(cartItem => cartItem.product.id === action.payload.product.id);
        state[index] = action.payload;
      })
      .addCase(clearCartAsync.fulfilled, (state, action) => {
        return initialState;
      })
      
  },
});

export const { logout } = cartSlice.actions; 

export default cartSlice.reducer;
