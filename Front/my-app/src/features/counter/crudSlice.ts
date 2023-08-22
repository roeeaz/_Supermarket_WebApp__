import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Product } from '../../Models/Product';
import {getAll,add } from './crudAPI';

export interface loginState {
    logged: boolean,
    products:Product[]    
}

const initialState: loginState = {
    logged: false,
    products: []
};

export const getAllAsync = createAsyncThunk(
    'CRUD/getAll',
    async () => {
        console.log("test");
        const response = await getAll();
        return response.data;
    }
);
export const delAsync = createAsyncThunk(
    'CRUD/deleteProd',
    async (id:number) => {
        console.log("ttttttttttttttttttttttttttttttttttttttttttest",id);
        return id;
    }
);
export const addAsync = createAsyncThunk(
    'CRUD/add',
    async (product:Product) => {
        console.log("addddd");
        const response = await add(product);
        return response.data;
    }
);
export const updAsync = createAsyncThunk(
    'CRUD/add',
    async (product:Product) => {
        console.log("addddd");
        const response = await add(product);
        return response.data;
    }
);
export const CRUDSlice = createSlice({
    name: 'CRUD',
    initialState,
    reducers: {
        logout: (state) => {
            state.logged=false
           
            sessionStorage.clear()
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllAsync.fulfilled, (state, action) => {
                console.log(action.payload);
                state.products=action.payload
            }).addCase(addAsync.fulfilled, (state, action) => {
                console.log(action.payload);
                 state.products.push(action.payload)
            }).addCase(delAsync.fulfilled, (state, action) => {
                console.log(action.payload);
                 state.products= state.products.filter(pro => pro.id !== action.payload)
            })
    },
});

export const { logout } = CRUDSlice.actions;
export const selectProducts = (state: RootState) => state.CRUD.products;
export default CRUDSlice.reducer;
