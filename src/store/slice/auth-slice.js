import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  auth,
  signInWithPopup,
  provider,
  signOutFunc,
} from "../../firebase/firebase.config";
import axios from "axios";
import { toast } from "react-toastify";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = decodeURIComponent(
      atob(base64Url)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(base64);
  } catch (e) {
    return null;
  }
}

const authInitialState = {
  isLoggedIn: false,
  users: [],
  user: {
    uid: null,
    displayName: null,
    email: null,
    photoURL: null,
    providerId: null,
    idToken: null,
  },
  loginError: null,
  userData: {
    isReadOnly: null,
    isAdmin: null,
    userId: null,
    isTaskCreator: null,
    expiration: null,
    jwt: null,
  },
  endpointIsError: false,
  endpointIsPending: false,
};

// get all users from backend:
export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async () => {
    const api = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_ENDPOINT}`;
    const response = await axios.get(api, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
      },
    });
    return response.data;
  }
);

export const loginEndPointAsyncFunc = createAsyncThunk(
  "auth/loginEndPoint",
  async ({ idToken }, { dispatch }) => {
    const api = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_LOGIN_ENDPOINT}`;
    try {
      const response = await axios.post(api, { idToken });
      const { token: jwtToken, user } = response.data;
      console.log(user);

      if (!jwtToken || !user) {
        throw new Error("Invalid response from server");
      }

      const decodedToken = parseJwt(jwtToken);
      const expirationTime = decodedToken ? decodedToken.exp * 1000 : null;

      sessionStorage.setItem("jwt", jwtToken);
      if (expirationTime) {
        sessionStorage.setItem("tokenExpiration", expirationTime);
      }
      sessionStorage.setItem("userData", JSON.stringify(user));

      dispatch(getAllUsers());

      return {
        isReadOnly: user.role === "READ_ONLY_USER",
        isAdmin: user.role === "ADMIN",
        isTaskCreator: user.role === "TASK_CREATOR",
        userId: user._id,
        expiration: expirationTime,
        jwt: jwtToken,
      };
    } catch (error) {
      return Promise.reject(error.message || "Backend login failed");
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response?.user;
      const idToken = response?.user?.accessToken;

      // wait for backend API call
      await dispatch(loginEndPointAsyncFunc({ idToken })).unwrap();

      return {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        providerId: user.providerId,
        idToken: idToken,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Google login failed");
    }
  }
);


export const logoutWithGoogle = createAsyncThunk(
  "auth/logoutWithGoogle",
  async () => {
    try {
      await signOutFunc();
      sessionStorage.removeItem("jwt");
      sessionStorage.removeItem("tokenExpiration");
      sessionStorage.removeItem("userData");
      return true;
    } catch (error) {
      return Promise.reject(error.message || "Google logout failed");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (userId, { dispatch, rejectWithValue }) => {
    const api = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_ENDPOINT
      }/${userId}`;
    try {
      await axios.delete(api, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
      });
      toast.success("User Delted successfully!", {
        position: "bottom-center",
        autoClose: 5000,
      });
      dispatch(getAllUsers());
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createUser = createAsyncThunk(
  "auth/createUser", async (userData, { dispatch, rejectWithValue }) => {
    const api = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_ENDPOINT}`;
    try {
      const response = await axios.post(api, userData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
      });
      dispatch(getAllUsers());
      toast.success("User created successfully!", {
        position: "bottom-center",
        autoClose: 5000,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateuser = createAsyncThunk(
  "auth/updateUser", async ({ userId, userData, loggedUserData }, { dispatch, rejectWithValue }) => {
    const api = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_ENDPOINT}/${userId}`;
    try {
      const response = await axios.put(api, userData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
      });
      if (loggedUserData._id === userId) {
        dispatch(logoutWithGoogle());
      }
      dispatch(getAllUsers());
      toast.success("User updated successfully!", {
        position: "bottom-center",
        autoClose: 5000,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    setInitialAuthData: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user;
      state.userData = action.payload.userData;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoggedIn = false;
        state.loginError = null;
        state.endpointIsPending = true;
        state.endpointIsError = false;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload;
        state.loginError = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = authInitialState.user;
        state.loginError = action.payload;
        state.endpointIsPending = false;
        state.endpointIsError = true;
      })

      .addCase(logoutWithGoogle.pending, (state) => {
        state.isLoggedIn = false;
      })
      .addCase(logoutWithGoogle.fulfilled, (state) => {
        return authInitialState;
      })
      .addCase(logoutWithGoogle.rejected, (state, action) => {
        state.loginError = action.payload;
      })

      .addCase(loginEndPointAsyncFunc.pending, (state) => {
        state.endpointIsPending = true;
        state.endpointIsError = false;
      })
      .addCase(loginEndPointAsyncFunc.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.endpointIsError = false;
        state.endpointIsPending = false;
        state.isLoggedIn = true;
        state.loginError = null;
      })
      .addCase(loginEndPointAsyncFunc.rejected, (state, action) => {
        state.endpointIsError = true;
        state.endpointIsPending = false;
        state.loginError = action.payload;
        state.isLoggedIn = false;
        state.user = authInitialState.user;
        state.userData = authInitialState.userData;
        sessionStorage.removeItem("jwt");
      })
      .addCase(getAllUsers.pending, (state) => {
        state.endpointIsPending = true;
        state.endpointIsError = false;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.endpointIsError = false;
        state.endpointIsPending = false;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.endpointIsError = true;
        state.endpointIsPending = false;
      });
  },
});

export const { setInitialAuthData } = authSlice.actions;
export default authSlice;