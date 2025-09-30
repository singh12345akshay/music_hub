import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, User, LoginRequest, RegisterRequest } from '../../api/authApi';

export type { User } from '../../api/authApi';

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Async thunks for authentication
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);

            // Store token in localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            return response.user;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData: RegisterRequest, { rejectWithValue }) => {
        try {
            const response = await authApi.register(userData);

            // Store token in localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            return response.user;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
);

export const checkAuthStatus = createAsyncThunk(
    'auth/checkAuthStatus',
    async () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            const user = JSON.parse(userStr);
            return user;
        }

        throw new Error('No valid session found');
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
                state.user = null;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
                state.user = null;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            // Check auth status
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(checkAuthStatus.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
