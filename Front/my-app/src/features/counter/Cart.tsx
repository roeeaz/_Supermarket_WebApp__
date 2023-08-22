import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { clearCartAsync, fetchUserCartAsync, removeItemFromCartAsync } from './cartSlice';
import { updateQuantityAsync } from './cartAPI';
import './Cart.css';
import Login from './Login';
import Register from './Register';
import PaypalButton from './Paypal';
import { fetchUserProfileAsync } from './userprofileslice';

const Cart = () => {
  const dispatch = useAppDispatch();
  const userToken = useAppSelector((state) => state.login.token);
  const isLoggedIn = useAppSelector((state) => state.login.logged);
  const cart = useAppSelector((state) => state.cart);
  const totalSum = parseFloat(cart.reduce((sum, cartItem) => sum + ((cartItem.final_price !== undefined ? cartItem.final_price : cartItem.product.price) * cartItem.quantity), 0).toFixed(3));
  
  useEffect(() => {
    if (userToken && isLoggedIn) {
      dispatch(fetchUserCartAsync(userToken));
      dispatch(fetchUserProfileAsync(userToken)); 
    }
  }, [userToken, isLoggedIn, dispatch]);

  if (!isLoggedIn) {
    return (
      <div className="cart-container">
        <div className="login-container">
          <Login /><hr></hr>
          <Register></Register>
        </div>
        <h3 className="login-prompt">התחבר כדי לראות את עגלת הקניות האישית שלך</h3>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className='login-button'>
        <Login></Login>
      </div>
      <h1 className="cart-title">המוצרים שלי</h1>
      <div className="cart-items">
        {Array.isArray(cart) &&
          cart.map((cartItem: any) => {
            return (
              <div key={cartItem.product.id} className="cart-item">
                <img className="cart-item-image" src={cartItem.product.image_url} alt={cartItem.product.name} />
                <div className="cart-item-details">
                  <h2>{cartItem.product.name}</h2>
                  {cartItem.final_price && cartItem.final_price !== cartItem.product.price ? 
                    <>
                      <p className="cart-item-price">{(cartItem.final_price * cartItem.quantity).toFixed(2)}₪</p>
                      <p className="original-price" style={{ textDecoration: 'line-through' }}>{(cartItem.product.price * cartItem.quantity).toFixed(2)}₪</p>
                    </> : 
                    <p className="cart-item-price">{(cartItem.product.price * cartItem.quantity).toFixed(2)}₪</p>}
                  <p>{cartItem.product.description}</p>
                  <div className="cart-item-quantity">
                    <p>יחידות: {cartItem.quantity}</p>
                    <button onClick={() => dispatch(updateQuantityAsync({ cartItemId: cartItem.id, newQuantity: cartItem.quantity + 1, userToken: userToken }))}>+</button>
                    <button onClick={() => {
                      if (cartItem.quantity === 1) {
                        dispatch(removeItemFromCartAsync({ cartItemId: cartItem.id, userToken: userToken }))
                          .then(() => dispatch(fetchUserCartAsync(userToken))); 
                      } else {
                        dispatch(updateQuantityAsync({ cartItemId: cartItem.id, newQuantity: cartItem.quantity - 1, userToken: userToken }));
                      }
                    }}>-</button>
                  </div>
                </div>
              </div>
            )
            
          })
        }
      </div>
      <div className="cart-total">
        <PaypalButton totalAmount={totalSum} /> 
        <button onClick={() => {
          if (window.confirm('האם הנך מאשר/ת למחוק את סל הקניות שלך?  ')) {
            dispatch(clearCartAsync(userToken));
          }
        }}>
          רוקן סל 
        </button>
      </div>
    </div>
  );
};

export default Cart;
