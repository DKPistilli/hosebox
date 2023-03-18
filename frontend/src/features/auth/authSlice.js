import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// get user from local storage, parse from string to JSON
const user     = JSON.parse(localStorage.getItem("user"));

// define initial auth state w/ found user (if found)
const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

///
/// ASYNC SLICE FUNCTIONS
///    (register, login, logout)


// Register user
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (err) {
        // set err message from response (if exists)
        const message =
        (err.response && 
            err.response.data &&
            err.response.data.message) ||
        err.message ||
        err.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async (user, thunkAPI) => {
    try {
      return await authService.login(user);
    } catch (err) {
        // set err message from response (if exists)
        const message =
       (err.response && 
            err.response.data &&
            err.response.data.message) ||
        err.message ||
        err.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout User (delete token)
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});


// reducer to reset auth state to initial values
const authReset = (state) => {
  state.isLoading = false;
  state.isSuccess = false;
  state.isError = false;
  state.message = "";
};

///
/// EXPORT AUTH SLICE (and handle logic for above funtions)
///
export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    'reset': authReset,
  },
  extraReducers: (builder) => {
    builder

      // Registration Cases and associated logic (pending, fullfilled, rejected)
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user      = action.payload;

      })
      .addCase(register.rejected, (state, action ) => {
        state.isLoading = false;
        state.isError   = true;
        state.message   = action.payload;
        state.user      = null;
      })

      // Login cases and associated logic (pending, fullfilled, rejected)
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user      = action.payload;

      })
      .addCase(login.rejected, (state, action ) => {
        state.isLoading = false;
        state.isError   = true;
        state.message   = action.payload;
        state.user      = null;
      })

      // Logout case (does not communicate w/ backend, so rejected/pending not required)
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
  },
});

// export the reset function from authSlice
export const { reset } = authSlice.actions;

// export the authslice reducer for store.js
export default authSlice.reducer;
