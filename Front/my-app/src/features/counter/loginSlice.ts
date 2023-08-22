import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';
import { login, testAbout, testContact } from './loginAPI';


export interface loginState {
    logged: boolean,
    token: string,
    errorMessage: string,
}

const initialState: loginState = {
    logged: false,
    token: '',
    errorMessage: '',
};


interface AxiosErrorType {
    response?: {
        data: {
            detail: string;
        }
    }
}

export const loginAsync = createAsyncThunk(
    'login/login',
    async (user: any, { rejectWithValue }) => {
        try {
            const response = await login(user);

            if (response.data.access.length === 0) {
                return rejectWithValue('Authentication failed.');
            }

            return response.data;
        } catch (err) {
            const error: AxiosErrorType = err as any; 
            if (error.response?.data?.detail) {
                if (error.response.data.detail === "No active account found with the given credentials") {
                    return rejectWithValue('משתמש לא קיים');
                } else {
                    return rejectWithValue(error.response.data.detail);
                }
            } else {
                return rejectWithValue('An error occurred.');
            }
        }
    }
);





export const aboutAsync = createAsyncThunk(
    'login/about',
    async () => {
        const token: string = sessionStorage.getItem('token') || '';
        const response = await testAbout(token);
        return response.data;
    }
);
export const contactAsync = createAsyncThunk(
    'login/contact',
    async () => {
        const response = await testContact();
        return response.data;
    }
);
export const updateDetailsAsync = createAsyncThunk(
    'login/updateDetails',
    async (newDetails: any) => {
        const token: string = sessionStorage.getItem('token') || '';
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const updatedDetails = { newUsername: newDetails.newUsername, newPassword: newDetails.newPassword };
        const response = await axios.put("https://roee-supermarket-04ji.onrender.com/update_user/", updatedDetails);
        return response.data;
    }
);

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        logout: (state) => {
            state.logged = false;
            state.token = "";
            sessionStorage.clear();
            delete axios.defaults.headers.common['Authorization'];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.fulfilled, (state, action) => {
                if (action.payload.access.length > 0) {
                    state.logged = true;
                    state.token = action.payload.access;
                    sessionStorage.setItem('token', state.token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.access}`;
                }
            })
            .addCase(loginAsync.rejected, (state, action) => {
                if (action.payload) {
                    if (typeof action.payload === 'string') {
                        state.errorMessage = action.payload;
                    }
                } else {

                    if (action.error.message) {
                        state.errorMessage = action.error.message;
                    } else {
                        state.errorMessage = "An error occurred.";
                    }
                }

            })
            .addCase(updateDetailsAsync.fulfilled, (state, action) => {
            })
            .addCase(updateDetailsAsync.rejected, (state, action) => {
            })

    },
});
export const selectErrorMessage = (state: RootState) => state.login.errorMessage;
export const selectIsLoggedIn = (state: RootState) => state.login.logged;
export const { logout } = loginSlice.actions;
export const selectLogged = (state: RootState) => state.login.logged;
export default loginSlice.reducer;
