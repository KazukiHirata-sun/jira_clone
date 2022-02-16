import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAsyncLogin = createAsyncThunk(
  "auth/login",
  async (auth) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/authen/jwt/create`,
      auth,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/create/`,
      auth,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncGetMyProf = createAsyncThunk(
  "auth/loginuser",
  async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/loginuser/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncCreateProf = createAsyncThunk(
  "auth/createProfile",
  async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/profile/`,
      { img: null },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncGetProfs = createAsyncThunk(
  "auth/getProfiles",
  async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/profile/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncUpdateProf = createAsyncThunk(
  "auth/updateProfile",
  async (profile) => {
    const uploadData = new FormData();
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/profile/${profile.id}/`,
      uploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

const initialState = {
  isLoginView: true,
  loginUser: {
    id: 0,
    username: "",
  },
  profiles: [{ id: 0, user_profile: 0, img: null }],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleMode(state) {
      state.isLoginView = !state.isLoginView;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAsyncLogin.fulfilled,
      (state, action) => {
        localStorage.setItem("localJWT", action.payload.access);
        action.payload.access && (window.location.href = "/tasks");
      }
    );
    builder.addCase(
      fetchAsyncGetMyProf.fulfilled,
      (state, action) => {
        return {
          ...state,
          loginUser: action.payload,
        };
      }
    );
    builder.addCase(
      fetchAsyncGetProfs.fulfilled,
      (state, action) => {
        return {
          ...state,
          profiles: action.payload,
        };
      }
    );
    builder.addCase(
      fetchAsyncUpdateProf.fulfilled,
      (state, action) => {
        return {
          ...state,
          profiles: state.profiles.map((prof) =>
            prof.id === action.payload.id ? action.payload : prof
          ),
        };
      }
    );
  },
});

export const { toggleMode } = authSlice.actions;

export const selectIsLoginView = (state) => state.auth.isLoginView;
export const selectLoginUser = (state) => state.auth.loginUser;
export const selectProfiles = (state) => state.auth.profiles;

export default authSlice.reducer;