import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// get user from local storage, parse from string to JSON
const user = JSON.parse(localStorage.getItem("user"));

// define initial auth state w/ found user (if found)
const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

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

// reducer to reset auth state to initial values
const authReset = (state) => {
  state.isLoading = false;
  state.isSuccess = false;
  state.isError = false;
  state.message = "";
};

// define initial slice object 'auth' with reset reducer
export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    'reset': authReset,
  },
  extraReducers: (builder) => {
    builder
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
  },
});

// export the reset function from authSlice
export const { reset } = authSlice.actions;

// export the authslice reducer for store.js
export default authSlice.reducer;
