import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import loginReducer from '../features/counter/loginSlice';
import registerReducer from '../features/counter/registerSlice';
import CRUDReducer from '../features/counter/crudSlice';
import cartReducer from '../features/counter/cartSlice'; 
import profileReducer from '../features/counter/userprofileslice'; 

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    login: loginReducer,
    register:registerReducer,
    CRUD:CRUDReducer,
    cart: cartReducer, 
    profile:profileReducer
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<

  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
